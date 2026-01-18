# 🌿 Personal Digital Garden

A premium, full-stack personal portfolio and digital garden built with the latest **Next.js 15** ecosystem. Designed with "Advanced Minimalism" logic, featuring smooth animations, robust internationalization, and a powerful admin content management system.

## ✨ Features

### 🎨 Frontend Experiences
- **Premium Design**: "Advanced Minimalism" aesthetic with glassmorphism, dynamic grids, and noise textures.
- **Micro-Interactions**: Smooth page transitions and element animations powered by **Framer Motion**.
- **Responsive Layout**: Mobile-first design that looks stunning on all devices.
- **Internationalization (i18n)**: Seamless English/Chinese switching support via **next-intl**.

### 🛠️ Core Modules
- **Home**: Dynamic hero section with "System Status" visualization and staggered entry animations.
- **About**: Modern "Bento Grid" layout showcasing personal info, tech stack, and social connections.
- **Articles**: Full-featured blog system with Markdown rendering, TOC (Table of Contents), and metadata support.
- **Projects**: Portfolio showcase with links to demos and source code.
- **Share**: A collection of curated resources (Software, Tools) with category filtering and dynamic search.

### ⚡ Admin Dashboard
- **Secure Authentication**: Protected routes powered by **NextAuth.js v5**.
- **Content Management**:
  - **Article Editor**: Markdown editor with metadata management.
  - **Project Manager**: Add/Edit/Delete portfolio projects.
  - **Share Manager**: Advanced resource management with dynamic category schemas and auto-fetching metadata.
  - **Analytics**: Dashboard overview of content statistics.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI System**: [Radix UI](https://www.radix-ui.com/) Primitives, Lucide Icons
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma](https://www.prisma.io/) (ORM)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/digital-garden.git
   cd digital-garden
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
    Create a `.env` file in the root directory:
   ```env
   # Database (SQLite for dev, Postgres for prod)
   DATABASE_URL="file:./dev.db"

   # NextAuth
   AUTH_SECRET="your-secret-key-at-least-32-chars"
   AUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: Seed initial data
   # npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
├── app/                  # Next.js App Router Pages
│   ├── [locale]/         # Public pages (Home, About, etc.)
│   ├── admin/            # Protected Admin Dashboard
│   └── api/              # API Route Handlers
├── components/           # Reusable UI Components
│   ├── layout/           # Header, Footer, Nav
│   ├── ui/               # Design System Primitives
│   └── ...
├── i18n/                 # Internationalization Config
├── lib/                  # Utilities & Helpers
├── prisma/               # Database Schema & Migrations
└── public/               # Static Assets
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
