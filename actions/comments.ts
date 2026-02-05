'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment is too long'),
  articleId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
});

export type CommentWithUser = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: CommentWithUser[];
};

/**
 * Get all comments for an article (structured as tree)
 */
export async function getCommentsByArticleId(articleId: string): Promise<CommentWithUser[]> {
  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // Build tree structure
  const commentMap = new Map<string, CommentWithUser>();
  const rootComments: CommentWithUser[] = [];

  // First pass: create all comment objects with empty replies array
  for (const comment of comments) {
    commentMap.set(comment.id, {
      ...comment,
      replies: [],
    });
  }

  // Second pass: build the tree
  for (const comment of comments) {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies!.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  }

  // Sort root comments by newest first
  rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return rootComments;
}

/**
 * Create a new comment or reply
 */
export async function createComment(articleId: string, content: string, parentId?: string) {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: 'You must be logged in to comment' };
  }

  // Look up user by email to ensure we have valid database user ID
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!dbUser) {
    return { error: 'User not found in database' };
  }

  const validation = commentSchema.safeParse({ content, articleId, parentId });

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Invalid input' };
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: validation.data.content,
        articleId: validation.data.articleId,
        userId: dbUser.id,
        parentId: validation.data.parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/articles`);
    return { success: true, comment: { ...comment, replies: [] } as CommentWithUser };
  } catch (error) {
    console.error('Failed to create comment:', error);
    return { error: 'Failed to create comment' };
  }
}

/**
 * Delete a comment (only author or admin can delete)
 * Will also delete all nested replies due to cascade
 */
export async function deleteComment(commentId: string) {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: 'You must be logged in to delete a comment' };
  }

  // Look up user by email to get database user ID
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!dbUser) {
    return { error: 'User not found in database' };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return { error: 'Comment not found' };
    }

    // Check if user is the author or an admin
    const isAuthor = comment.userId === dbUser.id;
    const isAdmin = session.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return { error: 'You do not have permission to delete this comment' };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath(`/articles`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return { error: 'Failed to delete comment' };
  }
}
