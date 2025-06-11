'use client'

import { Locale } from '@/app/config/i18n'
import { useState, useEffect } from 'react'

const titles: Record<Locale, string> = {
  en: 'Our Products',
  zh: '我们的产品',
  es: 'Nuestros Productos',
  fr: 'Nos Produits',
};

const descriptions: Record<Locale, string> = {
  en: 'Check out our amazing products',
  zh: '查看我们的精彩产品',
  es: 'Mira nuestros increíbles productos',
  fr: 'Découvrez nos produits incroyables',
};

/**
 * 产品内容组件 - 客户端组件，使用useEffect避免水合问题
 */
export function ProductsContent({ 
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