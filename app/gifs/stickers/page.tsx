'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { toast } from 'react-toastify'

interface Gif {
  id: string
  title: string
  url: string
}

interface GiphyApiResponse {
  data: {
    id: string
    title: string
    images: {
      original: {
        url: string
      }
    }
  }[]
}

export default function StickersPage() {
  const [stickers, setStickers] = useState<Gif[]>([])

  const fetchTrendingStickers = async () => {
    try {
      const res = await axios.get<GiphyApiResponse>('/api/giphy?type=stickers')
      const stickerData = res.data.data.map((sticker) => ({
        id: sticker.id,
        title: sticker.title,
        url: sticker.images.original.url,
      }))

      setStickers(stickerData)
    } catch (error) {
      console.error('Error fetching stickers:', error)
      toast.error('Failed to fetch stickers')
    }
  }

  const handleDownload = async (url: string, title: string) => {
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${title || 'sticker'}.gif`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('Sticker downloaded!')
  }

  useEffect(() => {
    fetchTrendingStickers()
  }, [])

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center">
      <h1 className="text-2xl font-bold py-4">Trending Stickers</h1>

      <div className="flex-1 w-full max-w-5xl px-4 overflow-y-auto space-y-4 pb-4">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            className="bg-black border border-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-md font-semibold mb-2">{sticker.title}</h2>
            <div className="relative w-full h-auto max-h-[300px]">
              <Image
                src={sticker.url}
                alt={sticker.title}
                width={300}
                height={300}
                className="rounded-lg object-contain w-full h-auto max-h-[300px]"
                unoptimized
              />
            </div>
            <button
              onClick={() => handleDownload(sticker.url, sticker.title)}
              className="mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Download Sticker
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}