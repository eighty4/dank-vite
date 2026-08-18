#!/usr/bin/env node

import { join } from 'node:path'
import { copyFile, mkdir } from 'node:fs/promises'

const projectDir = join(import.meta.dirname, '..')
const MKDIRS = ['client']
for (const subdir of MKDIRS) {
    await mkdir(join(projectDir, subdir), { recursive: true })
}

const COPY_FROM_PKG = {
    'client/build/bootstrap.page.js': 'client/bootstrap.page.js',
}
const packageDir = join(projectDir, 'node_modules/@eighty4/dank')
for (const [from, to] of Object.entries(COPY_FROM_PKG)) {
    await copyFile(join(packageDir, from), join(projectDir, to))
    console.log(`\u001b[32m✔\u001b[0m`, 'copied', to, 'from @eighty4/dank')
}
