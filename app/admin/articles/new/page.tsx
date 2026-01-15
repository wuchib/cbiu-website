import ArticleForm from "@/components/admin/article-form"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"

export default async function NewArticlePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const t = await getTranslations({ locale, namespace: 'Admin' });
  return <ArticleForm />
}
