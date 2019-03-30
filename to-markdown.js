// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

function namedReference (name) {
  return name.replace(/\./g, '-').replace(/#/, '_').replace(/[^\w]/g, '__')
}

function replaceLinks (description) {
  return description.replace(/{@link ([^}]+)}/g, function (r, g) {
    return `[\`${g}\`](#${namedReference(g)})`
  })
}

function descriptor (entry) {
  let d = ''
  if (entry.kind === 'class') {
    d += 'class '
  }
  if (entry.async) {
    d += 'async '
  }
  d += entry.longname
  if (entry.kind === 'function') {
    d += '('
  }
  entry.params && entry.params.filter((p) => p.name.indexOf('.') === -1).forEach((p, i) => {
    if (p.optional) {
      d += '['
    }
    if (i) {
      d += ', '
    }
    d += p.name
    if (p.optional) {
      d += ']'
    }
  })
  if (entry.kind === 'function') {
    d += ')'
  }
  return d
}

function describeProperty (prop, indent) {
  let p = ''
  if (prop.type) {
    p += ` _(\`${prop.type.names.join('|')}\``
    if (prop.optional) {
      p += ', optional'
    }
    if (prop.defaultvalue) {
      p += `, default=\`${prop.defaultvalue}\``
    }
    p += ')_'
  }
  if (prop.description) {
    p += `: ${replaceLinks(prop.description).replace(/\n/g, `\n${indent}  `)}`
  }
  return p
}

function parameter (param) {
  let indents = param.name.replace(/[^.]/g, '').length + 1
  let indent = Array(indents).join('  ')
  // let name = param.name.replace(/^.+\.(.+)$/, '$1') // strip off any nesting prefixes
  let p = `${indent}* **\`${param.name}\`**`
  p += describeProperty(param, indent)
  return p
}

function entryBlock (entry) {
  let b = `<a name="${namedReference(entry.longname)}"></a>\n### \`${descriptor(entry)}\`\n\n`

  if (entry.description) {
    b += `${replaceLinks(entry.description)}\n\n`
  }

  if (entry.params && entry.params.length) {
    b += '**Parameters:**\n\n'
    b += `${entry.params.map(parameter).join('\n')}\n\n`
  }

  if (entry.returns && entry.returns[0]) {
    b += `**Return value** ${describeProperty(entry.returns[0], '')}\n\n`
  }

  return b
}

function toc (docs) {
  return '### Contents\n\n' + docs.map((e) => {
    return ` * [\`${descriptor(e)}\`](#${namedReference(e.longname)})`
  }).join('\n')
}

module.exports = function toMarkdown (docs) {
  return `${toc(docs)}\n\n${docs.map(entryBlock).join('')}`
}
