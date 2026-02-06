'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  isReply?: boolean;
  onCancel?: () => void;
}

interface EmojiData {
  native: string;
}

export function CommentForm({ onSubmit, isSubmitting, isReply, onCancel }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations('Comments');

  // 点击外部关闭 emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content.trim());
    setContent('');
  };

  const handleEmojiSelect = (emoji: EmojiData) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji.native + content.slice(end);
      setContent(newContent);

      // 恢复光标位置
      setTimeout(() => {
        textarea.focus();
        const newPos = start + emoji.native.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    } else {
      setContent(content + emoji.native);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isReply ? t('replyPlaceholder') : t('placeholder')}
        className={`w-full px-3 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${isReply ? 'min-h-[80px] text-sm' : 'min-h-[100px]'
          }`}
        disabled={isSubmitting}
        maxLength={2000}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Emoji Picker Button */}
          <div className="relative" ref={emojiPickerRef}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isSubmitting}
              className="h-8 w-8 p-0"
            >
              <Icon icon="ph:smiley" className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="auto"
                  previewPosition="none"
                  skinTonePosition="none"
                  maxFrequentRows={2}
                  perLine={8}
                />
              </div>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            {content.length}/2000
          </span>
        </div>

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
