'use client';

import { useState, useEffect } from 'react';
import { Game, Category, GamesData } from '@/types/games';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Locale, defaultLocale } from '@/app/config/i18n';

// 私有组件翻译
const translations = {
  en: {
    searchResults: '🔍 Search Results',
    foundGames: (count: number) => `Found ${count} games`,
    loading: 'Loading games...',
    error: 'Error loading games:',
    noGames: 'No games found'
  },
  zh: {
    searchResults: '🔍 搜索结果',
    foundGames: (count: number) => `找到 ${count} 个游戏`,
    loading: '正在加载游戏...',
    error: '加载游戏时出错：',
    noGames: '未找到游戏'
  },
  es: {
    searchResults: '🔍 Resultados de búsqueda',
    foundGames: (count: number) => `${count} juegos encontrados`,
    loading: 'Cargando juegos...',
    error: 'Error al cargar juegos:',
    noGames: 'No se encontraron juegos'
  },
  fr: {
    searchResults: '🔍 Résultats de recherche',
    foundGames: (count: number) => `${count} jeux trouvés`,
    loading: 'Chargement des jeux...',
    error: 'Erreur lors du chargement des jeux:',
    noGames: 'Aucun jeu trouvé'
  }
};

/**
 * 检查URL是否有效
 */
function isValidUrl(url: string): boolean {
  try {
    // 如果是相对路径，添加基础URL
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true;
    }
    
    // 检查是否是有效的URL
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 修正图片路径
 * 处理img和images路径差异
 */
function fixImagePath(path: string): string {
  if (!path) return '/images/games/pacman.png';
  
  // 如果是完整URL，直接返回
  if (path.startsWith('http')) return path;
  
  // 如果路径以img开头，将其替换为images
  if (path.startsWith('img/')) {
    return path.replace('img/', '/images/');
  }
  
  // 确保路径以/开头
  if (!path.startsWith('/')) {
    return '/' + path;
  }
  
  return path;
}

/**
 * 获取本地化文本
 * @param textObj 多语言文本对象或字符串
 * @param locale 当前语言
 * @param defaultLocale 默认语言
 * @returns 本地化文本
 */
function getLocalizedText(textObj: any, locale: Locale, defaultLocale: Locale): string {
  if (!textObj) return '';
  
  // 如果是字符串，直接返回
  if (typeof textObj === 'string') return textObj;
  
  // 如果是对象，尝试获取当前语言的文本
  if (typeof textObj === 'object') {
    // 优先使用当前语言
    if (textObj[locale]) return textObj[locale];
    
    // 其次使用默认语言
    if (textObj[defaultLocale]) return textObj[defaultLocale];
    
    // 最后使用对象中的第一个值
    const firstKey = Object.keys(textObj)[0];
    if (firstKey) return textObj[firstKey];
  }
  
  return '';
}

/**
 * 游戏列表组件
 * 负责从games.json加载游戏数据并渲染到页面
 */
export default function GamesList() {
  const [gamesData, setGamesData] = useState<GamesData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { locale } = useParams() as { locale: Locale };
  
  // 获取当前语言的翻译，如果不存在则使用英文
  const t = translations[locale] || translations.en;
  
  // 默认图片 - 使用已有的游戏图片作为占位符
  const fallbackImage = '/images/games/pacman.png';

  // 加载游戏数据
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/games.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }
        const data = await response.json();
        setGamesData(data);
      } catch (err) {
        console.error('Error loading games data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // 处理搜索输入
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理图片加载错误
  const handleImageError = (gameId: string) => {
    console.log(`Image load error for game: ${gameId}`);
    setImageErrors(prev => ({
      ...prev,
      [gameId]: true
    }));
  };

  // 渲染游戏元素
  const renderGameElement = (game: Game) => {
    // 确保图片URL有效，并修正路径
    let imageUrl = imageErrors[game.id] ? fallbackImage : game.thumb;
    imageUrl = isValidUrl(imageUrl) ? imageUrl : fallbackImage;
    const fixedImageUrl = fixImagePath(imageUrl);
    
    // 获取本地化文本
    const title = getLocalizedText(game.title, locale, defaultLocale);
    
    return (
      <Link 
        href={`/${locale}/play?id=${game.id}`}
        key={game.id}
        className="game-thumbnail"
      >
        <div className="relative w-full aspect-square">
          {/* 使用next/image的unoptimized属性处理外部URL */}
          <Image 
            src={fixedImageUrl}
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
            loading="lazy"
            unoptimized={!fixedImageUrl.startsWith('/')}
            onError={() => handleImageError(game.id)}
          />
        </div>
        <div className="title-overlay">
          <h5>{title}</h5>
          <div className="game-tags-small">
            {game.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="game-tag-small">{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    );
  };

  // 渲染搜索结果
  const renderSearchResults = () => {
    if (!gamesData) return null;

    const results = Object.values(gamesData.games).filter(game => {
      // 获取本地化文本用于搜索
      const title = getLocalizedText(game.title, locale, defaultLocale);
      const description = getLocalizedText(game.description, locale, defaultLocale);
      
      const searchString = `${title} ${description} ${game.tags.join(' ')} ${game.category}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });

    return (
      <section className="game-category">
        <div>
          <h1 style={{ marginRight: '16px' }}>{t.searchResults}</h1>
          <p>{t.foundGames(results.length)}</p>
        </div>
        <div className="game-gallery">
          {results.length > 0 ? 
            results.map(game => renderGameElement(game)) : 
            <p>{t.noGames}</p>
          }
        </div>
      </section>
    );
  };

  // 渲染所有游戏分类
  const renderCategories = () => {
    if (!gamesData || !gamesData.categories) return null;

    // 将分类对象转换为数组并按权重排序
    const sortedCategories = Object.entries(gamesData.categories)
      .sort(([, a], [, b]) => (b.weight || 0) - (a.weight || 0));

    return sortedCategories.map(([categoryId, category]) => {
      // 获取本地化文本
      const title = getLocalizedText(category.title, locale, defaultLocale);
      const description = getLocalizedText(category.description, locale, defaultLocale);

      // 获取该分类下的所有游戏
      const categoryGames = Object.values(gamesData.games).filter(
        game => game.category === categoryId
      );

      return (
        <section key={categoryId} className="game-category">
          <div>
            <h1 style={{ marginRight: '16px' }}>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="game-gallery">
            {categoryGames.map(game => renderGameElement(game))}
          </div>
        </section>
      );
    });
  };

  // 如果正在加载，显示加载提示
  if (isLoading) {
    return <div className="loading-indicator">{t.loading}</div>;
  }

  // 如果发生错误，显示错误信息
  if (error) {
    return <div className="error-message">{t.error} {error}</div>;
  }

  // 如果没有数据，显示无游戏提示
  if (!gamesData) {
    return <div className="no-games-message">{t.noGames}</div>;
  }

  return (
    <div className="games-container">
      {/* 搜索框 */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search games..." 
          value={searchTerm} 
          onChange={handleSearch} 
          className="search-input"
        />
      </div>
      
      {/* 如果有搜索内容，显示搜索结果，否则显示分类 */}
      {searchTerm ? renderSearchResults() : renderCategories()}
    </div>
  );
} 