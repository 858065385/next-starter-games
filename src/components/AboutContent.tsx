'use client'

import { Locale } from '@/app/config/i18n'
import { useState, useEffect } from 'react'

/**
 * 关于我们内容组件 - 客户端组件
 */
export function AboutContent({ 
  locale,
  messages 
}: { 
  locale: Locale
  messages: any 
}) {
  const about = messages.about || {}
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{about.title || 'About Us'}</h1>
      
      <div className="mb-8">
        <p className="text-lg mb-4">{about.description || 'Learn more about our company and our mission.'}</p>
        <p className="mb-4">{about.history || 'Our company was founded with a mission to build exceptional multilingual websites.'}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{about.team || 'Our Team'}</h2>
        <p>{about.teamDescription || 'We have a dedicated team of developers, designers, and content creators.'}</p>
      </div>
    </div>
  )
} 