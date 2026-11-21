import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)
const cli = fileURLToPath(new URL('../jsdoc4readme.js', import.meta.url))
const fixtures = fileURLToPath(new URL('fixtures/', import.meta.url))
const source = path.join(fixtures, 'example.js')

// fixtures may be checked out with CRLF on Windows
const read = async (file) => (await fs.readFile(path.join(fixtures, file), 'utf8')).replace(/\r\n/g, '\n')

test('markdown to stdout', async () => {
  const { stdout, stderr } = await run(process.execPath, [cli, source])
  assert.strictEqual(stderr, '')
  assert.strictEqual(stdout, await read('example.md'))
})

test('--description-only', async () => {
  const { stdout } = await run(process.execPath, [cli, '--description-only', source])
  assert.strictEqual(stdout, await read('example-description-only.md'))
})

test('--readme replaces the API section', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'jsdoc4readme-'))
  try {
    await fs.writeFile(path.join(dir, 'README.md'), await read('README-input.md'))
    await run(process.execPath, [cli, '--readme', source], { cwd: dir })
    assert.strictEqual(await fs.readFile(path.join(dir, 'README.md'), 'utf8'), await read('README-expected.md'))
  } finally {
    await fs.rm(dir, { recursive: true, force: true })
  }
})

test('usage without sources', async () => {
  await assert.rejects(run(process.execPath, [cli]), (err) => {
    assert.strictEqual(err.code, 1)
    assert.match(err.stdout, /^Usage:/)
    return true
  })
})
