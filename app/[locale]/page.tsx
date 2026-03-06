import { Link } from "@/i18n/routing"
import { Icon } from "@iconify/react"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const recentArticles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      publishedAt: true,
    }
  })

  return (
    <div className="flex flex-col gap-12 py-6">
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
    </div>
  )
}
