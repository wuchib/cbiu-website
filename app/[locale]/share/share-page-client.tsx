'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import * as Motion from '@/components/motion-client';
import { cn } from '@/lib/utils';
import { ShareCategory, ShareResource } from '@prisma/client';

type CategoryWithResources = ShareCategory & {
  resources: (ShareResource & { customData?: any })[];
};

interface SharePageClientProps {
  categories: CategoryWithResources[];
  title: string;
  description: string;
}

export default function SharePageClient({ categories, title, description }: SharePageClientProps) {
  // Filter out categories with no resources
  const visibleCategories = categories.filter(c => c.resources && c.resources.length > 0);

  const [activeCategory, setActiveCategory] = useState<string>(visibleCategories[0]?.key || '');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const t = useTranslations('Share');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better detection

      let current = activeCategory;
      for (const category of visibleCategories) {
        const element = sectionRefs.current[category.key];
        if (element && element.offsetTop <= scrollPosition) {
          current = category.key;
        }
      }

      if (current !== activeCategory) {
        setActiveCategory(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCategories, activeCategory]);

  const scrollToCategory = (key: string) => {
    setActiveCategory(key);
    const element = sectionRefs.current[key];
    if (element) {
      const offset = 100; // Sticky header offset
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4 py-24">
      {/* Background Element */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      <div className="mb-16 space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground mx-auto md:mx-0">{description}</p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-2">
            <h3 className="font-semibold mb-4 px-3 text-sm text-muted-foreground uppercase tracking-wider">Categories</h3>
            <nav className="space-y-1">
              {visibleCategories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => scrollToCategory(category.key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left group",
                    activeCategory === category.key
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                    activeCategory === category.key ? "bg-primary/20" : "bg-muted group-hover:bg-muted/80"
                  )}
                  >
                    {category.icon ? <Icon icon={category.icon} className="w-4 h-4" /> : <Icon icon="ph:hash" className="w-4 h-4" />}
                  </span>
                  <span>{category.name}</span>
                  {activeCategory === category.key && (
                    <Icon icon="ph:caret-right" className="ml-auto w-4 h-4 opacity-50" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-20">
          {visibleCategories.map((category) => {
            return (
              <section
                key={category.key}
                id={category.key}
                ref={(el) => { if (el) sectionRefs.current[category.key] = el }}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("p-2 rounded-lg bg-background border shadow-sm", category.color?.includes('text-') ? category.color.replace('text-', 'bg-').replace('500', '100') : 'bg-primary/10')}>
                    {category.icon && <Icon icon={category.icon} className={cn("w-5 h-5", category.color || "text-primary")} />}
                  </div>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {category.resources.map((resource, i) => (
                    <Motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={resource.link}
                        target="_blank"
                        className="group flex flex-col h-full p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card hover:border-border transition-all hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{resource.title}</h3>
                          <Icon icon="ph:arrow-up-right" className="shrink-0 w-3.5 h-3.5 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </div>

                        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed mb-auto">{resource.description}</p>

                        {resource.customData && Object.keys(resource.customData as object).length > 0 && (
                          <div className="mt-3 pt-2 border-t border-border/50 flex flex-wrap gap-1.5">
                            {Object.entries(resource.customData as object).slice(0, 2).map(([key, value]) => (
                              <span key={key} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-medium uppercase tracking-wider">
                                {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    </Motion.div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  );
}
