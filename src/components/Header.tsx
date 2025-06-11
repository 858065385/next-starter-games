'use client'

import Link from 'next/link'
import { Locale } from '@/app/config/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTranslation } from '@/lib/translateHelper'

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

  return (
    <>
      <header className="header-container">
        <nav className="navigation flex justify-between items-center">
          <div>
            <Link href={`/${locale}`} className="logo-container">
              <i className="logo i-logo2"></i>
              <h4>PlayNow</h4>
            </Link>
          </div>
          <div className="flex justify-end">
            <div className="nav-links mr-[30px]">
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