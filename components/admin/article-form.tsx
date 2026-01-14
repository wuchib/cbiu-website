'use client';

import { useActionState } from 'react';
import { createArticle, updateArticle } from '@/actions/articles';
import Link from "next/link"

export default function ArticleForm({ article }: { article?: any }) {
  const initialState = { message: '', errors: {} };
  const updateWithId = article ? updateArticle.bind(null, article.id) : createArticle;
  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!article) { // Only auto-generate for new articles
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const slugInput = document.getElementById('slug') as HTMLInputElement;
      if (slugInput) slugInput.value = slug;
    }
  }

  return (
    <form action={dispatch} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content (Left, 2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              defaultValue={article?.title}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Article Title..."
              required
              onChange={handleTitleChange}
            />
            {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="slug">Slug (URL friendly)</label>
            <div className="flex items-center rounded-md border border-input bg-muted/50 px-3">
              <span className="text-sm text-muted-foreground mr-2">/articles/</span>
              <input
                id="slug"
                name="slug"
                defaultValue={article?.slug}
                className="flex h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="my-awesome-post"
                required
              />
            </div>
            {state?.errors?.slug && <p className="text-sm text-destructive">{state.errors.slug}</p>}
          </div>

          {/* Content (Textarea for now, Markdown Editor later) */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">Content (Markdown)</label>
            <textarea
              id="content"
              name="content"
              defaultValue={article?.content}
              className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="# Writes something amazing..."
              required
            />
            {state?.errors?.content && <p className="text-sm text-destructive">{state.errors.content}</p>}
          </div>
        </div>
      </div>

      {/* Sidebar (Right, 1 col) */}
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Publishing</h3>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="published" name="published" defaultChecked={article?.published} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
          </div>

          {/* Description / Excerpt */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">Description (SEO)</label>
            <textarea
              id="description"
              name="description"
              defaultValue={article?.description}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Short summary..."
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="coverImage">Cover Image URL</label>
            <input
              id="coverImage"
              name="coverImage"
              defaultValue={article?.coverImage}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/admin/articles" className="flex-1 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isPending ? 'Saving...' : (article ? 'Update Article' : 'Create Article')}
          </button>
        </div>

        {state?.message && (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm text-center">
            {state.message}
          </div>
        )}
      </div>
    </form>
  )
}
