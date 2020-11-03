// Copyright Rod Vagg; Licensed under the Apache License, Version 2.0, see README.md for more information

function namedReference (name, constructor) {
  return name.replace(/\./g, '-').replace(/#/, '_').replace(/[^\w]/g, '__') +
    (constructor ? '_constructor' : '')
}

function replaceLinks (description) {
  return description.replace(/{@link ([^ }]+)([^}]+)?}/g, function (r, g, b) {
    if (!b) {
      return `[\`${g}\`](#${namedReference(g)})`
    }
    return `[${b.trim()}](#${namedReference(g)})`
  })
}

function renameType (type) {
  return type.replace(/\.</g, '<').replace(/Array<(.+?)>/g, '$1[]')
}

function isConstructor (entry) {
  return entry.kind === 'class' &&
    entry.alias &&
    entry.alias === entry.name &&
    Array.isArray(entry.params)
}

function descriptor (entry) {
  const constructor = isConstructor(entry)
  let d = ''
  if (constructor) {
    d += 'new '
  } else if (entry.kind === 'class') {
    d += 'class '
  }
  if (entry.async) {
    d += 'async '
  }
  if (entry.generator) {
    d += '* '
  }
  d += entry.longname
  if (entry.kind === 'function' || constructor) {
    d += '('

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

    d += ')'
  }
  return d
}

function describeProperty (prop, indent, parens = true) {
  let p = ''
  if (prop.type) {
    p += ` \`${parens ? '(' : ''}${renameType(prop.type.names.join('|'))}`
    if (prop.optional) {
      p += ', optional'
    }
    if (prop.defaultvalue !== undefined) {
      p += `, default=\`${prop.defaultvalue}\``
    }
    p += `${parens ? ')' : ''}\``
  }
  if (prop.description) {
    p += `: ${replaceLinks(prop.description).replace(/\n/g, `\n${indent}  `)}`
  }
  return p
}

function parameter (param) {
  const indents = param.name.replace(/[^.]/g, '').length + 1
  const indent = Array(indents).join('  ')
  // let name = param.name.replace(/^.+\.(.+)$/, '$1') // strip off any nesting prefixes
  let p = `${indent}* \`${param.name}\``
  p += describeProperty(param, indent)
  return p
}

function entryBlock (entry) {
  let b = `<a name="${namedReference(entry.longname, isConstructor(entry))}"></a>\n### \`${descriptor(entry)}\`\n\n`

  if (entry.classdesc) {
    b += `${replaceLinks(entry.classdesc)}\n\n`
  }

  if (entry.properties && entry.properties.filter(Boolean).length) {
    b += 'Properties:\n\n'
    b += `${entry.properties.filter(Boolean).map(parameter).join('\n')}\n\n`
  }

  // if (entry.kind === 'class' && entry.description) {
  //   b += `<a name="${namedReference(entry.longname)}_new"></a>\n#### Constructor: \`${descriptor(Object.assign({}, entry, { kind: 'constructor' }))}\`\n\n`
  // }

  // don't include parameters if there are no descriptions and this is a class and
  // we have properties ... otherwise it looks like a double-up
  const isClassWithPropertiesAndNoParameterDescriptions = entry.kind !== 'class' || !entry.properties || !entry.properties.length || (entry.params && entry.params.find((p) => p.description))
  if (entry.params && entry.params.length && isClassWithPropertiesAndNoParameterDescriptions) {
    b += `${entry.params.map(parameter).join('\n')}\n\n`
  }

  if (entry.returns && entry.returns[0]) {
    b += `* Returns: ${describeProperty(entry.returns[0], '', false)}\n\n`
  }

  if (entry.description) {
    b += `${replaceLinks(entry.description)}\n\n`
  }

  return b
}

function toc (docs) {
  return '### Contents\n\n' + docs.map((e) => {
    const item = ` * [\`${descriptor(e)}\`](#${namedReference(e.longname, isConstructor(e))})`
    // if (e.kind === 'class' && e.description) {
    //   item += `\n   * [Constructor: \`${descriptor(Object.assign({}, e, { kind: 'constructor' }))}\`](#${namedReference(e.longname)}_new)`
    // }
    return item
  }).join('\n')
}

module.exports = function toMarkdown (docs) {
  return `${toc(docs)}\n\n${docs.map(entryBlock).join('')}`
}
