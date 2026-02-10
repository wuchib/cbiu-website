
import { FriendLinksGrid } from "@/components/friend-links-grid"
import { getTranslations } from "next-intl/server"
import { GridPattern } from "@/components/ui/grid-pattern"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Friends' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function FriendsPage() {
  const t = await getTranslations('Friends')

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

      <div className="container max-w-5xl mx-auto py-32 relative z-10">


        <FriendLinksGrid />
      </div>
    </div>
  )
}
