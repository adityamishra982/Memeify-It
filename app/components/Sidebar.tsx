"use client"
import React, { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from 'framer-motion';
import { Home, Image as ImageIcon, Smile } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faM } from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { label: "Home", icon: <Home size={20} />, path: "/", aria: "Go to Home" },
  { label: "Memes", icon: <Smile size={20} />, path: "/memes", aria: "Go to Memes" },
  { label: "GIFs", icon: <ImageIcon size={20} />, path: "/gifs", aria: "Go to GIFs" },
];

const Navbar = () => {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse sidebar on medium and smaller screens
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 768);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Main sidebar navigation"
      className={clsx(
        'flex flex-col h-screen justify-between bg-black text-white p-4 shadow-lg transition-all duration-300',
        isCollapsed ? 'w-20 items-center' : 'w-64'
      )}
    >
      {/* Optional logo image */}
      {/* If you have a logo, uncomment below and replace /logo.png with your path */}
      {/* 
      <NextImage 
        src="/logo.png" 
        alt="Memeify It Logo" 
        width={isCollapsed ? 40 : 120} 
        height={40} 
        className="mx-auto mb-6"
      />
      */}

      <h2 className={clsx(
        'flex items-center justify-center gap-2 text-2xl font-bold mb-6 transition-opacity duration-300',
        isCollapsed ? 'opacity-100 text-center text-xl' : 'opacity-100'
      )}>
        <FontAwesomeIcon icon={faM} className="text-teal-400" />
        {!isCollapsed && 'Memeify It'}
      </h2>


      <ul className='flex flex-col gap-3'>
        {navItems.map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.05 }}
            className='w-full'
          >
            <Link href={item.path} aria-label={item.aria}>
              <span className='flex items-center justify-start hover:bg-gray-800 hover:text-teal-400 px-4 py-3 rounded-xl cursor-pointer transition-colors'>
                {item.icon}
                {!isCollapsed && <span className='ml-3 text-base'>{item.label}</span>}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <div className='text-center mt-auto pt-6'>
        {session ? (
          <>
            {!isCollapsed && (
              <p className='mb-2 text-sm text-gray-400'>
                Signed in as <span className='text-white font-semibold'>{session.user?.email || "unknown"}</span>
              </p>
            )}
            <button
              onClick={() => signOut()}
              className='bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-2 rounded-lg text-sm w-full transition duration-300'
              aria-label="Sign out"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className='bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-lg text-sm w-full transition duration-300'
            aria-label="Sign in"
          >         
                      Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;