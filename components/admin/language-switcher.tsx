'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

export function AdminLanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  // Read initial locale from cookie
  useEffect(() => {
    const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
    if (match) {
      setLocale(match[2]);
    }
  }, []);

  const handleSwitch = (newLocale: string) => {
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(newLocale);
    router.refresh(); // Refresh server components
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleSwitch('en')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
      >
        EN
      </button>
      <span className="text-muted-foreground/30">|</span>
      <button
        onClick={() => handleSwitch('zh')}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${locale === 'zh'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
      >
        中文
      </button>
    </div>
  );
}
