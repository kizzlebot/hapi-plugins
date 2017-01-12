'use strict';

const Joi = require('joi');
const Hoek = require('hoek');
const async = require('async');
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const path = require('path');

const internals = module.exports = {};

const schema = Joi.object().keys({
    plugins: Joi.object(),
    includes: Joi.array().items(Joi.string()).default([]),
    options: Joi.object().keys({
        nodir: Joi.boolean().default(true),
        strict: Joi.boolean().default(true),
        cwd: Joi.string().default(process.cwd()),
        ignore: Joi.array().items(Joi.string()).default([])
    })
});

internals.register = function (server, options, next) {

    async.auto({
        globValidation: (taskDone) => {

            Joi.validate({
                includes: options.includes,
                options: {
                    cwd: options.relativeTo,
                    ignore: options.ignore
                }
            }, schema, taskDone);
        },
        relativeTo: ['globValidation', (deps, taskDone) => {

            if (!options.relativeTo) {
                return taskDone(null, null);
            }

            fs.stat(options.relativeTo, (err, stats) => {

                if (err) {
                    return taskDone(err);
                }

                if (!stats.isDirectory()) {
                    return taskDone(new Error('relativeTo must be an valid directory.'));
                }

                return taskDone(null, options.relativeTo);
            });
        }],
        files: ['relativeTo', (deps, taskDone) => {

            const globValidation = deps.globValidation;
            let files = [];

            for (let i = globValidation.includes.length - 1; i >= 0; i--) {
                const pattern = globValidation.includes[i];
                files = Hoek.merge(files, glob.sync(pattern, globValidation.options));
            }

            return taskDone(null, files);
        }],

        /*
         * Requires each file, and then
         * checks that module.attributes.name OR module.attributes.pkg.name
         * is defined on exported function, then creates an array to pass to
         * server.register
         */
        require: ['files', (resp, taskDone) => {

            const globValidation = resp.globValidation;


            const rtn = resp.files.reduce((prev, curr) => {

                const pluginPath = path.join(globValidation.options.cwd, curr);
                const pluginModule = require(pluginPath);
                if (_.isEmpty(pluginModule) || _.isEmpty(pluginModule.register)){
                    return prev;
                }
                const moduleName = Hoek.reach(pluginModule.register, 'attributes.name', {
                    default: Hoek.reach(pluginModule.register, 'attributes.pkg.name', {
                        default: null
                    })
                });


                if (_.isString(moduleName)){
                    prev.push({
                        register: pluginModule.register,
                        options: Hoek.reach(options, `plugins.${moduleName}`, {
                            default: {}
                        })
                    });
                }
                return prev;

            }, []);

            return taskDone(null, rtn);
        }],

        register: ['require', (deps, taskDone) => {

            if (deps.require.length < 1){
                return taskDone(null);
            }
            const toRegister = deps.require;
            return server.register(toRegister, taskDone);


            // return taskDone(null, null);
        }]
    }, next);
};

internals.register.attributes = {
    //pkg: require('../package.json')
    name: 'hapi-flex',
    version: '0.0.1'
};
