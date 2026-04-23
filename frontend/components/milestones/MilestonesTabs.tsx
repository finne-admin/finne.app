'use client'

import { SvelteMilestonesTabs } from '@/components/svelte/SvelteMilestonesTabs'

const tabs = [
  { label: 'Perfil', href: '/milestones' },
  { label: 'Logros', href: '/milestones/logros' },
  { label: 'Ranking', href: '/milestones/ranking' },
  // { label: 'Bienestar', href: '/milestones/bienestar' },
]

export function MilestonesTabs() {
  return <SvelteMilestonesTabs tabs={tabs} />
}
