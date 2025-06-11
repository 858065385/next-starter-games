'use client'

import { Locale } from '@/app/config/i18n'
import { useState, useEffect } from 'react'

const titles: Record<Locale, string> = {
  en: 'Welcome to our multilingual website',
  zh: '欢迎访问我们的多语言网站',
  es: 'Bienvenido a nuestro sitio web multilingüe',
  fr: 'Bienvenue sur notre site Web multilingue',
};

const descriptions: Record<Locale, string> = {
  en: 'This is a multilingual website built with Next.js',
  zh: '这是一个使用Next.js构建的多语言网站',
  es: 'Este es un sitio web multilingüe construido con Next.js',
  fr: 'Ceci est un site Web multilingue construit avec Next.js',
};

/**
 * 首页内容组件 - 纯客户端组件，使用useEffect避免水合问题
 */
export function HomeContent({ 
  locale,
  messages 
}: { 
  locale: Locale
  messages: any 
}) {
  // 使用useState存储标题和描述
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 在客户端渲染后设置内容
  useEffect(() => {
    setTitle(titles[locale] || titles.en);
    setDescription(descriptions[locale] || descriptions.en);
  }, [locale]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
} 