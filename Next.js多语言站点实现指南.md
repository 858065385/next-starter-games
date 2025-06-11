# Next.js多语言站点实现指南

本指南整合了多语言翻译方案和数据库设计方案，为构建完整的Next.js多语言站点提供全面指导。

## 目录

1. [多语言架构设计](#多语言架构设计)
2. [翻译管理策略](#翻译管理策略)
3. [数据库设计](#数据库设计)
4. [API实现](#api实现)
5. [前端组件实现](#前端组件实现)
6. [项目结构](#项目结构)
7. [实施步骤](#实施步骤)

## 多语言架构设计

### 基本架构

我们的多语言网站采用基于Next.js App Router的实现方案，具有以下特点：

1. **基于路由的语言切换**：
   - 使用`[locale]`参数化路由段实现多语言URL结构
   - 例如：`/en/games`、`/zh/games`等路径

2. **中间件自动语言检测**：
   - 使用`middleware.ts`检测用户浏览器语言
   - 自动重定向到相应的语言版本

3. **双轨制翻译管理**：
   - 公共组件：使用共享翻译文件
   - 私有组件：在组件内部管理翻译

### 语言配置

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

## 翻译管理策略

### 1. 共享翻译文件

对于公共组件和共享文本，使用集中式翻译文件：

```
src/
  messages/
    en.json
    zh.json
    es.json
    fr.json
```

翻译文件结构示例：

```json
{
  "navigation": {
    "home": "Home",
    "games": "Games",
    "about": "About Us"
  },
  "footer": {
    "copyright": "© 2025 All rights reserved",
    "privacy": "Privacy Policy"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
```

### 2. 私有化组件翻译管理

私有组件在自己内部管理翻译内容，不依赖公共语言包：

```tsx
// 组件内部定义翻译
const translations = {
  en: {
    title: 'My Component Title',
    description: 'This is a private component'
  },
  zh: {
    title: '我的组件标题',
    description: '这是一个私有组件'
  },
  // 其他语言...
};

const MyComponent = ({ locale }: { locale: Locale }) => {
  // 使用当前语言的翻译，如果不存在则使用英文
  const t = translations[locale] || translations.en;
  
  return (
    <div>
      <h2>{t.title}</h2>
      <p>{t.description}</p>
    </div>
  );
};
```

### 3. 翻译辅助函数

使用自定义辅助函数访问嵌套翻译键：

```tsx
// src/lib/translateHelper.ts
export function getTranslation(
  obj: Record<string, any> | undefined, 
  path: string,
  defaultValue: string = path
): string {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let value = obj;
  
  // 遍历嵌套路径
  for (const key of keys) {
    value = value?.[key];
    
    // 如果找不到键，返回默认值
    if (value === undefined) {
      return defaultValue;
    }
  }
  
  // 如果值不是字符串，返回默认值
  return typeof value === 'string' ? value : defaultValue;
}
```

## 数据库设计

### 表结构概览

本设计共包含**8张表**：

1. **games** - 游戏基本信息表
2. **game_translations** - 游戏多语言翻译表
3. **categories** - 分类基本信息表
4. **category_translations** - 分类多语言翻译表
5. **game_category_map** - 游戏与分类的映射关系表
6. **tags** - 标签表
7. **game_tag_map** - 游戏与标签的映射关系表
8. **game_resources** - 游戏资源表（缩略图和URL）

### 表结构详细设计

#### 1. games 表

```sql
CREATE TABLE games (
    id VARCHAR(50) PRIMARY KEY,  -- 游戏唯一标识符
    weight INT DEFAULT 0,        -- 游戏权重，用于排序
    width INT,                   -- 游戏宽度
    height INT                   -- 游戏高度
);
```

#### 2. game_translations 表

```sql
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

#### 3. categories 表

```sql
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,  -- 分类唯一标识符
    weight INT DEFAULT 0         -- 分类权重，用于排序
);
```

#### 4. category_translations 表

```sql
CREATE TABLE category_translations (
    category_id VARCHAR(50),     -- 关联到categories表的id
    locale VARCHAR(10),          -- 语言代码
    title VARCHAR(255) NOT NULL, -- 分类标题
    description TEXT,            -- 分类描述
    PRIMARY KEY (category_id, locale),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

#### 5. game_category_map 表

```sql
CREATE TABLE game_category_map (
    game_id VARCHAR(50),         -- 游戏ID
    category_id VARCHAR(50),     -- 分类ID
    PRIMARY KEY (game_id, category_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

#### 6. tags 表

```sql
CREATE TABLE tags (
    id VARCHAR(50) PRIMARY KEY,  -- 标签唯一标识符
    name VARCHAR(50) NOT NULL    -- 标签名称
);
```

#### 7. game_tag_map 表

```sql
CREATE TABLE game_tag_map (
    game_id VARCHAR(50),         -- 游戏ID
    tag_id VARCHAR(50),          -- 标签ID
    PRIMARY KEY (game_id, tag_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

#### 8. game_resources 表

```sql
CREATE TABLE game_resources (
    game_id VARCHAR(50) PRIMARY KEY,  -- 游戏ID
    thumb VARCHAR(255),               -- 缩略图路径
    url VARCHAR(255) NOT NULL,        -- 游戏URL
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

## API实现

### 1. 获取所有游戏列表

```typescript
// src/app/api/games/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  try {
    // 查询游戏基本信息、翻译、资源和标签
    const games = await db.query(`
      SELECT g.id, g.weight, g.width, g.height, 
             gt.title, gt.description, 
             gr.thumb, gr.url,
             GROUP_CONCAT(t.name) as tags
      FROM games g
      LEFT JOIN game_translations gt ON g.id = gt.game_id AND gt.locale = ?
      LEFT JOIN game_resources gr ON g.id = gr.game_id
      LEFT JOIN game_tag_map gtm ON g.id = gtm.game_id
      LEFT JOIN tags t ON gtm.tag_id = t.id
      GROUP BY g.id
      ORDER BY g.weight DESC
    `, [locale]);
    
    return NextResponse.json({ games });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
```

### 2. 获取分类及其游戏

```typescript
// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  try {
    // 获取所有分类及其翻译
    const categories = await db.query(`
      SELECT c.id, c.weight, ct.title, ct.description
      FROM categories c
      LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = ?
      ORDER BY c.weight DESC
    `, [locale]);
    
    // 对每个分类，获取其游戏
    for (const category of categories) {
      const games = await db.query(`
        SELECT g.id, g.weight, gt.title, gr.thumb
        FROM games g
        JOIN game_category_map gcm ON g.id = gcm.game_id
        LEFT JOIN game_translations gt ON g.id = gt.game_id AND gt.locale = ?
        LEFT JOIN game_resources gr ON g.id = gr.game_id
        WHERE gcm.category_id = ?
        ORDER BY g.weight DESC
      `, [locale, category.id]);
      
      category.games = games;
    }
    
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
```

### 3. 获取单个游戏详情

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
    // 获取游戏基本信息和资源
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
    
    // 获取游戏标签
    const tags = await db.query(`
      SELECT t.name
      FROM tags t
      JOIN game_tag_map gtm ON t.id = gtm.tag_id
      WHERE gtm.game_id = ?
    `, [id]);
    
    // 获取游戏分类
    const categories = await db.query(`
      SELECT c.id, ct.title
      FROM categories c
      JOIN game_category_map gcm ON c.id = gcm.category_id
      LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = ?
      WHERE gcm.game_id = ?
    `, [locale, id]);
    
    // 组合所有数据
    const gameDetails = {
      ...game,
      title: translation?.title || '',
      description: translation?.description || '',
      instructions: translation?.instructions || '',
      tags: tags.map(tag => tag.name),
      categories: categories.map(cat => ({ id: cat.id, title: cat.title }))
    };
    
    return NextResponse.json({ game: gameDetails });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game details' }, { status: 500 });
  }
}
```

## 前端组件实现

### 1. 布局组件

```tsx
// src/app/[locale]/layout.tsx
import { Locale, locales } from '@/app/config/i18n';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
```

### 2. 语言切换器组件

```tsx
// src/components/LanguageSwitcher.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Locale, locales, localeNames } from '@/app/config/i18n'

export function LanguageSwitcher({
  variant = 'dropdown',
}: {
  variant?: 'dropdown' | 'horizontal'
}) {
  const pathname = usePathname()
  const { locale: currentLocale } = useParams() as { locale: Locale }
  
  // 提取当前路径中的语言代码后的部分
  const pathnameWithoutLocale = pathname.split('/').slice(2).join('/')
  
  // 根据变体渲染不同样式的语言切换器
  if (variant === 'horizontal') {
    return (
      <div className="flex items-center space-x-4">
        {locales.map((locale) => (
          <Link
            key={locale}
            href={`/${locale}/${pathnameWithoutLocale}`}
            className={locale === currentLocale ? "active" : ""}
          >
            {localeNames[locale]}
          </Link>
        ))}
      </div>
    )
  }
  
  // 默认下拉菜单样式
  return (
    <div className="relative">
      {/* 下拉菜单实现 */}
    </div>
  )
}
```

### 3. 私有组件示例

```tsx
// src/components/GamesList.tsx
'use client';

import { useState, useEffect } from 'react';
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

export default function GamesList() {
  const [gamesData, setGamesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { locale } = useParams() as { locale: Locale };
  
  // 获取当前语言的翻译，如果不存在则使用英文
  const t = translations[locale] || translations.en;
  
  // 加载游戏数据
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/games?locale=${locale}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }
        const data = await response.json();
        setGamesData(data.games);
      } catch (err) {
        console.error('Error loading games data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [locale]);

  // 如果正在加载，显示加载提示
  if (isLoading) {
    return <div className="loading-indicator">{t.loading}</div>;
  }

  // 如果发生错误，显示错误信息
  if (error) {
    return <div className="error-message">{t.error} {error}</div>;
  }

  // 渲染游戏列表
  return (
    <div className="games-container">
      {/* 游戏列表渲染逻辑 */}
    </div>
  );
}
```

## 项目结构

```
my-multilingual-app/
├── public/
│   ├── data/          # 静态数据文件
│   └── images/        # 图片资源
├── src/
│   ├── app/
│   │   ├── [locale]/  # 多语言路由
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── games/
│   │   │   └── play/
│   │   ├── api/       # API路由
│   │   │   ├── games/
│   │   │   └── categories/
│   │   └── config/    # 配置文件
│   │       └── i18n.ts
│   ├── components/    # 组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── GamesList.tsx
│   ├── lib/           # 工具函数
│   │   ├── db.ts      # 数据库连接
│   │   ├── getMessages.ts
│   │   └── translateHelper.ts
│   ├── messages/      # 翻译文件
│   │   ├── en.json
│   │   ├── zh.json
│   │   ├── es.json
│   │   └── fr.json
│   └── types/         # 类型定义
│       └── routeParams.ts
├── middleware.ts      # 中间件（语言检测）
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 实施步骤

### 1. 项目初始化

1. 创建Next.js项目
2. 配置多语言路由结构
3. 设置中间件进行语言检测和重定向

### 2. 数据库设置

1. 创建数据库和表结构
2. 解析现有JSON数据
3. 插入基础数据和关系数据
4. 处理多语言数据和资源数据

### 3. API实现

1. 创建游戏列表API
2. 创建分类API
3. 创建游戏详情API
4. 创建搜索API

### 4. 前端组件开发

1. 实现布局组件
2. 实现导航和页脚组件
3. 实现语言切换器
4. 实现游戏列表和详情页面

### 5. 多语言翻译管理

1. 创建共享翻译文件
2. 实现翻译辅助函数
3. 为私有组件添加内部翻译对象

### 6. 测试与优化

1. 测试所有语言版本
2. 验证数据库查询性能
3. 优化前端组件渲染
4. 确保没有水合问题

---

通过遵循本指南，您可以构建一个功能完善的Next.js多语言站点，包括多语言路由、自动语言检测、双轨制翻译管理和完整的数据库支持。 