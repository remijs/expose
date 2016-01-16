# remi-expose

A remi extension that adds the expose method to the target

[![Dependency Status](https://david-dm.org/zkochan/remi-expose/status.svg?style=flat)](https://david-dm.org/zkochan/remi-expose)
[![Build Status](https://travis-ci.org/zkochan/remi-expose.svg?branch=master)](https://travis-ci.org/zkochan/remi-expose)
[![npm version](https://badge.fury.io/js/remi-expose.svg)](http://badge.fury.io/js/remi-expose)
[![Coverage Status](https://coveralls.io/repos/zkochan/remi-expose/badge.svg?branch=master&service=github)](https://coveralls.io/github/zkochan/remi-expose?branch=master)


## Installation

```
npm i remi-expose
```


## Usage

Registering the extension

```js
const Remi = require('remi')
const remiExpose = require('remi-expose')

let remi = new Remi({
  extensions: [remiExpose],
})
```

Once the remi-expose extension is registered, the remi plugins can expose values.

## app.expose(key, value)

Used within a plugin to expose a property via app.plugins[name] where:

* `key` - the key assigned (`server.plugins[name][key]`).
* `value` - the value assigned.

```js
exports.register = function(app, opts) {
  app.expose('util', () => console.log('something'))
}
```


## server.expose(obj)

Merges a shallow copy of an object into to the existing content of `server.plugins[name]` where:

* `obj` - the object merged into the exposed properties container.

```js
exports.register = function(app, opts) {
  app.expose({
    util() {
      console.log('something')
    },
  })
}
```


## License

MIT
