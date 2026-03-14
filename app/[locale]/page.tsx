import { Link } from "@/i18n/routing"
import { Icon } from "@iconify/react"
import { prisma } from "@/lib/prisma"
import { MobileRightSidebarContent } from "@/components/layout/right-sidebar"

const todoStatusMap: Record<number, { label: string; color: string }> = {
  0: { label: '规划中', color: '#C4956A' },
  1: { label: '执行中', color: '#7AAEC4' },
  2: { label: '已完成', color: '#7ABF8A' },
  3: { label: '已废弃', color: '#8B7E74' },
}

function FilmStrip({
  title,
  icon,
  children,
  dupChildren,
}: {
  title: string
  icon: string
  children: React.ReactNode
  dupChildren: React.ReactNode
}) {
  return (
    <div className="min-w-0 w-full">
      <div className="flex items-center gap-2 mb-3">
        <Icon icon={icon} className="h-4 w-4 text-[#C4956A]" />
        <h2 className="text-[14px] font-semibold text-[#2C2520]">{title}</h2>
      </div>
      <div className="film-strip-container min-w-0 w-full rounded-lg overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(44,37,32,0.12)' }}>
        {/* sprocket holes — CSS background, adapts to container width */}
        <div className="film-sprocket w-full" />
        {/* scrolling area */}
        <div className="relative bg-[#DDD0C0] min-w-0">
          <div className="overflow-hidden min-w-0">
            <div className="film-scroll-track flex gap-[4px] py-[10px] px-[4px] w-max">
              {children}
              {dupChildren}
            </div>
          </div>
        </div>
        <div className="film-sprocket w-full" />
      </div>
    </div>
  )
}

function ArticleFrame({ article }: {
  article: { id: string; title: string; slug: string; description: string | null; publishedAt: Date | null }
}) {
  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="film-frame w-[160px] h-[130px] flex-shrink-0 rounded p-3 flex flex-col gap-1 cursor-pointer overflow-hidden">
        <div className="text-[8px] text-[#A89888] font-mono tracking-widest uppercase">
          {article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
            : '—'}
        </div>
        <h3 className="text-[11px] font-medium text-[#2C2520] leading-snug line-clamp-3 flex-1">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-[9px] text-[#8B7E74] leading-snug line-clamp-2">
            {article.description}
          </p>
        )}
        <div className="flex items-center gap-1 pt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C4956A]" />
          <span className="text-[8px] text-[#A89888] font-mono tracking-wider">ARTICLE</span>
        </div>
      </div>
    </Link>
  )
}

