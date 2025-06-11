'use client';

import { Locale, defaultLocale } from '@/app/config/i18n'
import { useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { Game, GamesData } from '@/types/games'
import Link from 'next/link'
import { getLocalizedText } from '@/lib/utils'
import Image from 'next/image'

function GameContent() {
  const { locale } = useParams() as { locale: Locale }
  const searchParams = useSearchParams()
  const gameId = searchParams.get('id')
  
  const [game, setGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 使用useMemo缓存翻译对象，避免每次渲染都重新创建
  const translations = useMemo(() => ({
    loading: {
      'en': 'Loading...',
      'zh': '加载中...',
      'es': 'Cargando...',
      'fr': 'Chargement...'
    },
    noGameId: {
      'en': 'Game ID does not exist',
      'zh': '游戏ID不存在',
      'es': 'El ID del juego no existe',
      'fr': "L'ID du jeu n'existe pas"
    },
    gameNotFound: {
      'en': 'Game not found',
      'zh': '未找到游戏',
      'es': 'Juego no encontrado',
      'fr': 'Jeu non trouvé'
    },
    unknownError: {
      'en': 'Unknown error',
      'zh': '未知错误',
      'es': 'Error desconocido',
      'fr': 'Erreur inconnue'
    },
    gameLoadFailed: {
      'en': 'Game loading failed',
      'zh': '游戏加载失败',
      'es': 'Error al cargar el juego',
      'fr': 'Échec du chargement du jeu'
    },
    backToGames: {
      'en': 'Back to Games List',
      'zh': '返回游戏列表',
      'es': 'Volver a la lista de juegos',
      'fr': 'Retour à la liste des jeux'
    },
    description: {
      'en': 'Description',
      'zh': '游戏描述',
      'es': 'Descripción',
      'fr': 'Description'
    },
    instructions: {
      'en': 'Instructions',
      'zh': '游戏说明',
      'es': 'Instrucciones',
      'fr': 'Instructions'
    },
    category: {
      'en': 'Category',
      'zh': '分类',
      'es': 'Categoría',
      'fr': 'Catégorie'
    },
    tags: {
      'en': 'Tags',
      'zh': '标签',
      'es': 'Etiquetas',
      'fr': 'Tags'
    },
    dimensions: {
      'en': 'Dimensions',
      'zh': '尺寸',
      'es': 'Dimensiones',
      'fr': 'Dimensions'
    }
  }), []);
  
  // 使用useCallback包装t函数，使其只在locale和translations变化时重新创建
  const t = useCallback((key: keyof typeof translations) => {
    const translationObj = translations[key];
    return translationObj[locale as keyof typeof translationObj] || 
           translationObj[defaultLocale] || 
           translationObj.en || 
           key;
  }, [locale, translations]);
  
  // 加载游戏数据
  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) {
        setError(t('noGameId'))
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const response = await fetch('/data/games.json')
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`)
        }
        
        const data: GamesData = await response.json()
        const gameData = data.games[gameId]
        
        if (!gameData) {
          setError(`${t('gameNotFound')}: ${gameId}`)
        } else {
          setGame(gameData)
        }
      } catch (err) {
        console.error('Error loading game data:', err)
        setError(err instanceof Error ? err.message : t('unknownError'))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchGame()
  }, [gameId, t]);
  
  // 将iframe相关的代码移到单独的useEffect中
  useEffect(() => {
    if (!game) return;
    
    // 设置iframe的src
    const gameFrame = document.getElementById('game-frame') as HTMLIFrameElement
    if (gameFrame) {
      gameFrame.src = game.url
      
      // 立即设置一个初始高度
      if (game.width && game.height) {
        const aspectRatio = Number(game.height) / Number(game.width)
        const initialWidth = gameFrame.parentElement?.clientWidth || 800
        gameFrame.style.height = `${initialWidth * aspectRatio}px`
      }
      
      // 根据游戏内容调整iframe高度和宽度
      gameFrame.onload = () => {
        if (game.width && game.height) {
          const aspectRatio = Number(game.height) / Number(game.width)
          gameFrame.style.height = `${gameFrame.clientWidth * aspectRatio}px`
        } else {
          gameFrame.style.height = '600px' // 默认高度
        }
      }
    }
  }, [game]);
  
  // 处理窗口大小变化，调整iframe高度
  useEffect(() => {
    if (!game) return
    
    const handleResize = () => {
      const gameFrame = document.getElementById('game-frame') as HTMLIFrameElement
      if (gameFrame && game.width && game.height) {
        const aspectRatio = Number(game.height) / Number(game.width)
        gameFrame.style.height = `${gameFrame.clientWidth * aspectRatio}px`
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [game])
  
  if (isLoading) {
    return <div className="loading">{t('loading')}</div>
  }
  
  if (error || !game) {
    return (
      <div className="error-container">
        <div className="error">{error || t('gameLoadFailed')}</div>
        <Link href={`/${locale}/games`} className="back-button">
          {t('backToGames')}
        </Link>
      </div>
    )
  }
  
  // 获取本地化文本 test
  const title = getLocalizedText(game.title, locale);
  const description = getLocalizedText(game.description, locale);
  const instructions = getLocalizedText(game.instructions, locale);
  
  return (
    <div className="game-page-container">
      <div className="game-header">
        <h1>{title}</h1>
        <Link href={`/${locale}/`} className="back-button">
          {t('backToGames')}
        </Link>
      </div>
      
      <main className="main-content">
        <div className="game-iframe-container">
          <div className="game-iframe">
            <iframe 
              id="game-frame" 
              frameBorder="0" 
              allowFullScreen 
              style={{width: '100%'}}
            ></iframe>
          </div>
          <div className="game-details">
            <section className="game-info">
              <h1 id="game-title">{title}</h1>
              
              <div id="description-section">
                <h2>{t('description')}</h2>
                <p id="game-description">{description}</p>
              </div>

              {instructions && (
                <div id="instructions-section">
                  <h2>{t('instructions')}</h2>
                  <p id="game-instructions">{instructions}</p>
                </div>
              )}

              <div id="category-section">
                <h2>{t('category')}</h2>
                <p>{game.category}</p>
              </div>

              <div id="tags-section">
                <h2>{t('tags')}</h2>
                <div id="game-tags" className="tags-container">
                  {game.tags.map(tag => (
                    <span key={tag} className="game-tag">{tag}</span>
                  ))}
                </div>
              </div>
              
              {game.width && game.height && (
                <div id="dimensions-section">
                  <h2>{t('dimensions')}</h2>
                  <p>{`${game.width} x ${game.height}`}</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * 游戏详情页面组件
 */
export default function PlayPage() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}