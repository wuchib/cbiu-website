# 项目上下文 (Project Context)

## 1. 项目概况
- **类型**: Next.js Web 应用
- **主要功能**: 个人作品集、博客文章管理、资源分享、后台管理系统
- **当前任务**: 后台管理系统 (Admin Dashboard) 的国际化 (i18n) 完善

## 2. 技术栈
- **框架**: Next.js (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **ORM**: Prisma (SQLite/MySQL)
- **UI 组件**: 自定义组件 + Radix UI (推测) + Iconify
- **国际化**: next-intl

## 3. 目录结构
- `app/admin`: 后台管理页面
- `components/admin`: 后台管理组件
- `i18n`: 国际化配置与字典 (`messages.ts` 为核心字典文件)
- `prisma`: 数据库模型

## 4. 国际化规范
- 字典文件位置: `i18n/messages.ts`
- 命名空间: `Admin`, `HomePage`, `Common` 等
- 使用方式: 服务端组件 `getTranslations`, 客户端组件 `useTranslations`

## 5. 开发协议
- **中文原生协议 v5.0**: 注释、文档、Git 提交信息需使用中文。
