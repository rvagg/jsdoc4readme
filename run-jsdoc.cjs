// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

const path = require('node:path')
const jsdocSrc = path.join(path.dirname(require.resolve('jsdoc/jsdoc.js')), 'lib')

// run jsdoc, it's ... complicated
// require()'s are inline because the order of some of them matters
module.exports = function runJsdoc (sources) {
  // sadly we require this abomination because jsdoc uses non-standard CJS module paths
  require = require('requizzle')({ // eslint-disable-line
    requirePaths: { before: [jsdocSrc] },
    infect: true
  })
  // catharsis only understands Closure-style types; keep anything it rejects
  // (TypeScript syntax such as `import('x').Y`, `() => T`, `A & B`) verbatim
  const catharsis = require('catharsis')
  const parse = catharsis.parse
  catharsis.parse = function (expr, options) {
    try {
      return parse.call(this, expr, options)
    } catch (e) {
      return { type: catharsis.Types.NameExpression, name: expr.trim() }
    }
  }
  const Config = require('jsdoc/lib/jsdoc/config')
  const config = new Config().get()
  const env = require('jsdoc/lib/jsdoc/env')
  env.conf = config
  const parser = require('jsdoc/lib/jsdoc/src/parser').createParser(config.parser)
  const handlers = require('jsdoc/lib/jsdoc/src/handlers')
  handlers.attachTo(parser)
  const augment = require('jsdoc/lib/jsdoc/augment')
  const docs = parser.parse(sources)
  augment.augmentAll(docs)
  return docs
}
