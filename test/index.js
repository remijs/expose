'use strict'
const chai = require('chai')
const expect = chai.expect

const plugiator = require('plugiator')
const remi = require('remi')
const expose = require('..')

describe('plugin expose', function() {
  let app
  let registrator

  beforeEach(function() {
    app = {}
    registrator = remi(app)
    registrator.hook(expose())
  })

  it('should expose property', function() {
    return registrator.register(
        plugiator.create('plugin', (app, opts, next) => {
          app.expose('foo', 1)
          next()
        })
      )
      .then(() => expect(app.plugins.plugin.foo).to.eq(1))
  })

  it('should expose object', function() {
    let plugin = plugiator.create('plugin', (app, options, next) => {
      app.expose({
        foo: 1,
        bar: 3,
      })
      next()
    })

    return registrator.register([plugin])
      .then(() => {
        expect(app.plugins.plugin.foo).to.eq(1)
        expect(app.plugins.plugin.bar).to.eq(3)
      })
  })

  it('should have a plugin namespace in plugins', function() {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      expect(app.plugins.fooPlugin).to.be.not.undefined
      next()
    })

    return registrator.register([plugin])
      .then(() => expect(app.plugins.fooPlugin).to.be.not.undefined)
  })

  it('should not camel case the plugin namespace', function() {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      expect(app.plugins['foo-plugin']).to.be.not.undefined
      next()
    })

    const registrator = remi(app)
    registrator.hook(expose({ camelCase: false }))

    return registrator.register([plugin])
      .then(() => expect(app.plugins['foo-plugin']).to.be.not.undefined)
  })

  it('should share the plugin namespace through register invocations', function() {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      expect(app.plugins.fooPlugin).to.be.not.undefined
      next()
    })

    return registrator
      .register([plugin])
      .then(() => {
        expect(app.plugins.fooPlugin).to.be.not.undefined

        return registrator.register([plugiator.noop()])
      })
      .then(() => {
        expect(app.plugins).to.be.not.undefined
        expect(app.plugins.fooPlugin).to.be.not.undefined
      })
  })
})
