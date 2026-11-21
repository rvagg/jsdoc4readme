// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

import fs from 'node:fs'

/**
 * Replace the content between an `## API` heading and the next `## ` heading.
 *
 * @param {string} readme - Path to the README file
 * @param {string} markdown - Replacement API content
 */
export default function editReadme (readme, markdown) {
  const lines = fs.readFileSync(readme, 'utf8').split(/\r?\n/)
  if (lines.at(-1) === '') {
    lines.pop()
  }

  const start = lines.indexOf('## API')
  if (start === -1) {
    throw new Error(`Couldn't find an "## API" section in your ${readme}`)
  }
  let end = lines.findIndex((l, i) => i > start && l.startsWith('## '))
  if (end === -1) {
    console.error('Warning: no footer section found, is this correct?')
    end = lines.length
  }

  const join = (ls) => ls.map((l) => `${l}\n`).join('')
  fs.writeFileSync(readme, `${join(lines.slice(0, start + 1))}\n${markdown}${join(lines.slice(end))}`)
}
