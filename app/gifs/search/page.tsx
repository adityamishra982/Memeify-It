"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

interface Gif {
  id: string;
  title: string;
  url: string;
}

interface GiphyApiGif {
  id: string;
  title: string;
  images: {
    original: {
      url: string;
    };
  };
}

interface GiphyApiResponse {
  data: GiphyApiGif[];
}

export default function SearchGifsPage() {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return toast.error("Please enter a search query!");
    setLoading(true);
    try {
      const res = await axios.get<GiphyApiResponse>("/api/giphy", {
        params: { type: "search", query },
      });

      const gifData: Gif[] = res.data.data.map((gif) => ({
        id: gif.id,
        title: gif.title,
        url: gif.images.original.url,
      }));
      setGifs(gifData);
      setSearched(true);
    } catch (err) {
      console.error("Error searching GIFs:", err);
      toast.error("Failed to fetch GIFs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, title: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title || "gif"}.gif`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("GIF downloaded!");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Search GIFs</h1>

      <div className="flex gap-2 w-full max-w-xl mb-6">
        <input
          type="text"
          placeholder="Search for GIFs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-pink-500 to-red-500 px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Search
        </button>
      </div>

      {!query && !loading && !searched && (
        <div className="flex flex-col items-center justify-center mt-10 text-center">
          <Image
            src="https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif"
            alt="Search to find GIFs"
            width={400}
            height={300}
            className="rounded-lg"
            unoptimized
          />
          <p className="text-white mt-4 text-lg">
            Start typing to search for cool GIFs!
          </p>
        </div>
      )}

      {loading && (
        <div className="mt-10">
          <ClipLoader color="#fff" size={50} />
        </div>
      )}

      {!loading && gifs.length > 0 && (
        <div className="w-full max-w-5xl h-[600px] overflow-y-auto space-y-6 mt-6 pr-2">
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
      )}

      {searched && gifs.length === 0 && !loading && (
        <p className="text-center text-gray-400 mt-10">
          No GIFs found for <span className="italic">{`"${query}"`}</span>
        </p>
      )}
    </div>
  );
}