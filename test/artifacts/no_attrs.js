'use strict';

const internals = module.exports = {};

internals.register = (server, options, next) => {
    server.decorate('server', 'noattrs', () => {});
    return next();
};
