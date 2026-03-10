'use client';

import { Icon } from '@iconify/react';
import { Link } from '@/i18n/routing';
import * as Motion from '@/components/motion-client';
import { ShareResource, Prisma } from '@prisma/client';

type ResourceWithCustomData = ShareResource & { customData?: Prisma.JsonValue };

interface SharePageClientProps {
  resources: ResourceWithCustomData[];
}

export default function SharePageClient({ resources }: SharePageClientProps) {
  return (
    <div className="container relative mx-auto min-h-screen max-w-5xl px-4">
      {/* Background Element */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[100px] rounded-full opacity-50 pointer-events-none" />

      {/* Content Area - Single Column layout like projects */}
      <div className="flex flex-col gap-16 mt-8">
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[4px]">
            {resources.map((resource, i) => (
              <Motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative flex flex-col bg-card border rounded-md"
              >
                <div className="relative z-10 flex flex-col h-full p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="line-clamp-1 text-base font-medium tracking-tight group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground mt-1">
                        {resource.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={resource.link} target="_blank" title="Visit">
                        <span className="flex items-center justify-center h-7 w-7 rounded-none cursor-pointer bg-muted/40 hover:bg-muted/60 transition-colors duration-300">
                          <Icon icon="ph:arrow-up-right-bold" className="w-3 h-3" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                    {resource.customData && Object.keys(resource.customData as object).length > 0 && (
                      Object.entries(resource.customData as object).slice(0, 2).map(([key, value]) => (
                        <span key={key} className="inline-flex items-center rounded-none px-1.5 py-0 text-[10px] font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary/40 hover:bg-secondary/60 text-muted-foreground/80">
                          {String(value)}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </Motion.div>
            ))}

            {resources.length % 2 !== 0 && (
              <div className="hidden md:block bg-card w-full h-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
