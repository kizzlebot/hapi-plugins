'use strict';

const internals = module.exports = {};
internals.register = (server, options, next) => {
    server.decorate('server', 'one', () => {});
    return next();
};

internals.register.attributes = {
    name: 'one',
    version: '0.0.1'
};
