'use strict'
const camelCase = require('camelcase')

module.exports = function(remi, opts) {
  function getPluginName(plugin) {
    if (opts.camelCase === false) return plugin.name

    return camelCase(plugin.name)
  }

  remi.pre('createPlugin', function(next, target, plugin) {
    let pluginName = getPluginName(plugin)

    target.plugins = target.plugins || {}
    target.root.plugins = target.plugins

    target.plugins[pluginName] = {}

    next(Object.assign({}, target, {
      expose(key, value) {
        if (typeof key === 'string') {
          target.plugins[pluginName][key] = value
          return
        }
        target.plugins[pluginName] = Object.assign({}, target.plugins[pluginName], key)
      },
    }), plugin)
  })
}
