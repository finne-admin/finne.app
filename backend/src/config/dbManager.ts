import { Pool } from 'pg'
import 'dotenv/config'

const INSTANCE_CONNECTION_NAME = process.env.INSTANCE_CONNECTION_NAME || 'elite-caster-474014-u9:europe-southwest1:finne-db'

let pool: Pool | null = null

export async function getPool(): Promise<Pool> {
  if (pool) return pool

  console.log('Inicializando conexión a la base de datos...')

  const USE_CONNECTOR = process.env.NODE_ENV === 'production' || process.env.USE_CLOUD_SQL_CONNECTOR === '1'
  if (USE_CONNECTOR) {
    const { Connector, AuthTypes } = await import('@google-cloud/cloud-sql-connector')
    const connector = new Connector()
    const clientOpts = await connector.getOptions({
      instanceConnectionName: INSTANCE_CONNECTION_NAME,
      authType: AuthTypes.IAM,
    })

    pool = new Pool({
      ...clientOpts,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'postgres',
    })
  } else {
    pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
      ssl: { rejectUnauthorized: false },
    })
  }

  const { rows } = await pool.query('SELECT NOW()')
  console.log('Conexión inicial establecida:', rows[0])
  return pool
}
