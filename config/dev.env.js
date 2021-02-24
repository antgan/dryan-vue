'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // SERVER_URL: '"http://localhost:9999/dryan"'
  SERVER_URL: '"http://www.soecode.cn:9999/dryan"'
})
