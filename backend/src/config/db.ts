import { Pool } from 'pg'
import { Connector, AuthTypes } from '@google-cloud/cloud-sql-connector'
import 'dotenv/config'

// Configuracion de acceso a Postgres. Produccion usa Cloud SQL Connector; desarrollo se conecta por host/puerto.
const INSTANCE_CONNECTION_NAME = 'elite-caster-474014-u9:europe-southwest1:finne-db'

// Crea y devuelve un pool de conexiones segun el entorno activo.
export async function createPool(): Promise<Pool> {
  let pool: Pool

  if (process.env.NODE_ENV === 'production') {
    // Produccion: se abre la conexion mediante el conector seguro de Cloud SQL e IAM.
    console.log('[DB] Produccion: usando Cloud SQL Connector')
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
    // Desarrollo: conexion directa por IP publica utilizando variables de entorno.
    console.log('[DB] Desarrollo: conexion directa por host/puerto')
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

// Diagnostico basico: verifica que la base de datos responde. Ejecuta un SELECT NOW() y cierra el pool.
async function testConnection() {
  try {
    const pool = await createPool()
    const { rows } = await pool.query('SELECT NOW()')
    console.log('[DB] Conexion correcta:', rows[0])
    await pool.end()
  } catch (err: any) {
    console.error('[DB] Error de conexion:', err.message)
  }
}

testConnection()
