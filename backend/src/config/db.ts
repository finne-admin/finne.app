import { Pool } from 'pg'
import { Connector, AuthTypes } from '@google-cloud/cloud-sql-connector'
import 'dotenv/config'

const INSTANCE_CONNECTION_NAME = 'elite-caster-474014-u9:europe-southwest1:finne-db'

export async function createPool() {
  let pool

  // Si estamos en producción, usamos el conector seguro de Google Cloud
  if (process.env.NODE_ENV === 'production') {
    console.log('🌐 Modo producción → usando Cloud SQL Connector')
    const connector = new Connector()

    const clientOpts = await connector.getOptions({
      instanceConnectionName: INSTANCE_CONNECTION_NAME,
      authType: AuthTypes.IAM,
    })

    pool = new Pool({
      ...clientOpts,
      user: 'postgres',
      database: 'postgres',
    })
  } else {
    // En desarrollo → conexión directa por IP pública
    console.log('💻 Modo desarrollo → conexión directa')
    pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
      ssl: { rejectUnauthorized: false },
    })
  }

  return pool
}

async function test() {
  try {
    const pool = await createPool()
    const { rows } = await pool.query('SELECT NOW()')
    console.log('✅ Conectado correctamente:', rows[0])
    await pool.end()
  } catch (err: any) {
    console.error('❌ Error de conexión:', err.message)
  }
}

test()
