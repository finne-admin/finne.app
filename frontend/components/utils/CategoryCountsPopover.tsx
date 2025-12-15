'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

export default function CategoryCountsPopover() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2"
      onClick={() => router.push('/library')}
    >
      <BookOpen className="h-4 w-4" />
      <span className="ml-2 hidden sm:inline">Biblioteca</span>
    </Button>
  )
}
