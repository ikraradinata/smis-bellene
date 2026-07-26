import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

export function loadEnvFiles(...filenames) {
  for (const filename of filenames) {
    const filePath = path.join(rootDir, filename)
    if (!fs.existsSync(filePath)) continue

    const content = fs.readFileSync(filePath, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const eq = trimmed.indexOf('=')
      if (eq === -1) continue

      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      process.env[key] = value
    }
  }
}

export function getDatabaseHost(url) {
  if (!url) return null
  const match = url.match(/@([^:/]+)/)
  return match ? match[1] : null
}

export function isLocalDatabaseUrl(url) {
  const host = getDatabaseHost(url)
  return host === 'localhost' || host === '127.0.0.1'
}

export function isRemoteDatabaseUrl(url) {
  return Boolean(url) && !isLocalDatabaseUrl(url)
}
