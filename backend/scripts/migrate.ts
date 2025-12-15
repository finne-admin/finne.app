import 'dotenv/config'
import { getPool } from '../src/config/dbManager'

async function ensureCredentialsTable() {
  const pool = await getPool()

  // Detect if table exists
  const exists = await pool.query(
    `SELECT to_regclass('public.credentials') IS NOT NULL AS exists;`
  )
  const has = (exists.rows?.[0]?.exists as boolean) === true
  if (has) {
    console.log('credentials table already exists')
    return
  }

  // Create credentials table (assumes users.id is UUID)
  // If your users.id is TEXT instead of UUID, replace UUID with TEXT below.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS credentials (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
  console.log('created table credentials')
}

async function main() {
  await ensureCredentialsTable()
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })

