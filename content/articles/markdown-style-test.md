---
title: "Markdown 排版样式测试指南"
date: "2026-03-08"
description: "这是一篇用于测试当前网站 Markdown 渲染效果（如标题、引用、代码块、列表、图片等）的文章。"
tags: ["Test", "Markdown", "Design"]
---

本文旨在全面测试基于 Tailwind Typography（prose）定制的暖色调排版样式，确保各个层级的元素都能完美契合并保持极佳的阅读体验。

## 1. 标题层级

### 这是 H3 标题
下面开始介绍基础元素排版，H3 的字号和间距经过优化，不会显得过于突兀。

#### 这是 H4 标题
H4 通常用于小节内的并列点或补充说明。

##### 这是 H5 标题
极其次要的重点（很少用到）。

---

## 2. 强调文字与超链接

在这段文本中，你可以看到**加粗的强调文字 (Strong)**，以及微倾斜的*斜体字 (Italic)*。如果文本中有删除线，我们可以使用 ~~删除文本 (Strikethrough)~~。

此外，这里是一个 [外部链接示例 (Cbiu 的小站)](https://github.com)，由于我们调整了 `prose-a` 的样式，现在链接默认是没有下划线的，而是使用了主强调色（棕色 `#C4956A`），只有在鼠标悬浮时才会出现下划线。

## 3. 引用块 (Blockquote)

有时我们需要引用一段名言或特殊说明。经过定制，引用块的左侧边框变为了暖色调，并带有淡淡的卡片背景：

> **设计准则：留白与呼吸感**
> 
> "好的设计不是在没有东西可以添加时实现的，而是在没有东西可以带走时实现的。" —— Antoine de Saint-Exupéry
>
> 温暖的色调配合充足的间距，能让访客感受到站点的精致与宁静。

## 4. 列表展示

列表在排版中非常长见，这里我们测试了无序列表和有序列表。

### 无序列表 (Unordered List)

- 前端技术栈
  - React / Next.js
  - Tailwind CSS
  - TypeScript
- 后端与工具
  - Prisma
  - Node.js
- 其它爱好
  - 极简设计
  - 胶片摄影

### 有序列表 (Ordered List)

1. 第一步：构思并设计 UI 草图。
2. 第二步：搭建脚手架与基础组件（如粘性导航栏、文章目录）。
3. 第三步：打磨排版细节，例如当前你正在查看的 Markdown Prose。

## 5. 代码块 (Code Blocks)

针对技术博客，代码块是重中之重。

**行内代码：** 比如我们需要用到 `useState` 或 `useEffect` 时，这段行内代码去掉了默认的反引号，并加上了柔和的浅色底色 `bg-[#E8DDD0]/50` 和圆角。

**多行代码块：** 以深色 `#2C2520` 为背景的高亮代码块，确保阅读源码时没有刺眼的对比度。

```tsx
import { useState, useEffect } from "react"

export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Hello")

  useEffect(() => {
    // 模拟一段异步加载
    const timer = setTimeout(() => {
      setGreeting("Welcome back")
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 p-4 rounded-xl bg-orange-50">
      <span className="text-orange-800 font-bold">{greeting}, {name}!</span>
    </div>
  )
}
```

## 6. 图片 (Images)

文章插图也做了圆角和微边框处理，使其更好地融入外层环境。

![Placeholder Image Example](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073&ixlib=rb-4.0.3)

*图注：这是从 Unsplash 引用的一张风景配图*

## 7. 分隔线 (Horizontal Rule)

文章需要分段时，分隔线（`hr`）的颜色也被调暖了一度。

---

## 8. 表格 (Tables)

最后，我们看看常见的表格展示情况：

| 框架/库 | 用途 | 熟悉度 |
| :--- | :--- | :---: |
| Next.js | 全栈应用框架，支持 SSR/SSG | 熟悉 |
| Tailwind CSS | 实用工具类 CSS 框架 | 熟练 |
| Prisma | 现代化的 ORM 数据操控 | 掌握 |
| Next-Auth | 身份验证与登录授权 | 掌握 |

以上就是所有的 Markdown 测试内容。这套排版确保了“Cbiu 的小站”呈现出精致、耐看且一致的暖色阅读体验。
