// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

const path = require('path')
const jsdocSrc = path.join(path.dirname(require.resolve('jsdoc/jsdoc.js')), 'lib')

// run jsdoc, it's ... complicated
// require()'s are inline because the order of some of them matters
module.exports = function runJsdoc (sources) {
  // sadly we require this abomination because jsdoc uses non-standard CJS module paths
  require = require('requizzle')({ // eslint-disable-line
    requirePaths: { before: [ jsdocSrc ] },
    infect: true
  })
  const Config = require('jsdoc/lib/jsdoc/config')
  const config = new Config().get()
  const env = require('jsdoc/lib/jsdoc/env')
  env.conf = config
  const parser = require('jsdoc/lib/jsdoc/src/parser').createParser(config.parser)
  const handlers = require('jsdoc/lib/jsdoc/src/handlers')
  handlers.attachTo(parser)
  const augment = require('jsdoc/lib/jsdoc/augment')
  const borrow = require('jsdoc/lib/jsdoc/borrow')
  let docs = parser.parse(sources)
  borrow.indexAll(docs)
  augment.augmentAll(docs)
  borrow.resolveBorrows(docs)
  return docs
}
