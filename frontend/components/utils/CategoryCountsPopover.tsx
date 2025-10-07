'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Loader2, BarChart2 } from 'lucide-react'

type Row = { category: string; count: number }

export default function CategoryCountsPopover() {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [rows, setRows] = useState<Row[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCounts = async () => {
    setLoading(true); setError(null)
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user?.id
    if (!userId) { setRows([]); setLoading(false); return }

    const { data: pausas, error: e1 } = await supabase
      .from('active_pauses')
      .select('video1_id, video2_id')
      .eq('user_id', userId)
    if (e1) { setError(e1.message); setLoading(false); return }

    const ocurrencias = (pausas ?? [])
      .flatMap(p => [p.video1_id, p.video2_id])
      .filter(Boolean) as string[]
    if (!ocurrencias.length) { setRows([]); setLoading(false); return }

    const uniqueIds = Array.from(new Set(ocurrencias))
    const { data: vids, error: e2 } = await supabase
      .from('videos')
      .select('id, categorias')
      .in('id', uniqueIds)
    if (e2) { setError(e2.message); setLoading(false); return }

    const catById = new Map(vids!.map(v => [v.id, (v.categorias ?? []) as string[]]))
    const counts = new Map<string, number>()
    for (const id of ocurrencias) {
      for (const c of (catById.get(id) ?? [])) {
        counts.set(c, (counts.get(c) ?? 0) + 1)
      }
    }

    const list = Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))

    setRows(list); setLoading(false)
  }

  useEffect(() => {
    fetchCounts()
    const ch = supabase
      .channel('active_pauses_counts_ui')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'active_pauses' }, fetchCounts)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart2 className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Historial</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <div className="text-sm font-semibold mb-2">Tus ejercicios por categoría</div>
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
        {!error && (
          <ul className="divide-y">
            {(rows?.length ? rows : [{ category: '—', count: 0 }]).map(r => (
              <li key={r.category} className="flex items-center justify-between py-2 text-sm">
                <span className="opacity-80">{r.category}</span>
                <span className="font-medium">{r.count}</span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
