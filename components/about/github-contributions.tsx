'use client';

import { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from 'next-themes';

interface GitHubContributionsProps {
  username: string;
}

export function GitHubContributions({ username }: GitHubContributionsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 等待客户端挂载后再渲染，避免 hydration 不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 返回占位符避免布局抖动
    return (
      <div className="flex justify-center py-2">
        <div className="h-[128px] w-full max-w-[844px] animate-pulse rounded bg-muted/50" />
      </div>
    );
  }

  return (
    <div className="flex justify-center overflow-x-auto py-2">
      <GitHubCalendar
        username={username}
        colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        fontSize={12}
        blockSize={12}
        blockMargin={4}
        showColorLegend={false}
      />
    </div>
  );
}
