'use client';

import { useActionState } from 'react';
import { createShareResource, updateShareResource } from '@/actions/share';
import Link from "next/link"
import { Icon } from '@iconify/react';

// Simplified type for categories passed from server
type Category = {
  key: string;
  name: string;
}

export default function ShareForm({
  categories,
  resource
}: {
  categories: Category[],
  resource?: any
}) {
  const initialState = { message: null, errors: {} };
  const updateWithId = resource ? updateShareResource.bind(null, resource.id) : createShareResource;
  // @ts-ignore - useActionState types can be tricky
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl">
      <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            defaultValue={resource?.title}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="e.g. Tailwind CSS"
            aria-describedby="title-error"
          />
          {state?.errors?.title && (
            <p id="title-error" className="text-sm text-destructive">{state.errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">Description (Short)</label>
          <input
            id="description"
            name="description"
            defaultValue={resource?.description}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="A utility-first CSS framework..."
          />
          {state?.errors?.description && (
            <p className="text-sm text-destructive">{state.errors.description}</p>
          )}
        </div>

        {/* Link */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="link">URL</label>
          <input
            id="link"
            name="link"
            type="url"
            defaultValue={resource?.link}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="https://..."
          />
          {state?.errors?.link && (
            <p className="text-sm text-destructive">{state.errors.link}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="categoryKey">Category</label>
            <select
              id="categoryKey"
              name="categoryKey"
              defaultValue={resource?.categoryKey || ""}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>{cat.name}</option>
              ))}
            </select>
            {state?.errors?.categoryKey && (
              <p className="text-sm text-destructive">{state.errors.categoryKey}</p>
            )}
          </div>

          {/* Icon Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="iconName">Iconify Name (Optional)</label>
            <input
              id="iconName"
              name="iconName"
              defaultValue={resource?.iconName || ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="ph:wrench-duotone"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/admin/share" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Resource'}
        </button>
      </div>
    </form>
  )
}
