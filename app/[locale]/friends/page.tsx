
import { FriendLinksGrid } from "@/components/friend-links-grid"
import { getTranslations } from "next-intl/server"
import { GridPattern } from "@/components/ui/grid-pattern"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Friends' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function FriendsPage() {

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <GridPattern
        width={50}
        height={50}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
          "opacity-50 dark:opacity-30"
        )}
      />

      <div className="container max-w-5xl mx-auto relative z-10">
        <FriendLinksGrid />
      </div>
    </div>
  )
}
