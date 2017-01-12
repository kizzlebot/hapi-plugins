'use strict';

const internals = module.exports = {};
internals.register = (server, options, next) => {
    server.decorate('server', 'two', () => options);
    return next();
};

internals.register.attributes = {
    pkg: {
        name: 'two',
        version: '0.0.1'
    }
};
