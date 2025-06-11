# Windows批量复制模板文件命令

以下是在Windows命令行中批量复制Next.js多语言站点模板文件的命令。这些命令将帮助您快速创建新的项目，同时保留必要的文件结构和配置。

## 创建基本目录结构

```batch
@echo off
REM 创建新项目目录
mkdir my-new-multilingual-app
cd my-new-multilingual-app

REM 创建基本目录结构
mkdir public
mkdir public\data
mkdir public\images
mkdir public\images\games
mkdir src
mkdir src\app
mkdir src\app\[locale]
mkdir src\app\[locale]\about
mkdir src\app\[locale]\games
mkdir src\app\[locale]\play
mkdir src\app\api
mkdir src\app\api\games
mkdir src\app\api\categories
mkdir src\app\config
mkdir src\components
mkdir src\lib
mkdir src\messages
mkdir src\types

echo 基本目录结构已创建完成!
```

## 复制核心配置文件

```batch
@echo off
REM 设置源项目路径（请修改为您的源项目路径）
set SOURCE_PATH=E:\work\建站\my-multilingual-app

REM 设置目标项目路径（请修改为您的新项目路径）
set TARGET_PATH=E:\work\建站\my-new-multilingual-app

REM 复制核心配置文件
copy "%SOURCE_PATH%\package.json" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\tsconfig.json" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\next.config.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\middleware.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\tailwind.config.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\postcss.config.mjs" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\eslint.config.mjs" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\next-env.d.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\.gitignore" "%TARGET_PATH%\"

echo 核心配置文件已复制完成!
```

## 复制多语言配置和工具

```batch
@echo off
REM 设置源项目路径（请修改为您的源项目路径）
set SOURCE_PATH=E:\work\建站\my-multilingual-app

REM 设置目标项目路径（请修改为您的新项目路径）
set TARGET_PATH=E:\work\建站\my-new-multilingual-app

REM 复制多语言配置文件
copy "%SOURCE_PATH%\src\app\config\i18n.ts" "%TARGET_PATH%\src\app\config\"

REM 复制翻译工具函数
copy "%SOURCE_PATH%\src\lib\translateHelper.ts" "%TARGET_PATH%\src\lib\"
copy "%SOURCE_PATH%\src\lib\getMessages.ts" "%TARGET_PATH%\src\lib\"

REM 复制翻译文件
copy "%SOURCE_PATH%\src\messages\*.json" "%TARGET_PATH%\src\messages\"

REM 复制类型定义
copy "%SOURCE_PATH%\src\types\*.ts" "%TARGET_PATH%\src\types\"

echo 多语言配置和工具已复制完成!
```

## 复制组件文件

```batch
@echo off
REM 设置源项目路径（请修改为您的源项目路径）
set SOURCE_PATH=E:\work\建站\my-multilingual-app

REM 设置目标项目路径（请修改为您的新项目路径）
set TARGET_PATH=E:\work\建站\my-new-multilingual-app

REM 复制核心组件
copy "%SOURCE_PATH%\src\components\Header.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\Footer.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\Navigation.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\LanguageSwitcher.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\LocaleLink.tsx" "%TARGET_PATH%\src\components\"

echo 组件文件已复制完成!
```

## 复制路由和布局文件

```batch
@echo off
REM 设置源项目路径（请修改为您的源项目路径）
set SOURCE_PATH=E:\work\建站\my-multilingual-app

REM 设置目标项目路径（请修改为您的新项目路径）
set TARGET_PATH=E:\work\建站\my-new-multilingual-app

REM 复制布局和页面文件
copy "%SOURCE_PATH%\src\app\[locale]\layout.tsx" "%TARGET_PATH%\src\app\[locale]\"
copy "%SOURCE_PATH%\src\app\[locale]\page.tsx" "%TARGET_PATH%\src\app\[locale]\"
copy "%SOURCE_PATH%\src\app\[locale]\providers.tsx" "%TARGET_PATH%\src\app\[locale]\"

REM 复制子页面文件
copy "%SOURCE_PATH%\src\app\[locale]\about\page.tsx" "%TARGET_PATH%\src\app\[locale]\about\"
copy "%SOURCE_PATH%\src\app\[locale]\games\page.tsx" "%TARGET_PATH%\src\app\[locale]\games\"
copy "%SOURCE_PATH%\src\app\[locale]\play\page.tsx" "%TARGET_PATH%\src\app\[locale]\play\"

echo 路由和布局文件已复制完成!
```

## 复制静态数据文件

```batch
@echo off
REM 设置源项目路径（请修改为您的源项目路径）
set SOURCE_PATH=E:\work\建站\my-multilingual-app

REM 设置目标项目路径（请修改为您的新项目路径）
set TARGET_PATH=E:\work\建站\my-new-multilingual-app

REM 复制数据文件
copy "%SOURCE_PATH%\public\data\games.json" "%TARGET_PATH%\public\data\"

REM 复制图片文件（如果需要）
xcopy "%SOURCE_PATH%\public\images\games\*" "%TARGET_PATH%\public\images\games\" /E /I /Y

echo 静态数据文件已复制完成!
```

