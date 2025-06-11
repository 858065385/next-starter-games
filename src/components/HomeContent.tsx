'use client'

import { Locale } from '@/app/config/i18n'
import { useState, useEffect } from 'react'

// 私有组件翻译
const translations = {
  en: {
    title: 'Welcome to our multilingual website',
    description: 'This is a multilingual website built with Next.js'
  },
  zh: {
    title: '欢迎访问我们的多语言网站',
    description: '这是一个使用Next.js构建的多语言网站'
  },
  es: {
    title: 'Bienvenido a nuestro sitio web multilingüe',
    description: 'Este es un sitio web multilingüe construido con Next.js'
  },
  fr: {
    title: 'Bienvenue sur notre site Web multilingue',
    description: 'Ceci est un site Web multilingue construit avec Next.js'
  }
};

/**
 * 首页内容组件 - 纯客户端组件，使用useEffect避免水合问题
 */
export function HomeContent({ 
  locale
}: { 
  locale: Locale
}) {
  // 使用当前语言的翻译，如果不存在则使用英文
  const t = translations[locale] || translations.en;
  
  // 使用useState存储标题和描述
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 在客户端渲染后设置内容
  useEffect(() => {
    setTitle(t.title);
    setDescription(t.description);
  }, [locale, t]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
} 