import { Pool } from 'pg'
import { Connector, AuthTypes } from '@google-cloud/cloud-sql-connector'
import 'dotenv/config'

const INSTANCE_CONNECTION_NAME = 'elite-caster-474014-u9:europe-southwest1:finne-db'

let pool: Pool | null = null

export async function getPool(): Promise<Pool> {
  if (pool) return pool // ✅ reutiliza el pool si ya existe

  console.log('🟢 Inicializando conexión a la base de datos...')

  if (process.env.NODE_ENV === 'production') {
    // 🔒 Producción → Cloud SQL Connector + IAM
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
    // 💻 Local → conexión directa por IP pública
    pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
      ssl: { rejectUnauthorized: false },
    })
  }

  // Log para confirmar que se ha establecido correctamente
  const { rows } = await pool.query('SELECT NOW()')
  console.log('✅ Conexión inicial establecida:', rows[0])

  return pool
}