function ShareFrame({ share }: {
  share: { id: string; title: string; description: string; link: string; iconName: string | null; categoryKey: string; createdAt: Date }
}) {
  return (
    <a href={share.link} target="_blank" rel="noreferrer">
      <div className="film-frame w-[160px] h-[130px] flex-shrink-0 rounded p-3 flex flex-col gap-1 cursor-pointer overflow-hidden">
        <div className="text-[8px] text-[#A89888] font-mono tracking-widest uppercase">
          {new Date(share.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </div>
        <div className="flex items-start gap-1.5 flex-1">
          {share.iconName && (
            <Icon icon={share.iconName} className="h-3.5 w-3.5 text-[#C4956A] flex-shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-[11px] font-medium text-[#2C2520] leading-snug line-clamp-2">
              {share.title}
            </h3>
            <p className="text-[9px] text-[#8B7E74] leading-snug line-clamp-2">
              {share.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 pt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7AAEC4]" />
          <span className="text-[8px] text-[#A89888] font-mono tracking-wider uppercase">{share.categoryKey}</span>
        </div>
      </div>
    </a>
  )
}

function TodoFrame({ todo }: {
  todo: { id: string; title: string; description: string | null; status: number; createdAt: Date }
}) {
  const statusInfo = todoStatusMap[todo.status] ?? todoStatusMap[0]
  return (
    <div className="film-frame w-[160px] h-[130px] flex-shrink-0 rounded p-3 flex flex-col gap-1 cursor-default overflow-hidden">
      <div className="text-[8px] text-[#A89888] font-mono tracking-widest uppercase">
        {new Date(todo.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
      </div>
      <h3 className="text-[11px] font-medium text-[#2C2520] leading-snug line-clamp-3 flex-1">
        {todo.title}
      </h3>
      {todo.description && (
        <p className="text-[9px] text-[#8B7E74] leading-snug line-clamp-2">
          {todo.description}
        </p>
      )}
      <div className="flex items-center gap-1 pt-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusInfo.color }} />
        <span className="text-[8px] font-mono tracking-wider" style={{ color: statusInfo.color }}>
          {statusInfo.label}
        </span>
      </div>
    </div>
  )
}

function EmptyFrame({ label }: { label: string }) {
  return (
    <div className="film-frame w-[160px] h-[130px] flex-shrink-0 rounded p-3 flex items-center justify-center overflow-hidden">
      <span className="text-[10px] text-[#A89888] font-mono">{label}</span>
    </div>
  )
}

export default async function Home() {
  const [recentArticles, recentShares, recentTodos] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 8,
      select: { id: true, title: true, slug: true, description: true, publishedAt: true },
    }),
    prisma.shareResource.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, title: true, description: true, link: true, iconName: true, categoryKey: true, createdAt: true },
    }),
    prisma.todo.findMany({
      where: { status: { in: [0, 1] } },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, title: true, description: true, status: true, createdAt: true },
    }),
  ])

  const articleFrames = recentArticles.length === 0
    ? <EmptyFrame label="暂无文章" />
    : recentArticles.map(a => <ArticleFrame key={a.id} article={a} />)

  const articleFramesDup = recentArticles.length === 0
    ? null
    : recentArticles.map(a => <ArticleFrame key={`d-${a.id}`} article={a} />)

  const shareFrames = recentShares.length === 0
    ? <EmptyFrame label="暂无分享" />
    : recentShares.map(s => <ShareFrame key={s.id} share={s} />)

  const shareFramesDup = recentShares.length === 0
    ? null
    : recentShares.map(s => <ShareFrame key={`d-${s.id}`} share={s} />)

  const todoFrames = recentTodos.length === 0
    ? <EmptyFrame label="暂无计划" />
    : recentTodos.map(t => <TodoFrame key={t.id} todo={t} />)

  const todoFramesDup = recentTodos.length === 0
    ? null
    : recentTodos.map(t => <TodoFrame key={`d-${t.id}`} todo={t} />)

  return (
    <div className="flex flex-col gap-10 py-6">
      {/* Intro Section */}
      <section className="flex flex-col gap-4">
        <h1 className="text-[28px] font-bold text-[#2C2520]">Hey，我是 Cbiu</h1>
        <div className="flex flex-wrap items-center gap-2 text-[14px] text-[#5C5147] leading-[1.7]">
          <span>前端开发程序员一枚，常用技术栈：</span>
          <Icon icon="logos:vue" className="h-5 w-5" />
          <Icon icon="logos:react" className="h-5 w-5" />
          <Icon icon="logos:typescript-icon" className="h-5 w-5" />
          <Icon icon="logos:nextjs-icon" className="h-5 w-5" />
          <Icon icon="logos:nestjs" className="h-5 w-5" />
        </div>
        <p className="text-[13px] text-[#8B7E74] leading-[1.7]">
          目前在广州工作生活，正在努力学习现代化前端和探索 AI 带来的可能性。
        </p>
        <div className="flex items-center gap-4 pt-2">
          <a href="https://github.com/wuchib" target="_blank" rel="noreferrer" className="text-[#5C5147] hover:text-[#C4956A] transition-colors"><Icon icon="mdi:github" className="h-[18px] w-[18px]" /></a>
          <a href="https://x.com/ChibiaoW" target="_blank" rel="noreferrer" className="text-[#5C5147] hover:text-[#C4956A] transition-colors"><Icon icon="ri:twitter-x-fill" className="h-[18px] w-[18px]" /></a>
        </div>
      </section>

      {/* Articles Section */}
      <section className="flex flex-col gap-8">
        {recentArticles.length > 0 && <div className="h-[3px] w-[60px] rounded-sm bg-[#D4C8BC]" />}

        {recentArticles.map((article: any, index: number) => (
          <div key={article.id} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-[22px] font-bold text-[#2C2520] hover:text-[#C4956A] transition-colors">
                  {article.title}
                </h2>
              </Link>

              <div className="flex items-center gap-4 text-[12px] text-[#8B7E74]">
                <div className="flex items-center gap-1.5">
                  <Icon icon="lucide:calendar" className="h-[13px] w-[13px]" />
                  <time dateTime={article.publishedAt?.toString() || ""}>
                    {article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : 'Draft'}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon icon="lucide:timer" className="h-[13px] w-[13px]" />
                  <span>7 min</span>
                </div>
              </div>

              {/* Tags Mock */}
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#C4956A]">
                <span>#分享</span>
                <span>#前端</span>
              </div>

              <p className="text-[14px] text-[#5C5147] leading-[1.7] line-clamp-3">
                {article.description || "暂无描述..."}
              </p>
            </div>

            {index < recentArticles.length - 1 && (
              <div className="h-[3px] w-[60px] rounded-sm bg-[#D4C8BC]" />
            )}
          </div>
        ))}
        {recentArticles.length === 0 && (
          <div className="text-[#8B7E74] text-[14px]">目前还没有文章哦~</div>
        )}
      </section>
      <section className="lg:hidden">
        <MobileRightSidebarContent />
      </section>
    </div>
  )
}
