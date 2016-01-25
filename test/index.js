'use strict'
const chai = require('chai')
const expect = chai.expect

const plugiator = require('plugiator')
const Remi = require('remi')
const expose = require('..')

describe('plugin expose', function() {
  let app
  let remi

  beforeEach(function() {
    app = {}
    remi = new Remi({ extensions: [{ extension: expose }] })
  })

  it('should expose property', function() {
    return remi.register(
        app,
        [plugiator.create('plugin', (app, opts) => app.expose('foo', 1))]
      )
      .then(() => expect(app.plugins.plugin.foo).to.eq(1))
  })

  it('should expose object', function() {
    let plugin = plugiator.create('plugin', (app, options) => {
      app.expose({
        foo: 1,
        bar: 3,
      })
    })

    return remi.register(app, [plugin])
      .then(() => {
        expect(app.plugins.plugin.foo).to.eq(1)
        expect(app.plugins.plugin.bar).to.eq(3)
      })
  })

  it('should have a plugin namespace in plugins', function() {
    let plugin = plugiator.create('foo-plugin', (app, options) => {
      expect(app.plugins.fooPlugin).to.be.not.undefined
    })

    return remi.register(app, [plugin])
      .then(() => expect(app.plugins.fooPlugin).to.be.not.undefined)
  })

  it('should not camel case the plugin namespace', function() {
    let plugin = plugiator.create('foo-plugin', (app, options) => {
      expect(app.plugins['foo-plugin']).to.be.not.undefined
    })

    let remi = new Remi({
      extensions: [{
        extension: expose,
        options: { camelCase: false },
      },],
    })
    return remi.register(app, [plugin])
      .then(() => expect(app.plugins['foo-plugin']).to.be.not.undefined)
  })

  it('should share the plugin namespace through register invocations', function() {
    let plugin = plugiator.create('foo-plugin', (app, options) => {
      expect(app.plugins.fooPlugin).to.be.not.undefined
    })

    return remi
      .register(app, [plugin], {})
      .then(() => {
        expect(app.plugins.fooPlugin).to.be.not.undefined

        return remi.register(app, [plugiator.noop()], {})
      })
      .then(() => {
        expect(app.plugins).to.be.not.undefined
        expect(app.plugins.fooPlugin).to.be.not.undefined
      })
  })
})
