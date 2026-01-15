import ProjectForm from "@/components/admin/project-form"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { getTranslations } from "next-intl/server"
import { cookies } from "next/headers"

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const t = await getTranslations({ locale, namespace: 'Admin' });
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">{t('projectForm.pageTitle')}</h2>
      </div>

      <ProjectForm />
    </div>
  )
}
