'use client'

import React from 'react'
import Link from 'next/link'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mountain, Home, Target, ClipboardList, Flame, Calendar, LogOut } from 'lucide-react'

export function Sidebar() {
  const menuItems = [
    { href: "/dashboard", icon: Home, label: "Overview" },
    { href: "#", icon: Target, label: "Goal Management" },
    { href: "/dashboard/workouts", icon: ClipboardList, label: "Browse Workouts" },
    { href: "/dashboard/exercise-log/create", icon: Flame, label: "Create Exercise Log" },
    { href: "/dashboard/exercise-log", icon: Calendar, label: "View Previous Exercise" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-full w-14 flex-col border-r bg-background sm:w-60">
      <div className="flex h-14 items-center justify-between border-b px-4 sm:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Mountain className="h-6 w-6" />
          <span className="hidden text-lg font-semibold sm:block">Fitness Tracker</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4 py-6 sm:px-6">
        <nav>
          <ul className="grid gap-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${index === 0
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  prefetch={false}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  )
}
