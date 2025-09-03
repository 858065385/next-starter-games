# Google OAuth MVP 实现指南

## 概述
本文档记录了在 Next.js 14 项目中完整实现 Google OAuth 登录的最佳实践和解决方案，基于 NextAuth.js v4 + Prisma + PostgreSQL 技术栈。

## 技术栈
- **框架**: Next.js 14.2+ (App Router)
- **认证**: NextAuth.js v4.24+
- **数据库**: PostgreSQL (Vercel Postgres)
- **ORM**: Prisma 6.15+
- **UI**: React 18 + TypeScript

## 完整实现流程

### 1. Google Cloud Console 配置

#### 1.1 创建 OAuth 应用
```bash
1. 访问 Google Cloud Console
2. 创建新项目或选择现有项目
3. 启用 Google+ API 和 Google People API
4. 转到"凭据"页面
5. 创建"OAuth 2.0 客户端 ID"
6. 选择"Web 应用程序"
```

#### 1.2 配置重定向 URI
```
授权的重定向 URI:
- http://localhost:3000/api/auth/callback/google  (本地开发)
- https://yourdomain.com/api/auth/callback/google (生产环境)
```

#### 1.3 获取凭据
```
客户端 ID: 201337286852-xxxxx.apps.googleusercontent.com
客户端密钥: GOCSPX-xxxxxxxxx
```

### 2. 项目依赖安装

```bash
npm install next-auth@^4.24.11
npm install @next-auth/prisma-adapter@^1.0.7
npm install @prisma/client@^6.15.0
npm install prisma@^6.15.0
```

### 3. 环境变量配置

#### 3.1 本地开发 (`.env.local`)
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_DEBUG=true

# Google OAuth Credentials
GOOGLE_CLIENT_ID=201337286852-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxx

# Database Connection
DATABASE_URL="postgres://user:password@host:5432/database?sslmode=require"
```

#### 3.2 生产环境 (Vercel)
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=production-secret-key-32-chars
GOOGLE_CLIENT_ID=同上
GOOGLE_CLIENT_SECRET=同上
DATABASE_URL=vercel-postgres-connection-string
```

### 4. Prisma 数据库配置

#### 4.1 Schema 文件 (`prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// NextAuth.js Required Tables
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  emailVerified DateTime? // 重要：NextAuth 必需字段
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

#### 4.2 数据库部署
```bash
# 推送 schema 到数据库
npx prisma db push

# 生成 Prisma 客户端
npx prisma generate
```

### 5. NextAuth 配置

#### 5.1 核心配置 (`src/lib/auth.ts`)
```typescript
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Prisma 客户端单例模式（避免 serverless 连接泄漏）
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 30000, // 防止网络超时
      },
    }),
  ],
  session: {
    strategy: "jwt", // 推荐使用 JWT 模式
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('✅ Sign in successful:', { 
        user: user.email, 
        account: account?.provider 
      });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
```

#### 5.2 API 路由 (`src/app/api/auth/[...nextauth]/route.ts`)
```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

#### 5.3 用户信息路由 (`src/app/api/me/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
```

### 6. 类型定义

#### 6.1 NextAuth 类型扩展 (`src/types/next-auth.d.ts`)
```typescript
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
  }
}
```

### 7. 前端集成

#### 7.1 Session Provider (`src/components/Providers.tsx`)
```typescript
'use client';

import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

#### 7.2 根布局更新 (`src/app/layout.tsx`)
```typescript
import { Providers } from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

#### 7.3 登录组件示例 (`src/components/Header.tsx`)
```typescript
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export function Header() {
  const { data: session, status } = useSession();

  const handleGoogleSignIn = () => {
    signIn('google', { 
      callbackUrl: '/' 
    });
  };

  const handleSignOut = () => {
    signOut({ 
      callbackUrl: '/' 
    });
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span>{session.user.name}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
    >
      <span>Sign in with Google</span>
    </button>
  );
}
```

### 8. Next.js 配置

#### 8.1 图片域名配置 (`next.config.mjs`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
};

export default nextConfig;
```

#### 8.2 Package.json 脚本
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

## 登录流程详解

