'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  isReply?: boolean;
  onCancel?: () => void;
}

export function CommentForm({ onSubmit, isSubmitting, isReply, onCancel }: CommentFormProps) {
  const [content, setContent] = useState('');
  const t = useTranslations('Comments');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isReply ? t('replyPlaceholder') : t('placeholder')}
        className={`w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${isReply ? 'min-h-[80px] text-sm' : 'min-h-[100px]'
          }`}
        disabled={isSubmitting}
        maxLength={2000}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/2000
        </span>
        <div className="flex items-center gap-2">
          {isReply && onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t('cancelReply')}
            </Button>
          )}
          <Button
            type="submit"
            size={isReply ? 'sm' : 'default'}
            disabled={!content.trim() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                {t('submitting')}
              </>
            ) : (
              <>
                <Icon icon="mdi:send" className="h-4 w-4" />
                {t('submit')}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
