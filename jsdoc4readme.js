#!/usr/bin/env node

// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

import fs from 'node:fs'
import runJsdoc from './run-jsdoc.cjs'
import toMarkdown from './to-markdown.js'
import editReadme from './edit-readme.js'

const sources = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const readme = process.argv.includes('--readme') &&
  fs.readdirSync(process.cwd()).find((f) => f.match(/^readme\.(markdown|md)/i))
const descOnly = process.argv.includes('--description-only')

if (!sources.length) {
  console.log('Usage: <jsdoc4readme> [--readme] [--description-only] source1.js[, source2.js...]')
  process.exit(1)
}

const docs = runJsdoc(sources).filter((d) => {
  return !d.undocumented &&
    d.ignore !== true &&
    d.access !== 'private' &&
    (!descOnly || d.description !== undefined)
})

// Uncomment these lines to see the raw jsdoc output
// docs.forEach((d) => delete d.meta)
// console.log(JSON.stringify(docs, null, 2))

if (!docs.length) {
  throw new Error('Error: no jsdoc content found!')
}

const markdown = toMarkdown(docs)

if (readme) {
  editReadme(readme, markdown)
} else {
  process.stdout.write(markdown)
}
