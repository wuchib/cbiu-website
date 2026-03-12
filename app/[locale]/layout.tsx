import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { DynamicIsland } from "@/components/layout/dynamic-island";
import { Toaster } from "@/components/ui/sonner";
import { VisitorTracker } from "@/components/visitor-tracker";
import "../globals.css";

import { getGlobalSettings } from "@/actions/settings";
import localFont from "next/font/local";

// 引入全局定制字体
const cangErJinKai = localFont({
  src: "../../public/fonts/CangErJinKai.ttf",
  variable: "--font-article-canger",
  display: "swap",
});

const jetBrainsMono = localFont({
  src: "../../public/fonts/JetBrainsMono-Regular.ttf",
  variable: "--font-article-jetbrains",
  display: "swap",
});

// Generate static params for static export if needed, 
// though we usually rely on middleware for matching.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Fetch global settings
  const settings = await getGlobalSettings();
  const pageWidth = settings?.pageWidth || "1200";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${cangErJinKai.variable} ${jetBrainsMono.variable} min-h-screen bg-[#F3EBE1] font-sans antialiased text-[#2C2520]`}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <VisitorTracker />
              <div
                className="relative mx-auto flex min-h-screen w-full"
                style={{ maxWidth: `${pageWidth}px` }}
              >
                <LeftSidebar />
                <main className="flex-1 flex flex-col min-h-screen w-full">
                  <header className="sticky top-0 z-40 w-full bg-[#F3EBE1]/60 backdrop-blur-md">
                    <DynamicIsland />
                  </header>
                  <div className="flex-1 w-full px-4 md:px-8">
                    {children}
                  </div>
                </main>
                <RightSidebar />
              </div>
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
