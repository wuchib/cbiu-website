import { ArticleList } from "@/components/articles/article-list"
import { getPublicArticles } from "@/actions/articles"

export default async function ArticlesPage() {
  const { data: articles, total, hasMore } = await getPublicArticles(1, 12);

  // @ts-ignore
  return <ArticleList initialArticles={articles} initialHasMore={hasMore} />
}
