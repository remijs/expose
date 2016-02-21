'use strict'
const camelCase = require('camelcase')

module.exports = opts => {
  opts = opts || {}

  function getPluginName(plugin) {
    if (opts.camelCase === false) return plugin.name

    return camelCase(plugin.name)
  }

  return (next, target, plugin, cb) => {
    const pluginName = getPluginName(plugin)

    target.plugins = target.plugins || {}
    target.root.plugins = target.plugins

    target.plugins[pluginName] = {}

    next(Object.assign({}, target, {
      expose(key, value) {
        if (typeof key === 'string') {
          target.plugins[pluginName][key] = value
          return
        }

        target.plugins[pluginName] = Object.assign(
          {},
          target.plugins[pluginName],
          key
        )
      },
    }), plugin, cb)
  }
}
