import {expect} from 'chai'
import chai from 'chai'
import * as plugiator from 'plugiator'
import remi from 'remi'
import expose from '..'

describe('plugin expose', () => {
  let app
  let registrator

  beforeEach(() => {
    app = {}
    registrator = remi(app)
    registrator.hook(expose())
  })

  it('should expose property', (done) => {
    const plugin = plugiator.create('plugin', (app, opts, next) => {
      app.expose('foo', 1)
      next()
    })

    return registrator
      .register({ register: plugin })
      .then(() => expect(app.plugins.plugin.foo).to.eq(1))
      .then(() => done())
  })

  it('should expose object', (done) => {
    const plugin = plugiator.create('plugin', (app, options, next) => {
      app.expose({
        foo: 1,
        bar: 3,
      })
      next()
    })

    return registrator
      .register({ register: plugin })
      .then(() => {
        expect(app.plugins.plugin.foo).to.eq(1)
        expect(app.plugins.plugin.bar).to.eq(3)
      })
      .then(() => done())
  })

  it('should have a plugin namespace in plugins', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      expect(app.plugins.fooPlugin).to.be.not.undefined
      next()
    })

    return registrator
      .register({ register: plugin })
      .then(() => expect(app.plugins.fooPlugin).to.be.not.undefined)
      .then(() => done())
  })

  it('should not camel case the plugin namespace', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      expect(app.plugins['foo-plugin']).to.be.not.undefined
      next()
    })

    const registrator = remi(app)
    registrator.hook(expose({ camelCase: false }))

    return registrator.register({ register: plugin })
      .then(() => expect(app.plugins['foo-plugin']).to.be.not.undefined)
      .then(() => done())
  })

  it('should share the plugin namespace through register invocations', (done) => {
    const plugin = plugiator.create('foo-plugin', (app, options, next) => {
      expect(app.plugins.fooPlugin).to.be.not.undefined
      next()
    })

    return registrator
      .register({ register: plugin })
      .then(() => {
        expect(app.plugins.fooPlugin).to.be.not.undefined

        return registrator.register({ register: plugiator.noop() })
      })
      .then(() => {
        expect(app.plugins).to.be.not.undefined
        expect(app.plugins.fooPlugin).to.be.not.undefined
      })
      .then(() => done())
  })
})
