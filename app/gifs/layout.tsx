'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const tabs = [
  { name: 'Trending', href: '/gifs/trending' },
  { name: 'Search', href: '/gifs/search' },
  { name: 'Stickers', href: '/gifs/stickers' },
]

export default function GifsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="flex justify-center gap-6 py-4 bg-black text-white w-full border-b border-gray-800 sticky top-0 z-10">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`text-lg px-4 py-2 rounded ${
              pathname === tab.href
                ? 'bg-white text-black font-bold'
                : 'hover:underline'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="flex-1 w-full">{children}</div>
    </div>
  )
}