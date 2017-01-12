# @kizzlebot/hapi-plugins
[![Build Status][travis-badge]][travis-url]
[![Dependencies][david-badge]][david-url]
[![Dev dependencies][david-dev-badge]][david-url]

[travis-badge]: https://travis-ci.com/FlexShopper/hapi-plugins?token=Y5c2Yh3HiTw9G5oH7ZkQ&branch=master
[travis-url]: https://travis-ci.com/FlexShopper/hapi-plugins
[david-badge]: https://david-dm.org/flexshopper/hapi-plugins.svg
[david-dev-badge]: https://david-dm.org/flexshopper/hapi-plugins/dev-status.svg
[david-url]: https://david-dm.org/flexshopper/hapi-plugins
[david-dev-url]: https://david-dm.org/flexshopper/hapi-plugins#info=devDependencies

Plugin to autoload plugins given relative path and glob pattern.  Optionally, `options.plugins[pluginName]` can be used to pass arguments to plugins

### How to use:
- Install `hapi-plugins` npm package in your project our plugin.
`npm i @flexshopper/hapi-plugins`
- Register plugin in your hapi server:

### Registering

```javascript
const server = new Hapi.Server();

server.connection();

server.register({
    register: require('hapi-plugins'),
    options: {
        relativeTo: proccess.cwd() + '/plugins',
        includes: ['path/to/**/*plugins.js'],
        ignore: ['*.git'],
        // plugin options
        plugins: {
            myPlugin: {
                host: '192.168.1.1'
            }
        }
    }
}, (err) => {
  // continue application
});
```

manifest style:
```javascript
registrations: [
    ...
    {
        plugin: {
            register: 'hapi-plugins',
            options: {
                relativeTo: proccess.cwd() + '/plugins',
                includes: ['path/to/**/*plugins.js'],
                ignore: ['*.git'],
                // plugin options
                plugins: {
                    myPlugin: {
                        host: '192.168.1.1'
                    }
                }
            }
        }
    }
];
```

### Options
##### includes

*Required* <br/>
Type: `array`

The [glob](https://github.com/isaacs/node-glob) pattern you would like to include

##### ignore

Type: `array`

The pattern or an array of patterns to exclude

##### relativeTo

Type: `string`

The current working directory in which to search (defaults to `process.cwd()`)

##### plugins

Type: `object`

key-value where `key` is your plugin name (ie `internals.register.attributes.name`) and value is options to pass to plugin


#### Route Signature
```javascript
'use strict';

const internals = module.exports = {};
internals.register = (server, options, next) => {
    // ...do stuff

    return next();
};

internals.register.attributes = {
    name: 'myplugin:',
    version: '0.0.1'
};

```
