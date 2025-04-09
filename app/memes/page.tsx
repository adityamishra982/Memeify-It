'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { ToastContainer, toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

interface MemeTemplate {
  id: string
  name: string
  url: string
}

const MemeGeneratorPage = () => {
  const [templates, setTemplates] = useState<MemeTemplate[]>([])
  const [visibleCount, setVisibleCount] = useState(10)
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get('https://api.imgflip.com/get_memes')
        setTemplates(res.data.data.memes)
      } catch (err) {
        console.error('Failed to load templates:', err)
      }
    }
    fetchTemplates()

    const handleScroll = () => {
      const sidebar = document.getElementById('template-scroll')
      if (sidebar && sidebar.scrollTop + sidebar.clientHeight >= sidebar.scrollHeight - 5) {
        setVisibleCount((prev) => prev + 10)
      }
    }

    const sidebar = document.getElementById('template-scroll')
    if (sidebar) sidebar.addEventListener('scroll', handleScroll)

    return () => {
      if (sidebar) sidebar.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const generateMeme = async () => {
    if (!selectedTemplate) return

    try {
      setLoading(true)
      const response = await axios.post('/api/generate-meme', {
        template_id: selectedTemplate.id,
        text0: topText,
        text1: bottomText,
      })

      if (response.data.success) {
        setGeneratedMemeUrl(response.data.data.url)
      } else {
        alert('Failed to generate meme: ' + response.data.error_message)
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong while generating the meme.')
    } finally {
      setLoading(false)
    }
  }

  const downloadMeme = async () => {
    try {
      const res = await fetch(generatedMemeUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'meme.png'
      document.body.appendChild(a)
      a.click()
      a.remove()

      toast.success('Meme downloaded!')
    } catch (err) {
      toast.error(`Failed to download meme. ${err}`)
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div
        id="template-scroll"
        className="w-1/4 overflow-y-auto p-4 border-r border-gray-800 space-y-4"
        style={{ maxHeight: '100vh' }}
      >
        <h2 className="text-lg font-bold mb-2">Choose Template</h2>
        {templates.slice(0, visibleCount).map((template) => (
          <div
            key={template.id}
            onClick={() => {
              setSelectedTemplate(template)
              setGeneratedMemeUrl('')
              setTopText('')
              setBottomText('')
            }}
            className={`cursor-pointer border p-2 rounded hover:bg-gray-800 ${
              selectedTemplate?.id === template.id
                ? 'border-pink-500 bg-gray-800'
                : 'border-gray-600'
            }`}
          >
            <Image
              src={template.url}
              alt={template.name}
              width={200}
              height={150}
              className="rounded"
              unoptimized
            />
          </div>
        ))}
        {visibleCount < templates.length && (
          <div className="flex justify-center mt-4">
            <ClipLoader color="#fff" size={30} />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 space-y-6">
        {selectedTemplate ? (
          <>
            <div className="flex flex-wrap justify-center gap-10 w-full">
              <div className="text-center">
                <Image
                  src={selectedTemplate.url}
                  alt="Selected Meme"
                  width={400}
                  height={300}
                  className="rounded-lg border border-gray-700"
                  unoptimized
                />
              </div>

              {generatedMemeUrl && (
                <div className="text-center">
                  <Image
                    src={generatedMemeUrl}
                    alt="Generated Meme"
                    width={400}
                    height={300}
                    className="rounded-lg border-2 border-pink-400"
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div className="w-full max-w-md space-y-4">
              <input
                type="text"
                placeholder="Top Text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <input
                type="text"
                placeholder="Bottom Text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <button
                onClick={generateMeme}
                disabled={loading || !topText || !bottomText}
                className={`w-full ${
                  loading ? 'bg-gray-600' : 'bg-pink-600 hover:bg-pink-700'
                } text-white font-bold py-2 rounded transition`}
              >
                {loading ? 'Generating...' : 'Generate Meme'}
              </button>

              {generatedMemeUrl && (
                <button
                  onClick={downloadMeme}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition"
                >
                  Download Meme
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-400">Select a template from the left to begin</p>
        )}
      </div>
    </div>
  )
}

export default MemeGeneratorPage