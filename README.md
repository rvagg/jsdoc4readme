# jsdoc4readme

**Generate an API section for a README.md from inline JSDocs**

_What? Surely there's other ways to do this already?_ Yes! But I have opinions!

See https://github.com/rvagg/iamap/#api for an example of the generated Markdown from jsdoc4readme.

## Related works

Some related works, along with my rationale for not choosing them for my own use. Follow the links and you may find something that works for you:

* [jsdoc](https://github.com/jsdoc3/jsdoc) - this is used internally by jsdoc4readme, it's designed for producing HTML or a structured output. It doesn't have a Markdown generator (nor an external API). I don't want HTML.
* [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) - works well but overly complex if you have opinions about formatting that deviate too much (plus I experienced some bugs).
* [documentationjs](https://github.com/documentationjs/documentation) - `npm install documentation` ⇒ `added 631 packages from 624 contributors`. Nope nope nope. I'm a simple man with simple needs and _hate_ bloated dependency trees. I also don't like the Markdown formatting.
* [gendo](https://github.com/thlorenz/gendo) - relies on documentationjs and also sets up `gh-pages` for a web version in addition to README editing.

## Install

```sh
npm install jsdoc4readme
```

`-g` to install as a global tool, `-D` to save to a package.json's `devDependencies`.

## Usage

```sh
jsdoc4readme [--readme] <sourcefile>[, <sourcefile>, ...]
```

The `--readme` argument will look for a README.md (or README.markdown, or a case insensitive variant) and replace the block between an `## API` line and the next `##` heading. If you don't supply `--readme`, the Markdown will be printed to standard out and you can do what you like with it.

Add a script to package.json for use as `npm run docs` (after installing with `npm install jsdoc4readme -D`):

```json
  "scripts": {
    "docs": "jsdoc4readme --readme *.js"
  }
```

## License and Copyright

Copyright 2019 Rod Vagg

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
