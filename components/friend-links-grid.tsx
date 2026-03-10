import { getFriendLinks } from "@/actions/friend-link"
import { getTranslations } from "next-intl/server"

export async function FriendLinksGrid() {
  const { data: links } = await getFriendLinks()
  const t = await getTranslations('Common')

  if (!links || links.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {links.map((link: any) => (
        <a
          key={link.id}
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col items-center p-4 space-y-4 rounded-md border bg-card text-card-foreground transition-all hover:-translate-y-1 block"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border group-hover:border-primary transition-colors">
            {link.avatar ? (
              <img
                src={link.avatar}
                alt={link.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-2xl font-bold text-muted-foreground">
                  {link.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-semibold tracking-tight">{link.name}</h3>
            {link.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {link.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
