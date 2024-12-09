'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bell, Settings, HelpCircle, Menu, BellDot, Library, BarChart2, Award, LayoutGrid, LogOut, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import React from "react";

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
      <div className="min-h-screen flex">
        {/* Mobile Sidebar Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed left-2 top-2 z-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
              side="left"
              className="w-80 p-0 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] border-none z-[9999]"
          >
            <MobileNav />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-[#8BC5B5] text-white">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="h-16 border-b bg-white flex justify-between items-center px-4 lg:px-8">
            <div className="flex-1 flex items-center max-w-xl ml-12 lg:ml-0">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3 w-6 h-6 text-gray-500"/>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8BC5B5] focus-visible:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-200">
                <HelpCircle className="h-6 w-6 text-gray-600"/>
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-200">
                <Settings className="h-6 w-6 text-gray-600"/>
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-200">
                <Bell className="h-6 w-6 text-gray-600"/>
              </Button>
              <Avatar size="lg" status="online" className={cn("hover:bg-gray-200")}>
                <AvatarImage src="/path-to-image.jpg" alt="User Name" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="bg-gray-50">{children}</main>
        </div>
      </div>
  )
}

function MobileNav() {
  const pathname = usePathname()

  const menuItems = [
    {icon: BellDot, label: 'Exercise Notification', href: '/notification'},
    {icon: Library, label: 'Exercise Library', href: '/library'},
    {icon: BarChart2, label: 'Statistics', href: '/statistics'},
    {icon: Settings, label: 'Account Settings', href: '/settings'},
    {icon: Award, label: 'Tracking Milestones', href: '/milestones'},
    {icon: LayoutGrid, label: 'Admin Dashboard', href: '/admin'},
  ]

  return (
      <div className="flex flex-col h-full">
        <SheetHeader className="p-6 text-white border-b border-white/10">
          <SheetTitle className="flex items-center justify-between">
            <Image
                src="/logoprincipalRecurso 4@4x.png"
                alt="Finne Logo"
                width={100}
                height={40}
            />
            <SheetClose className="rounded-full p-2 hover:bg-white/10">
              <X className="h-5 w-5 text-white"/>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 px-6 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        "text-white/90 hover:bg-white/10 hover:text-white",
                        pathname === item.href && "bg-white/20 text-white"
                    )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-white hover:bg-white/10 px-4 py-3"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
  )
}

function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: BellDot, label: 'Exercise Notification', href: '/notification' },
    { icon: Library, label: 'Exercise Library', href: '/library' },
    { icon: BarChart2, label: 'Statistics', href: '/statistics' },
    { icon: Settings, label: 'Account Settings', href: '/settings' },
    { icon: Award, label: 'Tracking Milestones', href: '/milestones' },
    { icon: LayoutGrid, label: 'Admin Dashboard', href: '/admin' },
  ]

  return (
      <div className="flex flex-col h-full w-full">
        <div className="p-6">
          <Image
              src="/logoprincipalRecurso 4@4x.png"
              alt="Finne Logo"
              width={100}
              height={40}
              className="mb-8"
          />
          <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        "text-white/90 hover:bg-white/10 hover:text-white",
                        pathname === item.href && "bg-white/20 text-white"
                    )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6">
          <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
  )
}
