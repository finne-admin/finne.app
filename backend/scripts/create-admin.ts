import 'dotenv/config'
import bcrypt from 'bcrypt'
import { getPool } from '../src/config/dbManager'
import { findUserByEmail, insertUser } from '../src/db/queries/userQueries'
import { findRoleByName } from '../src/db/queries/roleQueries'

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const firstName = process.env.ADMIN_FIRST_NAME || 'Admin'
  const lastName = process.env.ADMIN_LAST_NAME || 'User'
  const dateOfBirth: string | null = process.env.ADMIN_DATE_OF_BIRTH || null
  const sex: string | null = process.env.ADMIN_SEX || null

  if (!email || !password) {
    console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment')
    process.exit(1)
  }

  const pool = await getPool()

  const existing = await findUserByEmail(email)
  const hashedPassword = await bcrypt.hash(password, 10)

  const adminRole = await findRoleByName('admin')

  if (!existing) {
    const user = await insertUser({
      firstName,
      lastName,
      email,
      hashedPassword,
      dateOfBirth,
      sex,
      roleId: adminRole.id,
      accountStatus: 'active',
    })
    console.log('✅ Admin user created:', { id: user.id, email: user.email })
  } else {
    // Ensure role admin and set/replace password hash in credentials
    await pool.query('UPDATE users SET role_id = $2 WHERE id = $1', [existing.id, adminRole.id])
    // upsert credentials
    const { rowCount } = await pool.query('UPDATE credentials SET password_hash = $2 WHERE user_id = $1', [existing.id, hashedPassword])
    if (rowCount === 0) {
      await pool.query('INSERT INTO credentials (user_id, password_hash) VALUES ($1, $2)', [existing.id, hashedPassword])
    }
    console.log('✅ Admin user updated:', { id: existing.id, email })
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
