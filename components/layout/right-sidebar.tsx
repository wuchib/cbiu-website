import { getArticleHeatmapData } from "@/lib/article-heatmap"
import { MobileRightSidebarContentClient, RightSidebarClient } from "@/components/layout/right-sidebar-client"

export async function MobileRightSidebarContent() {
  const { totalPublishedArticles, weeks } = await getArticleHeatmapData()

  return <MobileRightSidebarContentClient totalPublishedArticles={totalPublishedArticles} weeks={weeks} />
}

export async function RightSidebar() {
  const { totalPublishedArticles, weeks } = await getArticleHeatmapData()

  return <RightSidebarClient totalPublishedArticles={totalPublishedArticles} weeks={weeks} />
}
