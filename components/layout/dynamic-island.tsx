"use client"

import * as React from "react"
import { usePathname } from "@/i18n/routing"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useSyncExternalStore } from "react"
import { articleStore } from "@/lib/article-store"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { ReadingProgress } from "@/components/articles/reading-progress"

const routeConfig: Record<string, { icon: string, desc: string, key: string }> = {
  '/': { icon: 'lucide:home', desc: '欢迎来到我的个人空间', key: 'home' },
  '/articles': { icon: 'lucide:pen-line', desc: '记录与分享我的思考', key: 'articles' },
  '/projects': { icon: 'lucide:folder-open', desc: '我的一些开源与有趣项目', key: 'projects' },
  '/share': { icon: 'lucide:share-2', desc: '好用的工具和资源分享', key: 'share' },
  '/todo': { icon: 'lucide:check-square', desc: '待办事项与进度追踪', key: 'todo' },
  '/friends': { icon: 'lucide:users', desc: '与我相连的精彩小站', key: 'friends' },
  '/about': { icon: 'lucide:user', desc: '关于我的一些信息', key: 'about' }
}

export function DynamicIsland() {
  const pathname = usePathname()
  const t = useTranslations("Navigation")
  const [isExpanded, setIsExpanded] = React.useState(false)

  const isFirstRender = React.useRef(true)

  const articleContent = useSyncExternalStore(articleStore.subscribe, articleStore.getSnapshot, articleStore.getServerSnapshot)
  const isArticleDetail = pathname.startsWith('/articles/') && pathname !== '/articles'

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setIsExpanded(true)
    const timer = setTimeout(() => {
      setIsExpanded(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [pathname])

  const getRouteInfo = (path: string) => {
    if (path === '/') return routeConfig['/']
    const matched = Object.keys(routeConfig).find(key => key !== '/' && path.startsWith(key))
    if (matched) return routeConfig[matched]
    return null
  }

  const currentInfo = getRouteInfo(pathname || '/')

  if (!currentInfo) return null

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
  } as const

  // 灵动岛外层容器 A
  return (
    <div className="sticky top-0 h-16 z-50 flex justify-center w-full pointer-events-none">
      <div
        className={cn(
          "flex items-center w-full transition-all duration-300 ease-in-out pointer-events-auto",
          "bg-[#F3EBE1]/60 backdrop-blur-md",
          // 如果不是文章页，这个容器 A 收缩到和内部灵动岛一样宽，实现紧凑包裹；
          // 如果是文章页或者处于扩大状态，容器A占满 100% 宽度
          "max-w-full"
        )}
      >
        {/* 左侧：返回按钮容器 */}
        <motion.div
          layout
          initial={false}
          animate={{
            opacity: (isArticleDetail && !isExpanded) ? 1 : 0,
          }}
          style={{
            width: (isArticleDetail && !isExpanded) ? 200 : 0,
            paddingLeft: (isArticleDetail && !isExpanded) ? 12 : 0
          }}
          transition={springTransition}
          className="flex items-center overflow-hidden"
        >
          <Link href="/articles" className="inline-flex items-center gap-2 text-[13px] text-[#8B7E74] hover:text-[#C4956A] transition-colors leading-none whitespace-nowrap">
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
        </motion.div>

        {/* 中间：灵动岛核心 */}
        <motion.div
          layout
          initial={false}
          style={{
            flexGrow: isExpanded ? 1 : 0,
            width: isExpanded ? "auto" : 120,
            height: 24,
            borderRadius: 12,
          }}
          transition={springTransition}
          className={cn(
            "bg-[#2C2520] text-[#F3EBE1] shadow-xl flex items-center overflow-hidden cursor-default pointer-events-auto origin-center",
            "border border-[#4A3F35]/30 mx-auto",
            isExpanded ? "mx-0" : "mx-auto" // 当放大时紧贴左右，不放大时居中
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex items-center justify-between gap-4 px-4 w-full h-full"
              >
                <div className="flex items-center gap-2">
                  <Icon icon={currentInfo.icon} className="w-3.5 h-3.5 text-[#D4A574]" />
                  <span className="text-[11px] font-bold truncate tracking-wider">
                    {t(currentInfo.key)}
                  </span>
                </div>
                <span className="text-[11px] text-[#A89888] truncate">
                  {currentInfo.desc}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-1.5 px-3 w-full h-full"
              >
                <Icon icon={currentInfo.icon} className="w-3.5 h-3.5 text-[#C4956A]" />
                <span className="text-[11px] font-medium tracking-wider">{t(currentInfo.key)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 右侧：阅读进度容器 */}
        <motion.div
          layout
          initial={false}
          animate={{
            opacity: (isArticleDetail && !isExpanded) ? 1 : 0,
          }}
          style={{
            width: (isArticleDetail && !isExpanded) ? 250 : 0,
            paddingRight: (isArticleDetail && !isExpanded) ? 12 : 0
          }}
          transition={springTransition}
          className="flex items-center justify-end overflow-hidden"
        >
          <div className="whitespace-nowrap flex items-center">
            {articleContent && <ReadingProgress content={articleContent} />}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
