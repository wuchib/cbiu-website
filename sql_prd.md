# 数据库设计 PRD (SQL)

## 1. 概述 (Overview)
本项目为个人网站 (Personal Portfolio / Blog) 的后台数据库设计。核心模块包括：文章 (Articles)、项目展示 (Projects)、资源分享 (Share)、用户管理 (User) 以及全局配置 (Profile/Global)。

## 2. 数据库实体与关系 (Entities & Relationships)

### 用户模块 (User)
用于后台管理登录。
*   `User`: 管理员账户

### 内容模块 (Content)
*   `Article`: 博客文章
*   `Project`: 项目作品
*   `ShareResource`: 分享资源 (设计、开发工具等)
*   `Tag`: 标签 (文章和项目公用或分开)
*   `Category`: 分类 (主要用于 Share 模块，文章目前使用 Tag 归类，预留 Category 字段)

### 关系 (Relationships)
*   `Article` <-> `Tag` (Many-to-Many)
*   `Project` <-> `Tag` (Many-to-Many)
*   `ShareResource` <-> `Category` (Many-to-One)

## 3. 表结构设计 (Schema)

命名规范: 使用 `snake_case` (下划线命名法)。

### 3.1 用户表 (`users`)
| 字段名 (Field) | 类型 (Type) | 必填 (Required) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | Yes | 主键 |
| `username` | VARCHAR(50) | Yes | 用户名 |
| `email` | VARCHAR(100)| Yes | 邮箱 (唯一) |
| `password_hash`| VARCHAR(255)| Yes | 密码哈希 |
| `role` | VARCHAR(20) | Yes | 角色 (如 `admin`, `guest`) |
| `created_at` | TIMESTAMP | Yes | 创建时间 |
| `updated_at` | TIMESTAMP | Yes | 更新时间 |

### 3.2 文章表 (`articles`)
| 字段名 (Field) | 类型 (Type) | 必填 (Required) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | Yes | 主键 |
| `slug` | VARCHAR(100)| Yes | URL 友好的唯一标识 (唯一) |
| `title` | VARCHAR(200)| Yes | 文章标题 |
| `description` | TEXT | No | 文章摘要/简介 |
| `content` | LONGTEXT | Yes | 文章内容 (Markdown) |
| `cover_image` | VARCHAR(255)| No | 封面图片 URL |
| `published` | BOOLEAN | Yes | 是否发布 (默认 False) |
| `view_count` | INT | No | 阅读量 (默认 0) |
| `published_at` | TIMESTAMP | No | 发布时间 |
| `created_at` | TIMESTAMP | Yes | 创建时间 |
| `updated_at` | TIMESTAMP | Yes | 更新时间 |

### 3.3 项目表 (`projects`)
| 字段名 (Field) | 类型 (Type) | 必填 (Required) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | Yes | 主键 |
| `slug` | VARCHAR(100)| Yes | URL 标识 |
| `title` | VARCHAR(200)| Yes | 项目名称 |
| `description` | TEXT | Yes | 项目简介 |
| `content` | LONGTEXT | No | 项目详细介绍 |
| `thumbnail` | VARCHAR(255)| No | 缩略图 URL |
| `demo_url` | VARCHAR(255)| No | 演示地址 |
| `github_url` | VARCHAR(255)| No | 代码仓库地址 |
| `featured` | BOOLEAN | No | 是否精选/首页展示 |
| `order` | INT | No | 排序权重 |
| `created_at` | TIMESTAMP | Yes | 创建时间 |
| `updated_at` | TIMESTAMP | Yes | 更新时间 |

### 3.4 分享资源表 (`share_resources`)
| 字段名 (Field) | 类型 (Type) | 必填 (Required) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | Yes | 主键 |
| `title` | VARCHAR(200)| Yes | 资源标题 (如 "Tailwind CSS") |
| `description` | VARCHAR(500)| Yes | 简短描述 |
| `link` | VARCHAR(255)| Yes | 跳转链接 |
| `icon_name` | VARCHAR(100)| No | 图标名称 (如 Iconify ID) |
| `category_key` | VARCHAR(50) | Yes | 分类 Key (关联 `share_categories` 或 Enum) |
| `order` | INT | No | 排序权重 |
| `created_at` | TIMESTAMP | Yes | 创建时间 |

### 3.5 分享分类表 (`share_categories`)
*虽可以用 Enum，但为了灵活可配置，建议建表*
| 字段名 (Field) | 类型 (Type) | 必填 (Required) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| `key` | VARCHAR(50) | Yes | 分类标识 (如 `design`, `dev-tools`) (主键) |
| `name` | VARCHAR(100)| Yes | 显示名称 (如 "Design Resources") |
| `description`| VARCHAR(255)| No | 分类描述 |
| `icon` | VARCHAR(100)| No | 分类图标 |
| `color` | VARCHAR(50) | No | 颜色主题 (Tailwind 类名 or Hex) |
| `sort_order` | INT | No | 排序顺序 |

### 3.6 标签表 (`tags`)
| 字段名 (Field) | 类型 (Type) | 必填 (Required) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| `id` | UUID / INT | Yes | 主键 |
| `name` | VARCHAR(50) | Yes | 标签名 (如 "React") |
| `slug` | VARCHAR(50) | Yes | 标签 URL 标识 |

### 3.7 关联表 (Junction Tables)
*   **`article_tags`**
    *   `article_id` (FK)
    *   `tag_id` (FK)
*   **`project_tags`**
    *   `project_id` (FK)
    *   `tag_id` (FK)
*   **`share_tags`** (可选，如果 Share 资源也需要 Tag)
    *   `resource_id` (FK)
    *   `tag_id` (FK)

## 4. 扩展: 全局配置表 (`global_settings`)
用于存储关于我 (About)、SEO 等动态配置，避免硬编码。
| 字段名 (Field) | 类型 (Type) | 必填 (Required) | 说明 (Description) |
| :--- | :--- | :--- | :--- |
| `key` | VARCHAR(50) | Yes | 配置键 (如 `site_title`, `about_bio`) (主键) |
| `value` | TEXT | Yes | 配置值 |
| `type` | VARCHAR(20) | No | 类型 (text, image, json) |

## 5. 迁移计划 (Migration Plan)
1.  **Init**: 初始化上述表结构。
2.  **Seed**: 将现有的 Markdown 文章 (`content/articles/*.md`) 和 `page.tsx` 中的硬编码数据 (Projects, Share Resources) 导入数据库。
3.  **API**: 开发 Next.js API Routes 或 Server Actions 读取数据库。

---
*Created by Agent Antigravity*