## 一键复制所有文件（综合命令）

```batch
@echo off
REM 设置源项目路径（请修改为您的源项目路径）
set SOURCE_PATH=E:\work\建站\my-multilingual-app

REM 设置目标项目路径（请修改为您的新项目路径）
set TARGET_PATH=E:\work\建站\my-new-multilingual-app

REM 创建目标目录（如果不存在）
if not exist "%TARGET_PATH%" mkdir "%TARGET_PATH%"

REM 创建基本目录结构
mkdir "%TARGET_PATH%\public"
mkdir "%TARGET_PATH%\public\data"
mkdir "%TARGET_PATH%\public\images"
mkdir "%TARGET_PATH%\public\images\games"
mkdir "%TARGET_PATH%\src"
mkdir "%TARGET_PATH%\src\app"
mkdir "%TARGET_PATH%\src\app\[locale]"
mkdir "%TARGET_PATH%\src\app\[locale]\about"
mkdir "%TARGET_PATH%\src\app\[locale]\games"
mkdir "%TARGET_PATH%\src\app\[locale]\play"
mkdir "%TARGET_PATH%\src\app\api"
mkdir "%TARGET_PATH%\src\app\api\games"
mkdir "%TARGET_PATH%\src\app\api\categories"
mkdir "%TARGET_PATH%\src\app\config"
mkdir "%TARGET_PATH%\src\components"
mkdir "%TARGET_PATH%\src\lib"
mkdir "%TARGET_PATH%\src\messages"
mkdir "%TARGET_PATH%\src\types"

REM 复制核心配置文件
copy "%SOURCE_PATH%\package.json" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\tsconfig.json" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\next.config.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\middleware.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\tailwind.config.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\postcss.config.mjs" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\eslint.config.mjs" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\next-env.d.ts" "%TARGET_PATH%\"
copy "%SOURCE_PATH%\.gitignore" "%TARGET_PATH%\"

REM 复制多语言配置和工具
copy "%SOURCE_PATH%\src\app\config\i18n.ts" "%TARGET_PATH%\src\app\config\"
copy "%SOURCE_PATH%\src\lib\translateHelper.ts" "%TARGET_PATH%\src\lib\"
copy "%SOURCE_PATH%\src\lib\getMessages.ts" "%TARGET_PATH%\src\lib\"
copy "%SOURCE_PATH%\src\messages\*.json" "%TARGET_PATH%\src\messages\"
copy "%SOURCE_PATH%\src\types\*.ts" "%TARGET_PATH%\src\types\"

REM 复制组件文件
copy "%SOURCE_PATH%\src\components\Header.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\Footer.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\Navigation.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\LanguageSwitcher.tsx" "%TARGET_PATH%\src\components\"
copy "%SOURCE_PATH%\src\components\LocaleLink.tsx" "%TARGET_PATH%\src\components\"

REM 复制布局和页面文件
copy "%SOURCE_PATH%\src\app\[locale]\layout.tsx" "%TARGET_PATH%\src\app\[locale]\"
copy "%SOURCE_PATH%\src\app\[locale]\page.tsx" "%TARGET_PATH%\src\app\[locale]\"
copy "%SOURCE_PATH%\src\app\[locale]\providers.tsx" "%TARGET_PATH%\src\app\[locale]\"

REM 复制子页面文件
copy "%SOURCE_PATH%\src\app\[locale]\about\page.tsx" "%TARGET_PATH%\src\app\[locale]\about\"
copy "%SOURCE_PATH%\src\app\[locale]\games\page.tsx" "%TARGET_PATH%\src\app\[locale]\games\"
copy "%SOURCE_PATH%\src\app\[locale]\play\page.tsx" "%TARGET_PATH%\src\app\[locale]\play\"

REM 复制数据和图片文件
copy "%SOURCE_PATH%\public\data\games.json" "%TARGET_PATH%\public\data\"
xcopy "%SOURCE_PATH%\public\images\games\*" "%TARGET_PATH%\public\images\games\" /E /I /Y

echo 所有文件已复制完成!
echo 请运行 "npm install" 安装依赖。
```

## 使用说明

1. 将上述批处理命令保存为`.bat`文件（例如`copy-template.bat`）
2. 根据您的实际路径修改`SOURCE_PATH`和`TARGET_PATH`
3. 双击运行批处理文件
4. 复制完成后，进入新项目目录运行`npm install`安装依赖

## 注意事项

1. 确保在运行命令前修改源路径和目标路径
2. 如果目标目录已存在，某些文件可能会被覆盖
3. 复制完成后，建议检查文件完整性
4. 如果您的项目使用了Git，新项目需要重新初始化Git仓库 