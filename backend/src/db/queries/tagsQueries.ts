import { getPool } from "../../config/dbManager"

const parsePgArray = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value !== "string") return []
  const trimmed = value.trim()
  if (!trimmed) return []
  const withoutBraces = trimmed.replace(/^\{|\}$/g, "")
  if (!withoutBraces) return []
  return withoutBraces
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((item) => item.trim().replace(/^"|"$/g, ""))
    .filter(Boolean)
}

export const getTagsByVideoHashesQuery = async (videoHashes: string[]) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT wistia_id, categorias AS categories
    FROM videos
    WHERE wistia_id = ANY($1)
    `,
    [videoHashes]
  )

  return rows.map((r) => ({
    wistia_id: r.wistia_id,
    categories: parsePgArray(r.categories),
  }))
}
