#!/usr/bin/env node

// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

const fs = require('fs')
const runJsdoc = require('./run-jsdoc')
const toMarkdown = require('./to-markdown')
const editReadme = require('./edit-readme')

const sources = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const readme = process.argv.includes('--readme') &&
  fs.readdirSync(process.cwd()).find((f) => f.match(/^readme\.(markdown|md)/i))

if (!sources.length) {
  console.log('Usage: <jsdoc4readme> [--readme] source1.js[, source2.js...]')
  process.exit(1)
}

const docs = runJsdoc(sources).filter((d) => !d.undocumented)
// Uncommont these lines if you want to see the usable output
// docs.forEach((d) => delete d.meta)
// console.error(JSON.stringify(docs, null, 2))

if (!docs.length) {
  throw new Error('Error: no jsdoc content found!')
}

const markdown = toMarkdown(docs)

if (readme) {
  editReadme(readme, markdown)
} else {
  process.stdout.write(markdown)
}
