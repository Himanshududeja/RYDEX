'use client'
import { motion } from 'framer-motion'
import { Copyright } from 'lucide-react'
import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa'

function Footer() {
  return (
    <div className='w-full bg-black text-white'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='max-w-7xl mx-auto px-6 py-16'
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12'>
          <div>
            <h2 className='text-2xl font-bold tracking-wide'>RYDEX</h2>
            <p className='mt-4 text-gray-400 text-sm leading-relaxed'>
              Book any vehicle - from bikes to trucks. Trusted owners. Transparent pricing
            </p>
            <div className="flex gap-4 mt-6">
              {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition"
                >
                  <Icon size={18}/>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        <div className='horder-t border-white/10'>
            <div className='max-w07xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4'>
              <p> © {new Date().getFullYear()} RYDEX. All rights reserved.</p>
            </div>
        </div>
      </motion.div>

    </div>
  )
}

export default Footer