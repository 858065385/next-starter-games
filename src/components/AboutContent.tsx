'use client'

import { Locale } from '@/app/config/i18n'
import { useState, useEffect } from 'react'

// 私有组件翻译
const translations = {
  en: {
    title: 'About Us',
    description: 'Learn more about our company and our mission.',
    history: 'Our company was founded with a mission to build exceptional multilingual websites.',
    team: 'Our Team',
    teamDescription: 'We have a dedicated team of developers, designers, and content creators.'
  },
  zh: {
    title: '关于我们',
    description: '了解更多关于我们公司和使命的信息。',
    history: '我们公司成立的使命是构建卓越的多语言网站。',
    team: '我们的团队',
    teamDescription: '我们拥有一支专业的开发人员、设计师和内容创作者团队。'
  },
  es: {
    title: 'Sobre Nosotros',
    description: 'Conozca más sobre nuestra empresa y nuestra misión.',
    history: 'Nuestra empresa fue fundada con la misión de construir sitios web multilingües excepcionales.',
    team: 'Nuestro Equipo',
    teamDescription: 'Contamos con un equipo dedicado de desarrolladores, diseñadores y creadores de contenido.'
  },
  fr: {
    title: 'À Propos de Nous',
    description: 'En savoir plus sur notre entreprise et notre mission.',
    history: 'Notre entreprise a été fondée avec pour mission de construire des sites Web multilingues exceptionnels.',
    team: 'Notre Équipe',
    teamDescription: 'Nous avons une équipe dédiée de développeurs, de designers et de créateurs de contenu.'
  }
};

/**
 * 关于我们内容组件 - 客户端组件
 */
export function AboutContent({ 
  locale
}: { 
  locale: Locale
}) {
  // 使用当前语言的翻译，如果不存在则使用英文
  const t = translations[locale] || translations.en;
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      
      <div className="mb-8">
        <p className="text-lg mb-4">{t.description}</p>
        <p className="mb-4">{t.history}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t.team}</h2>
        <p>{t.teamDescription}</p>
      </div>
    </div>
  )
} 