import { Pool } from 'pg'
import 'dotenv/config'

// Gestor de pool compartido para Postgres. Usa Cloud SQL Connector en produccion (o si se fuerza por env),
// y una conexion directa por host/puerto en desarrollo.
const INSTANCE_CONNECTION_NAME =
  process.env.INSTANCE_CONNECTION_NAME || 'elite-caster-474014-u9:europe-southwest1:finne-db'

let pool: Pool | null = null

export async function getPool(): Promise<Pool> {
  if (pool) return pool

  console.log('[DB] Inicializando pool de conexion...')

  // Produccion o variable explicita: usa Cloud SQL Connector con autenticacion IAM.
  const useConnector =
    process.env.NODE_ENV === 'production' || process.env.USE_CLOUD_SQL_CONNECTOR === '1'

  if (useConnector) {
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
    // Desarrollo: conecta directo usando host/puerto y credenciales de entorno.
    pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 5432,
      ssl: { rejectUnauthorized: false },
    })
  }

  // Valida la conexion inmediatamente para detectar problemas de red o credenciales.
  const { rows } = await pool.query('SELECT NOW()')
  console.log('[DB] Conexion inicial establecida:', rows[0])

  return pool
}
