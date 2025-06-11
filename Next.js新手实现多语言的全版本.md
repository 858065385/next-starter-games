# Next.js新手实现多语言的全版本

本指南旨在帮助Next.js新手逐步实现多语言网站功能，分为简单版和进阶版两个阶段。通过循序渐进的方式，即使是初学者也能轻松掌握多语言实现技巧。

## 目录

1. [简单版：基础多语言实现](#简单版基础多语言实现)
   - [项目结构](#简单版项目结构)
   - [配置语言设置](#配置语言设置)
   - [创建多语言路由](#创建多语言路由)
   - [实现中间件](#实现中间件)
   - [添加语言切换器](#添加语言切换器)
   - [静态内容翻译](#静态内容翻译)

2. [进阶版：动态数据多语言](#进阶版动态数据多语言)
   - [双轨制翻译管理](#双轨制翻译管理)
   - [数据库设计](#数据库设计)
   - [API实现](#api实现)
   - [前端组件国际化](#前端组件国际化)
   - [SEO优化](#seo优化)

3. [大模型提示词](#大模型提示词)
   - [简单版提示词](#简单版提示词)
   - [进阶版提示词](#进阶版提示词)

## 简单版：基础多语言实现

简单版适合初学者和小型项目，使用静态翻译文件和基本路由实现多语言功能。

### 简单版项目结构

```
my-app/
├── public/
│   └── locales/       # 翻译文件
│       ├── en.json
│       ├── zh.json
│       └── ...
├── src/
│   ├── app/
│   │   ├── [locale]/  # 多语言路由
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── ...
│   │   └── config/
│   │       └── i18n.ts
│   └── components/
│       ├── LanguageSwitcher.tsx
│       └── ...
└── middleware.ts      # 语言检测中间件
```

### 配置语言设置

首先，创建语言配置文件：

```typescript
// src/app/config/i18n.ts
export const locales = ['en', 'zh', 'es', 'fr'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

// 语言名称映射
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  fr: 'Français'
};
```

### 创建多语言路由

使用Next.js的动态路由功能创建多语言路由：

```typescript
// src/app/[locale]/layout.tsx
import { Locale, locales } from '@/app/config/i18n';
import { notFound } from 'next/navigation';

// 为所有支持的语言生成静态路径
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  // 验证语言参数
  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <header>
          {/* 导航和语言切换器 */}
        </header>
        <main>{children}</main>
        <footer>{/* 页脚内容 */}</footer>
      </body>
    </html>
  );
}
```

### 实现中间件

创建中间件自动检测用户语言并重定向：

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/app/config/i18n';

// 匹配所有路径
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检查路径是否已包含语言代码
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return;
  
  // 从cookie或accept-language获取用户首选语言
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const acceptLanguage = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  
  // 确定使用哪种语言
  const locale = cookieLocale && locales.includes(cookieLocale as any)
    ? cookieLocale
    : acceptLanguage && locales.includes(acceptLanguage as any)
    ? acceptLanguage
    : defaultLocale;
  
  // 重定向到包含语言代码的路径
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}
```

### 添加语言切换器

创建语言切换器组件：

```tsx
// src/components/LanguageSwitcher.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Locale, locales, localeNames } from '@/app/config/i18n';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale: currentLocale } = useParams() as { locale: Locale };
  
  // 提取当前路径中的语言代码后的部分
  const pathnameWithoutLocale = pathname.split('/').slice(2).join('/');
  
  return (
    <div className="language-switcher">
      <ul>
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={`/${locale}/${pathnameWithoutLocale}`}
              className={locale === currentLocale ? "active" : ""}
            >
              {localeNames[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 静态内容翻译

创建翻译文件并使用自定义hook加载翻译：

```json
// public/locales/en.json
{
  "home": {
    "title": "Welcome to our website",
    "description": "This is a multilingual website built with Next.js"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}
```

```json
// public/locales/zh.json
{
  "home": {
    "title": "欢迎访问我们的网站",
    "description": "这是一个使用Next.js构建的多语言网站"
  },
  "navigation": {
    "home": "首页",
    "about": "关于我们",
    "contact": "联系我们"
  }
}
```

创建翻译hook：

```typescript
// src/lib/useTranslation.ts
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Locale, defaultLocale } from '@/app/config/i18n';

export function useTranslation() {
  const { locale } = useParams() as { locale: Locale };
  const [translations, setTranslations] = useState({});
  
  useEffect(() => {
    async function loadTranslations() {
      try {
        const res = await fetch(`/locales/${locale}.json`);
        const data = await res.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    }
    
    loadTranslations();
  }, [locale]);
  
  // 翻译辅助函数
  function t(key: string): string {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    return value || key;
  }
  
  return { t, locale };
}
```

在页面中使用：

```tsx
// src/app/[locale]/page.tsx
'use client';

import { useTranslation } from '@/lib/useTranslation';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
    </div>
  );
}
```

## 进阶版：动态数据多语言

进阶版适合中大型项目，实现动态数据的多语言支持，包括数据库设计和API实现。

### 双轨制翻译管理

在进阶版中，我们采用"双轨制"翻译管理策略：

1. **公共组件**：使用共享翻译文件
2. **私有组件**：在组件内部管理翻译

这种策略的优势在于：
- 公共组件的翻译集中管理，便于维护
- 私有组件的翻译与组件代码一起，提高开发效率
- 避免了全局翻译文件过于庞大和复杂

#### 共享翻译文件

```
src/
  messages/
    en.json
    zh.json
    es.json
    fr.json
```

```typescript
// src/lib/getMessages.ts
import fs from 'fs';
import path from 'path';
import { Locale, defaultLocale } from '@/app/config/i18n';

export async function getMessages(locale: Locale) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    
    // 如果找不到当前语言的翻译，回退到默认语言
    if (locale !== defaultLocale) {
      return getMessages(defaultLocale);
    }
    
    // 如果默认语言也找不到，返回空对象
    return {};
  }
}
```

在服务器组件中使用：

```tsx
// src/app/[locale]/about/page.tsx
import { Locale } from '@/app/config/i18n';
import { getMessages } from '@/lib/getMessages';

export default async function AboutPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  // 加载翻译
  const messages = await getMessages(locale);
  
  return (
    <div>
      <h1>{messages.about?.title || 'About Us'}</h1>
      <div dangerouslySetInnerHTML={{ __html: messages.about?.content || '' }} />
    </div>
  );
}
```

#### 私有组件翻译

```tsx
// src/components/ProductCard.tsx
'use client';

import { Locale, defaultLocale } from '@/app/config/i18n';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

// 组件内部翻译
const translations = {
  en: {
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    reviews: 'reviews'
  },
  zh: {
    addToCart: '加入购物车',
    outOfStock: '缺货',
    reviews: '条评论'
  },
  es: {
    addToCart: 'Añadir al Carrito',
    outOfStock: 'Agotado',
    reviews: 'reseñas'
  },
  fr: {
    addToCart: 'Ajouter au Panier',
    outOfStock: 'Rupture de Stock',
    reviews: 'avis'
  }
};

export function ProductCard({ product }) {
  const { locale } = useParams() as { locale: Locale };
  
  // 使用useMemo缓存翻译对象，避免不必要的重新渲染
  const t = useMemo(() => {
    return translations[locale] || translations[defaultLocale];
  }, [locale]);
  
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <div className="product-footer">
        <span>{product.reviewCount} {t.reviews}</span>
        <button>
          {product.inStock ? t.addToCart : t.outOfStock}
        </button>
      </div>
    </div>
  );
}
```

### 数据库设计

为了支持多语言内容，我们需要设计专门的数据库结构：

#### 主要表结构

1. **核心表**：存储与语言无关的数据
2. **翻译表**：存储多语言内容，与核心表形成一对多关系

以游戏网站为例：

```sql
-- 游戏基本信息表（与语言无关）
CREATE TABLE games (
    id VARCHAR(50) PRIMARY KEY,  -- 游戏唯一标识符
    weight INT DEFAULT 0,        -- 游戏权重，用于排序
    width INT,                   -- 游戏宽度
    height INT                   -- 游戏高度
);

-- 游戏多语言翻译表
CREATE TABLE game_translations (
    game_id VARCHAR(50),         -- 关联到games表的id
    locale VARCHAR(10),          -- 语言代码：en, zh, es, fr等
    title VARCHAR(255) NOT NULL, -- 游戏标题
    description TEXT,            -- 游戏描述
    instructions TEXT,           -- 游戏说明
    PRIMARY KEY (game_id, locale),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

#### 分类和标签

```sql
-- 分类基本信息表
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,  -- 分类唯一标识符
    weight INT DEFAULT 0         -- 分类权重，用于排序
);

-- 分类多语言翻译表
CREATE TABLE category_translations (
    category_id VARCHAR(50),     -- 关联到categories表的id
    locale VARCHAR(10),          -- 语言代码
    title VARCHAR(255) NOT NULL, -- 分类标题
    description TEXT,            -- 分类描述
    PRIMARY KEY (category_id, locale),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 游戏与分类的映射关系表
CREATE TABLE game_category_map (
    game_id VARCHAR(50),         -- 游戏ID
    category_id VARCHAR(50),     -- 分类ID
    PRIMARY KEY (game_id, category_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### API实现

创建支持多语言的API端点：

#### 获取游戏列表

```typescript
// src/app/api/games/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  try {
    // 查询游戏基本信息和对应语言的翻译
    const games = await db.query(`
      SELECT g.id, g.weight, g.width, g.height, 
             gt.title, gt.description, 
             gr.thumb, gr.url
      FROM games g
      LEFT JOIN game_translations gt ON g.id = gt.game_id AND gt.locale = ?
      LEFT JOIN game_resources gr ON g.id = gr.game_id
      ORDER BY g.weight DESC
    `, [locale]);
    
    return NextResponse.json({ games });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
```

#### 获取游戏详情

```typescript
// src/app/api/games/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const { id } = params;
  
  try {
    // 获取游戏基本信息
    const [game] = await db.query(`
      SELECT g.*, gr.thumb, gr.url
      FROM games g
      LEFT JOIN game_resources gr ON g.id = gr.game_id
      WHERE g.id = ?
    `, [id]);
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    // 获取游戏翻译
    const [translation] = await db.query(`
      SELECT * FROM game_translations
      WHERE game_id = ? AND locale = ?
    `, [id, locale]);
    
    // 组合数据
    const gameDetails = {
      ...game,
      title: translation?.title || '',
      description: translation?.description || '',
      instructions: translation?.instructions || ''
    };
    
    return NextResponse.json({ game: gameDetails });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game details' }, { status: 500 });
  }
}
```

### 前端组件国际化

#### 数据获取与展示

```tsx
// src/app/[locale]/games/page.tsx
import { Locale } from '@/app/config/i18n';
import { getMessages } from '@/lib/getMessages';
import { GamesList } from '@/components/GamesList';

export default async function GamesPage({
  params: { locale }
}: {
  params: { locale: Locale }
}) {
  // 加载翻译
  const messages = await getMessages(locale);
  
  return (
    <div className="games-page">
      <h1>{messages.games?.title || 'Games'}</h1>
      <p>{messages.games?.description || 'Explore our collection of games'}</p>
      
      {/* 客户端组件，通过props传递locale */}
      <GamesList locale={locale} />
    </div>
  );
}
```

```tsx
// src/components/GamesList.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/app/config/i18n';

// 私有组件翻译
const translations = {
  en: {
    loading: 'Loading games...',
    error: 'Error loading games:',
    noGames: 'No games found'
  },
  zh: {
    loading: '正在加载游戏...',
    error: '加载游戏时出错：',
    noGames: '未找到游戏'
  },
  // 其他语言...
};

export function GamesList({ locale }: { locale: Locale }) {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 使用useMemo缓存翻译对象
  const t = useMemo(() => {
    return translations[locale] || translations.en;
  }, [locale]);
  
  // 加载游戏数据
  useEffect(() => {
    async function fetchGames() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/games?locale=${locale}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        setGames(data.games || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchGames();
  }, [locale]);
  
  if (isLoading) return <div>{t.loading}</div>;
  if (error) return <div>{t.error} {error}</div>;
  if (games.length === 0) return <div>{t.noGames}</div>;
  
  return (
    <div className="games-grid">
      {games.map(game => (
        <Link key={game.id} href={`/${locale}/games/${game.id}`}>
          <div className="game-card">
            {game.thumb && (
              <Image 
                src={game.thumb} 
                alt={game.title} 
                width={300} 
                height={200} 
              />
            )}
            <h3>{game.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

### SEO优化

为多语言网站添加适当的SEO元数据：

```tsx
// src/app/[locale]/games/[id]/page.tsx
import { Metadata } from 'next';
import { Locale, defaultLocale } from '@/app/config/i18n';
import { db } from '@/lib/db';

// 生成动态元数据
export async function generateMetadata({
  params: { locale, id }
}: {
  params: { locale: Locale; id: string }
}): Promise<Metadata> {
  try {
    // 获取游戏数据
    const [game] = await db.query(`
      SELECT g.id, gt.title, gt.description
      FROM games g
      LEFT JOIN game_translations gt ON g.id = gt.game_id AND gt.locale = ?
      WHERE g.id = ?
    `, [locale, id]);
    
    if (!game) {
      return {
        title: 'Game Not Found',
        description: 'The requested game could not be found.'
      };
    }
    
    return {
      title: game.title,
      description: game.description,
      alternates: {
        canonical: `/${locale}/games/${id}`,
        languages: {
          'en': `/en/games/${id}`,
          'zh': `/zh/games/${id}`,
          'es': `/es/games/${id}`,
          'fr': `/fr/games/${id}`
        }
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Game Details',
      description: 'View game details'
    };
  }
}

export default async function GamePage({
  params: { locale, id }
}: {
  params: { locale: Locale; id: string }
}) {
  // 页面内容...
}
```

## 大模型提示词

以下是针对简单版和进阶版多语言实现的大模型提示词，可用于向AI助手请求帮助。

### 简单版提示词

```
我正在使用Next.js App Router构建一个简单的多语言网站。请帮我实现以下功能：

1. 设置基本的语言配置（支持英文、中文、西班牙语和法语）
2. 创建基于[locale]参数的动态路由结构
3. 实现中间件自动检测用户浏览器语言并重定向
4. 创建语言切换器组件
5. 设置静态翻译文件并创建useTranslation hook用于客户端组件

我希望实现的是最简单、最直接的多语言方案，不需要复杂的数据库支持。请提供完整的代码示例和文件结构说明。
```

### 进阶版提示词

```
我正在开发一个Next.js多语言游戏网站，已经实现了基本的多语言路由结构，现在需要实现更高级的功能。请帮我：

1. 设计双轨制翻译管理策略：
   - 公共组件使用共享翻译文件
   - 私有组件在内部管理翻译

2. 设计支持多语言的数据库结构，包括：
   - 游戏基本信息表
   - 游戏多语言翻译表
   - 分类和标签相关表

3. 实现多语言API端点，支持：
   - 获取游戏列表（带语言参数）
   - 获取游戏详情（带语言参数）

4. 创建前端组件，支持：
   - 服务器组件中使用共享翻译
   - 客户端组件中使用内部翻译对象
   - 优化性能（使用useMemo缓存翻译对象）

5. 添加适当的SEO元数据，包括多语言链接标签

请提供详细的代码示例、数据库设计和实现思路。
```

## 总结

通过本指南，我们从简单到复杂，逐步实现了Next.js的多语言功能：

1. **简单版**适合小型项目和初学者，使用静态翻译文件和基本路由实现多语言支持。
2. **进阶版**适合中大型项目，实现了动态数据的多语言支持，包括双轨制翻译管理、数据库设计、API实现和前端组件国际化。

双轨制翻译策略是一种实用的解决方案，它结合了集中管理和分散管理的优点，既保证了公共组件翻译的一致性，又提高了私有组件开发的效率。

无论你的项目规模如何，都可以根据需要选择合适的实现方案，并随着项目的发展逐步升级。

希望本指南对你实现Next.js多语言网站有所帮助！ 