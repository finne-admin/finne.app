'use client'

import { Bell, HelpCircle, Search, Settings, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useTutorialState } from '@/components/tutorial/useTutorial'
import { Tutorial } from '@/components/tutorial/tutorial' 

export function TopBar() {
  const { isOpen, startTutorial, stopTutorial } = useTutorialState()

  return (
    <div className="h-16 border-b flex items-center justify-between px-4 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <Image
          src="/finne-logo.svg"
          alt="Finne"
          width={80}
          height={30}
          className="h-8 w-auto"
        />
        <div className="hidden sm:flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9 w-[200px] md:w-[300px] bg-gray-50"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          onClick={startTutorial}
          title="Iniciar Tutorial"
        >
          <PlayCircle className="h-5 w-5 text-green-600" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
      </div>

      {isOpen && <Tutorial onClose={stopTutorial} />}
    </div>
  )
}
