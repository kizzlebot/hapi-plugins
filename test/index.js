'use strict';

const Info = require('../package');
const Plugin = require('../');
const Hapi = require('hapi');
const Async = require('async');

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const beforeEach = lab.beforeEach;

describe(Info.name + ' startup', () => {

    it('it register successfully.', (done) => {

        const server = new Hapi.Server();
        server.register(Plugin, (err) => {

            expect(err).to.not.exist();

            return done();
        });
    });

    it('should fails for invalid options: (includes not array).', (done) => {

        const server = new Hapi.Server();
        server.register({
            register: Plugin,
            options: {
                includes: 'string not an array'
            }
        }, (err) => {

            expect(err).to.exist();
            expect(err).to.be.an.instanceof(Error);

            return done();
        });
    });

    it('should fails for invalid options: (ignore not array).', (done) => {

        const server = new Hapi.Server();
        server.register({
            register: Plugin,
            options: {
                ignore: 'string not an array'
            }
        }, (err) => {

            expect(err).to.exist();
            expect(err).to.be.an.instanceof(Error);

            return done();
        });
    });

    it('should fails for invalid options: (relativeTo not valid path).', (done) => {

        const server = new Hapi.Server();
        server.register({
            register: Plugin,
            options: {
                relativeTo: 'string not an array'
            }
        }, (err) => {

            expect(err).to.exist();
            expect(err).to.be.an.instanceof(Error);

            return done();
        });
    });

    it('should fails for invalid options: (relativeTo is a file).', (done) => {

        const server = new Hapi.Server();
        server.register({
            register: Plugin,
            options: {
                relativeTo: `${process.cwd()}/test/artifacts/plugin1.js`
            }
        }, (err) => {

            expect(err).to.exist();
            expect(err).to.be.an.instanceof(Error);

            return done();
        });
    });

    it('should accept a valid relativeTo path in options.', (done) => {

        const server = new Hapi.Server();
        server.register({
            register: Plugin,
            options: {
                relativeTo: `${process.cwd()}/test/artifacts`
            }
        }, (err) => {
            expect(err).to.not.exist();
            return done();
        });
    });
});

describe(Info.name + ' register method.', () => {

    let server;

    beforeEach((done) => {

        server = new Hapi.Server();
        server.connection();

        return done();
    });

    it('should load plugins from glob pattern match.', (done) => {

        const twoOpts = { name: 'james' };
        server.register({
            register: Plugin,
            options: {
                relativeTo: `${process.cwd()}/test/artifacts/`,
                includes: [
                    'plugin1.js',
                    'plugin2.js'
                ],
                plugins: {
                    two: twoOpts
                }
            }
        }, (err) => {

            expect(err).to.not.exist();
            expect(server.one).to.exist();
            expect(server.one).to.be.a.function();
            expect(server.two).to.exist();
            expect(server.two).to.be.a.function();
            expect(server.two()).to.equal(twoOpts);

            return done(err);
        });
    });

    it('should not register plugin if plugin.attributes.name isnt defined', (done) => {

        const twoOpts = { name: 'james' };
        server.register({
            register: Plugin,
            options: {
                relativeTo: process.cwd() + '/test/artifacts/',
                includes: [
                    '*.js'
                ],
                plugins: {
                    two: twoOpts
                }
            }
        }, (err) => {
            expect(err).to.not.exist();
            expect(server.noattrs).to.not.exist();

            expect(server.one).to.exist();
            expect(server.one).to.be.a.function();
            expect(server.two).to.exist();
            expect(server.two).to.be.a.function();
            expect(server.two()).to.equal(twoOpts);

            return done(err);
        });
    });

    it('should not register anything if no glob match', (done) => {

        const twoOpts = { name: 'james' };
        server.register({
            register: Plugin,
            options: {
                relativeTo: process.cwd() + '/test/artifacts/',
                includes: [
                    '*.spec.js'
                ]
            }
        }, (err) => {
            expect(err).to.not.exist();
            expect(server.noattrs).to.not.exist();
            return done(err);
        });
    });



});
