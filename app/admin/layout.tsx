import Link from "next/link"
import { Icon } from "@iconify/react"
import { logout } from "@/actions/auth"
import { ThemeProvider } from "@/components/theme-provider"
import "../globals.css"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"

import { cookies } from 'next/headers'
import { AdminLanguageSwitcher } from "@/components/admin/language-switcher"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'Admin' });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen bg-muted/20">
              {/* Sidebar */}
              <aside className="w-64 border-r bg-background flex flex-col">
                <div className="h-16 flex items-center px-6 border-b">
                  <Link href="/" className="font-bold text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <span className="font-bold">C</span>
                    </div>
                    <span>{t('title')}</span>
                  </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <NavLink href="/admin" icon="ph:gauge" label={t('dashboardNav')} />
                  <div className="pt-4 pb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('content')}</div>
                  <NavLink href="/admin/share" icon="ph:share-network" label={t('share')} />
                  <NavLink href="/admin/articles" icon="ph:article" label={t('articles')} />
                  <NavLink href="/admin/projects" icon="ph:projector-screen" label={t('projects')} />
                  <div className="pt-4 pb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('settings')}</div>
                  <NavLink href="/admin/settings" icon="ph:gear" label={t('globalSettings')} />
                </nav>

                <div className="p-4 border-t">
                  <form action={logout}>
                    <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                      <Icon icon="ph:sign-out" className="w-5 h-5" />
                      {t('logout')}
                    </button>
                  </form>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b bg-background flex items-center px-8 sticky top-0 z-10 justify-between">
                  {/* Dynamic Title based on route? For now simple Dashboard or t('dashboard') */}
                  <h1 className="font-semibold text-lg">{t('dashboardNav')}</h1>
                  <div className="flex items-center gap-4">
                    <AdminLanguageSwitcher />
                    <div className="text-sm text-muted-foreground">{t('welcome')}</div>
                  </div>
                </header>
                {children}
              </main>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <Icon icon={icon} className="w-5 h-5" />
      {label}
    </Link>
  )
}
