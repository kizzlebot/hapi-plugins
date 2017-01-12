# @flexshopper/hapi-methods
[![Build Status][travis-badge]][travis-url]
[![Dependencies][david-badge]][david-url]
[![Dev dependencies][david-dev-badge]][david-url]

[travis-badge]: https://travis-ci.com/FlexShopper/hapi-methods.svg?token=Y5c2Yh3HiTw9G5oH7ZkQ&branch=master
[travis-url]: https://travis-ci.com/FlexShopper/hapi-methods
[david-badge]: https://david-dm.org/flexshopper/hapi-methods.svg
[david-dev-badge]: https://david-dm.org/flexshopper/hapi-methods/dev-status.svg
[david-url]: https://david-dm.org/flexshopper/hapi-methods
[david-dev-url]: https://david-dm.org/flexshopper/hapi-methods#info=devDependencies

Plugin to autoload methods based on patterns.

### How to use:
- Install `hapi-methods` npm package in your project our plugin.
`npm i @flexshopper/hapi-methods`
- Register plugin in your hapi server:

### Registering

```javascript
const server = new Hapi.Server();

server.connection();

server.register({
    register: require('hapi-methods'),
    options: {
        relativeTo: proccess.cwd() + '/methods',
        includes: ['path/to/**/*methods.js'],
        ignore: ['*.git'],
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
            register: 'hapi-methods',
            options: {
                relativeTo: proccess.cwd() + '/methods',
                includes: ['path/to/**/*methods.js'],
                ignore: ['*.git'],
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


#### Route Signature
```javascript
'use strict';

const internals = module.exports = {};

internals.myNewMethod = {

    method: (next) => {
        return next();
    },
    options: {
        cache: {
            expiresIn: 60000,
            generateTimeout: 60000
        }
    }
};

internals.anotherMethod = {

    // if method is defined as function(), 'this' value is bound to server instance
    method: function(next) {

        // 'this' is bound to server, thus it is equal to hapi server instance
        expect(this.plugins).to.exist();

        return next();
    }
};

// This methods would be available as:

server.methods.methodFileName.myNewMethod();
server.methods.methodFileName.anotherMethod();
```

### Filename adapting
No matter what format your filenames are in, use camelcase to access the method.

For example, if a method file name is: `foo-bar.js`, it has a method named myMethod() inside.
You can access this method as:
```javascript
server.methods.fooBar.myMethod();
```

### 'this' binding
If `internals.anotherMethod.method` is equal to regular function (non-arrow function)
'this' will be bound to instance of `server`.

