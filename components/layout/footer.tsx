import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("Footer")
  return (
    <footer className="py-4 bg-background relative z-50">
      <div className="container flex flex-col items-center justify-center gap-1">
        <p className="text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Cbiu. {t("rights")}
        </p>
        <p className="text-center text-xs text-muted-foreground/60">
          粤ICP备2026011005号-1
        </p>
      </div>
    </footer>
  )
}
