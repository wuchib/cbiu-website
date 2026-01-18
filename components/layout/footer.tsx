import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("Footer")
  return (
    <footer className="py-4 bg-background relative z-50">
      <div className="container flex items-center justify-center">
        <p className="text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Cbiu. {t("rights")}
        </p>
      </div>
    </footer>
  )
}
