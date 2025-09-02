'use client'

import Link from 'next/link'
import { Locale } from '@/app/config/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTranslation } from '@/lib/translateHelper'
import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

interface HeaderProps {
  locale: Locale
  messages: any
}

/**
 * 头部导航组件
 */
export function Header({ locale, messages }: HeaderProps) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // 使用翻译辅助函数
  const t = (path: string, defaultValue: string = path) =>
    getTranslation(messages, path, defaultValue);

  // 检查链接是否为当前活动页面
  const isActive = (path: string) => {
    // 精确匹配首页
    if (path === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`
    }

    // 其他页面使用前缀匹配，但必须是完整路径段
    return pathname.startsWith(path) && (
      pathname === path ||
      pathname.startsWith(`${path}/`) ||
      pathname.startsWith(`${path}?`)
    )
  }

  // 打开侧边菜单
  const openSideMenu = () => {
    setIsSideMenuOpen(true)
    document.body.style.overflow = 'hidden' // 防止背景滚动
  }

  // 关闭侧边菜单
  const closeSideMenu = () => {
    setIsSideMenuOpen(false)
    document.body.style.overflow = '' // 恢复滚动
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      document.body.style.overflow = '' // 恢复滚动
    }
  }, [])

  // 处理 Google 登录
  const handleGoogleSignIn = () => {
    signIn('google', { 
      callbackUrl: `/${locale}` 
    })
  }

  // 处理登出
  const handleSignOut = () => {
    signOut({ 
      callbackUrl: `/${locale}` 
    })
  }

  // 渲染用户菜单
  const renderUserSection = () => {
    if (status === 'loading') {
      return (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
        </div>
      )
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
            <span className="hidden md:block text-sm font-medium">
              {session.user.name}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {t('auth.signOut', 'Sign Out')}
          </button>
        </div>
      )
    }

    return (
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>{t('auth.signInWithGoogle', 'Sign in with Google')}</span>
      </button>
    )
  }

  return (
    <>
      <header className="header-container">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <Link href={`/${locale}`} className="logo-container">
              <i className="logo i-logo2"></i>
              <h4>PlayNow</h4>
            </Link>
          </div>
          <div className="flex justify-end items-center space-x-4">
            <div className="nav-links mr-[30px] hidden md:flex">
              <Link
                href={`/${locale}`}
                className={isActive(`/${locale}`) ? "active-link" : ""}
              >
                {t('navigation.home', 'Home')}
              </Link>
            
              <Link
                href={`/${locale}/about`}
                className={isActive(`/${locale}/about`) ? "active-link" : ""}
              >
                {t('navigation.about', 'About Us')}
              </Link>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="hamburger-btn md:hidden"
              onClick={openSideMenu}
              aria-label="Open menu"
            >
              ☰
            </button>

            {/* 用户认证部分 */}
            <div className="auth-section hidden md:block">
              {renderUserSection()}
            </div>

            {/* 语言切换器 */}
            <div className="language-switcher-container">
              <LanguageSwitcher variant="dropdown" />
            </div>
          </div>

        </nav>
      </header>

      {/* 侧边菜单 */}
      <div className={`side-menu ${isSideMenuOpen ? 'active' : ''}`}>
        <button className="close-btn" onClick={closeSideMenu}>&times;</button>
        <nav className="side-menu-nav">
          <Link
            href={`/${locale}`}
            onClick={closeSideMenu}
            className={isActive(`/${locale}`) ? "active-link" : ""}
          >
            <i className="fas fa-home"></i> {t('navigation.home', 'Home')}
          </Link>
          <Link
            href={`/${locale}/games`}
            onClick={closeSideMenu}
            className={isActive(`/${locale}/games`) ? "active-link" : ""}
          >
            <i className="fas fa-gamepad"></i> {t('navigation.games', 'Games')}
          </Link>
          <Link
            href={`/${locale}/categories`}
            onClick={closeSideMenu}
            className={isActive(`/${locale}/categories`) ? "active-link" : ""}
          >
            <i className="fas fa-th-large"></i> {t('navigation.categories', 'Categories')}
          </Link>
          <Link
            href={`/${locale}/about`}
            onClick={closeSideMenu}
            className={isActive(`/${locale}/about`) ? "active-link" : ""}
          >
            <i className="fas fa-info-circle"></i> {t('navigation.about', 'About Us')}
          </Link>
          
          {/* 移动端登录区域 */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            {session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-4 py-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">{session.user.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  {t('auth.signOut', 'Sign Out')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:text-blue-300"
              >
                <i className="fab fa-google mr-2"></i>
                {t('auth.signInWithGoogle', 'Sign in with Google')}
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* 遮罩层 */}
      <div
        className={`overlay ${isSideMenuOpen ? 'active' : ''}`}
        onClick={closeSideMenu}
      ></div>
    </>
  )
} 