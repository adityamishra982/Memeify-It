'use client'

import { useEffect, useState} from 'react'
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
  

export default function TrendingGifsPage() {
  const [gifs, setGifs] = useState<Gif[]>([])

  const fetchTrendingGifs = async () => {
    try {
        const res = await axios.get<GiphyApiResponse>('/api/giphy?type=trending')
        const gifData = res.data.data.map((gif) => ({
          id: gif.id,
          title: gif.title,
          url: gif.images.original.url,
        }))
        
      setGifs(gifData)
    } catch (error) {
      console.error('Error fetching GIFs:', error)
    }
  }

  const handleDownload = async (url: string, title: string) => {
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${title || 'gif'}.gif`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('GIF downloaded!')
  }

  useEffect(() => {
    fetchTrendingGifs()
  }, [])

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center">
      <h1 className="text-2xl font-bold py-4">Trending GIFs</h1>

      <div className="flex-1 w-full max-w-5xl px-4 overflow-y-auto space-y-4 pb-4">
        {gifs.map((gif) => (
          <div
            key={gif.id}
            className="bg-black border border-white p-4 rounded-lg shadow-md"
          >
            <h2 className="text-md font-semibold mb-2">{gif.title}</h2>
            <div className="relative w-full h-auto max-h-[400px]">
              <Image
                src={gif.url}
                alt={gif.title}
                width={600}
                height={400}
                className="rounded-lg object-contain w-full h-auto max-h-[400px]"
                unoptimized
                priority={false}
              />
            </div>
            <button
              onClick={() => handleDownload(gif.url, gif.title)}
              className="mt-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Download GIF
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
