'use client';

import { useState } from 'react';
import { CommentWithUser } from '@/actions/comments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';
import { CommentForm } from './comment-form';

interface CommentItemProps {
  comment: CommentWithUser;
  currentUserId?: string;
  isAdmin?: boolean;
  isLoggedIn: boolean;
  onDelete: (commentId: string) => Promise<void>;
  onReply: (parentId: string, content: string) => Promise<void>;
  isDeleting?: boolean;
  depth?: number;
  isRoot?: boolean;
}

const MAX_VISIBLE_DEPTH = 5;

// Helper to count total replies recursively
function countReplies(comment: CommentWithUser): number {
  if (!comment.replies || comment.replies.length === 0) return 0;
  return comment.replies.reduce((sum, reply) => sum + 1 + countReplies(reply), 0);
}

export function CommentItem({
  comment,
  currentUserId,
  isAdmin,
  isLoggedIn,
  onDelete,
  onReply,
  isDeleting,
  depth = 0,
  isRoot = false,
}: CommentItemProps) {
  const t = useTranslations('Comments');
  const locale = useLocale();
  const dateLocale = locale === 'zh' ? zhCN : enUS;
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const canDelete = currentUserId === comment.user.id || isAdmin;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = hasReplies ? countReplies(comment) : 0;

  const handleDelete = async () => {
    if (window.confirm(t('deleteConfirm'))) {
      await onDelete(comment.id);
    }
  };

  const handleReply = async (content: string) => {
    setIsSubmitting(true);
    await onReply(comment.id, content);
    setIsSubmitting(false);
    setShowReplyForm(false);
    // Auto-expand replies after adding one
    setShowReplies(true);
  };

  return (
    <div className={depth > 0 ? 'mt-3' : ''}>
      <div
        className={`group flex gap-3 py-3 ${depth > 0 ? 'pl-4 border-l-2 border-border/50' : 'border-b border-border/50 last:border-b-0'}`}
        style={{ marginLeft: depth > 0 ? `${Math.min(depth * 16, 64)}px` : '0' }}
      >
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.user.image || ''} alt={comment.user.name || ''} />
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-white font-semibold text-xs">
            {comment.user.name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground text-sm">
                {comment.user.name || 'Anonymous'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  <Icon icon="mdi:reply" className="h-3 w-3 mr-1" />
                  {t('reply')}
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Icon icon="mdi:delete-outline" className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <p className="mt-1 text-foreground/90 text-sm whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReply}
                isSubmitting={isSubmitting}
                isReply
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Expand/Collapse button for root comments with replies */}
          {isRoot && hasReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 px-2 text-xs text-primary hover:text-primary/80"
              onClick={() => setShowReplies(!showReplies)}
            >
              <Icon
                icon={showReplies ? "mdi:chevron-up" : "mdi:chevron-down"}
                className="h-4 w-4 mr-1"
              />
              {showReplies
                ? t('hideReplies')
                : t('showReplies', { count: replyCount })
              }
            </Button>
          )}
        </div>
      </div>

      {/* Nested Replies - only show if expanded (for root) or always for nested */}
      {hasReplies && (isRoot ? showReplies : true) && (
        <div className="replies">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              isLoggedIn={isLoggedIn}
              onDelete={onDelete}
              onReply={onReply}
              isDeleting={isDeleting}
              depth={depth + 1}
              isRoot={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
