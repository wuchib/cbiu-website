'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { CommentWithUser, getCommentsByArticleId, createComment, deleteComment } from '@/actions/comments';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

const COMMENTS_PER_PAGE = 10;

interface CommentSectionProps {
  articleId: string;
  initialComments?: CommentWithUser[];
}

export function CommentSection({ articleId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const t = useTranslations('Comments');

  // Fetch comments on mount if not provided
  useEffect(() => {
    if (initialComments.length === 0) {
      startTransition(async () => {
        const fetchedComments = await getCommentsByArticleId(articleId);
        setComments(fetchedComments);
      });
    }
  }, [articleId, initialComments.length]);

  // Helper function to add a reply to the correct place in the tree
  const addReplyToTree = (
    comments: CommentWithUser[],
    parentId: string,
    newReply: CommentWithUser
  ): CommentWithUser[] => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToTree(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  // Helper function to remove a comment from the tree
  const removeFromTree = (
    comments: CommentWithUser[],
    commentId: string
  ): CommentWithUser[] => {
    return comments
      .filter((comment) => comment.id !== commentId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies ? removeFromTree(comment.replies, commentId) : [],
      }));
  };

  // Count total comments including replies
  const countComments = (comments: CommentWithUser[]): number => {
    return comments.reduce((count, comment) => {
      return count + 1 + (comment.replies ? countComments(comment.replies) : 0);
    }, 0);
  };

  const handleSubmit = async (content: string) => {
    startTransition(async () => {
      const result = await createComment(articleId, content);
      if (result.success && result.comment) {
        setComments((prev) => [result.comment as CommentWithUser, ...prev]);
      }
    });
  };

  const handleReply = async (parentId: string, content: string) => {
    const result = await createComment(articleId, content, parentId);
    if (result.success && result.comment) {
      setComments((prev) => addReplyToTree(prev, parentId, result.comment as CommentWithUser));
    }
  };

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    const result = await deleteComment(commentId);
    if (result.success) {
      setComments((prev) => removeFromTree(prev, commentId));
    }
    setDeletingId(null);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + COMMENTS_PER_PAGE);
  };

  const isLoggedIn = status === 'authenticated' && session?.user;
  const isAdmin = session?.user?.role === 'admin';
  const totalComments = countComments(comments);
  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = comments.length > visibleCount;
  const remainingCount = comments.length - visibleCount;

  return (
    <section className="mt-16 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Icon icon="mdi:comment-outline" className="h-6 w-6" />
        {t('title')}
        <span className="text-base font-normal text-muted-foreground">
          ({totalComments})
        </span>
      </h2>

      {/* Comment Form or Login Prompt */}
      <div className="mb-8">
        {isLoggedIn ? (
          <CommentForm onSubmit={handleSubmit} isSubmitting={isPending} />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-border bg-muted/30">
            <Icon icon="mdi:login" className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">{t('loginRequired')}</p>
            <Button
              onClick={() => signIn('google')}
              variant="outline"
              className="gap-2"
            >
              <Icon icon="mdi:google" className="h-4 w-4" />
              {t('loginButton')}
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-0">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon icon="mdi:comment-off-outline" className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{t('noComments')}</p>
          </div>
        ) : (
          <>
            {visibleComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={session?.user?.id}
                isAdmin={isAdmin}
                isLoggedIn={!!isLoggedIn}
                onDelete={handleDelete}
                onReply={handleReply}
                isDeleting={deletingId === comment.id}
                isRoot={true}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-6 pb-2">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="gap-2"
                >
                  <Icon icon="mdi:chevron-down" className="h-4 w-4" />
                  {t('loadMore', { count: Math.min(remainingCount, COMMENTS_PER_PAGE) })}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
