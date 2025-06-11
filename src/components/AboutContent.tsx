'use client'

import { Locale } from '@/app/config/i18n'
import { useState, useEffect } from 'react'

// 私有组件翻译
const translations = {
  en: {
    title: 'About Us',
    welcome: 'Welcome to PlayNow, your ultimate destination for free online games!',
    mission: "Our mission is to provide a vast collection of games for players of all ages and interests. Whether you're into action, puzzles, racing, or adventure, we have something for everyone.",
    updates: 'We are constantly updating our library with new and exciting games, so be sure to check back often.',
    thankYou: 'Thank you for visiting, and we hope you have a fantastic time playing!'
  },
  zh: {
    title: '关于我们',
    welcome: '欢迎来到 PlayNow，您免费在线游戏的终极目的地！',
    mission: '我们的使命是为所有年龄和兴趣的玩家提供大量的游戏。无论您喜欢动作、益智、赛车还是冒险，我们都能满足您的需求。',
    updates: '我们会不断更新我们的游戏库，推出新的和令人兴奋的游戏，所以请务必经常回来查看。',
    thankYou: '感谢您的光临，希望您玩得愉快！'
  },
  es: {
    title: 'Sobre Nosotros',
    welcome: '¡Bienvenido a PlayNow, tu destino definitivo para juegos en línea gratuitos!',
    mission: 'Nuestra misión es proporcionar una vasta colección de juegos para jugadores de todas las edades e intereses. Ya sea que te guste la acción, los rompecabezas, las carreras o la aventura, tenemos algo para todos.',
    updates: 'Estamos constantemente actualizando nuestra biblioteca con juegos nuevos y emocionantes, así que asegúrate de volver a menudo.',
    thankYou: '¡Gracias por tu visita y esperamos que te diviertas mucho jugando!'
  },
  fr: {
    title: 'À Propos de Nous',
    welcome: "Bienvenue sur PlayNow, votre destination ultime pour les jeux en ligne gratuits !",
    mission: "Notre mission est de fournir une vaste collection de jeux pour les joueurs de tous âges et de tous intérêts. Que vous aimiez l'action, les puzzles, la course ou l'aventure, nous avons quelque chose pour tout le monde.",
    updates: "Nous mettons constamment à jour notre bibliothèque avec de nouveaux jeux passionnants, alors n'oubliez pas de revenir souvent.",
    thankYou: "Merci de votre visite et nous espérons que vous passerez un moment fantastique à jouer !"
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
    <main className="main-content max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
      <p className="text-lg mb-4">{t.welcome}</p>
      <p className="mb-4">{t.mission}</p>
      <p className="mb-4">{t.updates}</p>
      <p className="text-lg font-semibold">{t.thankYou}</p>
    </main>
  )
} 