### 前端到后端的完整数据流

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 前端组件
    participant N as NextAuth API
    participant G as Google OAuth
    participant P as Prisma
    participant D as Database

    U->>C: 点击 "Sign in with Google"
    C->>N: signIn('google')
    N->>G: 重定向到 Google 授权页面
    G->>U: 显示 Google 登录界面
    U->>G: 输入账号密码并授权
    G->>N: 回调 /api/auth/callback/google?code=xxx
    N->>G: 使用 code 交换 access_token
    G->>N: 返回 user profile + tokens
    N->>P: adapter.getUserByAccount()
    P->>D: SELECT FROM accounts WHERE provider='google'
    alt 用户不存在
        N->>P: adapter.createUser()
        P->>D: INSERT INTO users (name, email, image, emailVerified)
        P->>N: 返回新用户 ID
        N->>P: adapter.linkAccount()  
        P->>D: INSERT INTO accounts (userId, provider, access_token...)
    else 用户已存在
        P->>N: 返回现有用户信息
    end
    N->>C: 重定向到 callbackUrl
    C->>N: getSession()
    N->>C: 返回 session 数据
    C->>U: 显示登录成功状态
```

## 常见问题和解决方案

### 问题 1: OAuthCallback 错误
**症状**: `error=OAuthCallback`
**原因**: 网络连接问题或配置错误
**解决方案**:
```typescript
// 在 GoogleProvider 中添加超时配置
GoogleProvider({
  httpOptions: {
    timeout: 30000,
  },
})
```

### 问题 2: OAuthCreateAccount 错误
**症状**: `error=OAuthCreateAccount` 
**原因**: Prisma schema 缺少 `emailVerified` 字段
**解决方案**:
```prisma
model User {
  emailVerified DateTime? // 必须包含此字段
}
```

### 问题 3: Vercel 构建失败
**症状**: `@prisma/client did not initialize yet`
**原因**: Prisma 客户端未正确生成
**解决方案**:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

### 问题 4: 图片加载失败
**症状**: Next.js Image 组件无法加载 Google 头像
**解决方案**:
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
};
```

## 部署检查清单

### 本地开发
- [ ] Google Cloud Console OAuth 应用已创建
- [ ] 重定向 URI 包含 `http://localhost:3000/api/auth/callback/google`
- [ ] `.env.local` 文件配置正确
- [ ] 数据库连接正常
- [ ] `npx prisma db push` 执行成功
- [ ] `npx prisma generate` 执行成功

### 生产部署
- [ ] Vercel 环境变量已配置
- [ ] 重定向 URI 包含生产域名
- [ ] `NEXTAUTH_URL` 设置为生产域名
- [ ] `NEXTAUTH_SECRET` 使用强密钥
- [ ] 数据库在生产环境可访问
- [ ] 构建脚本包含 `prisma generate`

## 调试技巧

### 开启调试日志
```env
NEXTAUTH_DEBUG=true
```

### 检查 Session
```typescript
// 在组件中
const { data: session, status } = useSession();
console.log('Session:', session);
console.log('Status:', status);
```

### 验证数据库
```bash
npx prisma studio
```

## 最佳实践

1. **安全性**: 永远不要在客户端暴露 `GOOGLE_CLIENT_SECRET`
2. **错误处理**: 实现适当的错误边界和用户反馈
3. **类型安全**: 使用 TypeScript 扩展 NextAuth 类型
4. **性能**: 使用 JWT 会话策略避免数据库查询
5. **调试**: 开发环境启用调试日志
6. **测试**: 本地测试完成后再部署生产环境

## 版本兼容性

| 包名 | 版本 | 说明 |
|------|------|------|
| next | ^14.2.0 | App Router 必需 |
| next-auth | ^4.24.0 | v5 有破坏性更改 |
| @next-auth/prisma-adapter | ^1.0.7 | 与 next-auth v4 兼容 |
| prisma | ^6.15.0 | 最新稳定版 |
| @prisma/client | ^6.15.0 | 与 prisma 版本匹配 |

---

**最后更新**: 2025-09-03
**测试环境**: Next.js 14.2.32, NextAuth.js 4.24.11, Prisma 6.15.0