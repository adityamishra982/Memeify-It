"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { AiFillHeart } from "react-icons/ai";

interface RedditPostData {
  id: string;
  title: string;
  url: string;
  ups: number;
  post_hint?: string;
  preview?: {
    images: {
      source: {
        url: string;
      };
    }[];
  };
}

interface RedditApiResponse {
  data: {
    children: { data: RedditPostData }[];
    after: string | null;
  };
}

interface Meme {
  id: string;
  url: string;
  title: string;
  ups: number;
}

export default function LatestPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const fetchMemes = async () => {
    const url = `https://www.reddit.com/r/memes/new.json?limit=20${
      after ? `&after=${after}` : ""
    }`;
    const res = await axios.get<RedditApiResponse>(url);
    const posts = res.data.data.children;

    const filteredMemes: Meme[] = posts
      .map((post) => post.data)
      .filter((post) => post.post_hint === "image" && post.preview)
      .map((post) => ({
        id: post.id,
        url: post.url,
        title: post.title,
        ups: post.ups,
      }));

    setMemes((prev) => [...prev, ...filteredMemes]);
    setAfter(res.data.data.after);
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchMemes();
      }
    },
    [after]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-black text-white">
      <div className="flex justify-center gap-6 py-4 bg-black text-white w-full border-b border-gray-800 sticky top-0 z-10">
        <Link
          href="/"
          className={`text-lg px-4 py-2 rounded ${
            pathname === "/"
              ? "bg-white text-black font-bold"
              : "hover:underline"
          }`}
        >
          Trending
        </Link>
        <Link
          href="/latest"
          className={`text-lg px-4 py-2 rounded ${
            pathname === "/latest"
              ? "bg-white text-black font-bold"
              : "hover:underline"
          }`}
        >
          Latest
        </Link>
      </div>

      <div className="flex-1 w-full flex justify-center overflow-hidden">
        <div className="w-full max-w-[750px] px-4 space-y-4 overflow-y-auto py-4">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className="bg-black border border-white p-4 rounded-lg shadow-md w-full"
            >
              <h2 className="text-lg font-semibold text-white mb-2">
                {meme.title}
              </h2>
              <div className="relative w-full max-h-[600px]">
                <Image
                  src={meme.url}
                  alt={meme.title}
                  width={800}
                  height={600}
                  className="rounded-lg object-contain w-full h-auto max-h-[600px]"
                  unoptimized
                  priority={true}
                />
              </div>
              <div className="mt-2 text-white flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <AiFillHeart className="text-pink-500 text-2xl" />
                  <span className="text-sm">{meme.ups}</span>
                </div>
                <a
                  href={`https://www.reddit.com${meme.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  View on Reddit
                </a>
              </div>
            </div>
          ))}
          <div ref={loaderRef} className="h-10" />
        </div>
      </div>
    </div>
  );
}
