// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

const fs = require('fs')
const { Transform } = require('stream')
const bl = require('bl')
const split2 = require('split2')

module.exports = function editReadme (readme, markdown) {
  let section = 'head'
  fs.createReadStream(readme)
    .pipe(split2())
    .pipe(new Transform({
      transform (chunk, encoding, callback) {
        const str = chunk.toString()
        if (section === 'api' && str.match(/^## /)) {
          section = 'foot'
        }
        if (section !== 'api') {
          if (section === 'head' && str === '## API') {
            section = 'api'
            return callback(null, `${str}\n\n${markdown}`)
          }
          return callback(null, `${str}\n`)
        }
        callback()
      }
    }))
    .pipe(bl((err, data) => {
      if (err) {
        throw err
      }
      if (section === 'head') {
        throw new Error(`Couldn't find an "## API" section in your ${readme}`)
      }
      if (section === 'api') {
        console.error('Warning: no footer section found, is this correct?')
      }
      fs.writeFileSync(readme, data)
    }))
}
