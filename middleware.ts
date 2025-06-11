import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import { locales, defaultLocale } from './src/app/config/i18n'

/**
 * 从请求头中获取用户首选语言
 * @param request NextRequest对象
 * @returns 匹配到的支持语言
 */
function getLocale(request: NextRequest) {
  // 获取Accept-Language请求头
  const acceptLanguage = request.headers.get('accept-language') || ''
  try {
    // 使用intl-localematcher匹配最佳语言
    return match(acceptLanguage.split(',').map(lang => lang.split(';')[0].trim()), 
                locales, 
                defaultLocale)
  } catch (e) {
    // 出错时返回默认语言
    return defaultLocale
  }
}

/**
 * 中间件函数：处理所有请求，实现语言自动检测和路由重定向
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 检查URL是否已有语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  // 如果URL已有语言前缀，直接继续
  if (pathnameHasLocale) return NextResponse.next()
  
  // 排除静态资源和API路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // 获取用户首选语言并重定向
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  
  // 保留查询参数
  newUrl.search = request.nextUrl.search
  
  return NextResponse.redirect(newUrl)
}

/**
 * 配置中间件匹配的路径
 * 排除静态资源和API路由
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
} 