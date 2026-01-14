'use client';

import { useActionState } from 'react';
import { createProject, updateProject } from '@/actions/projects';
import Link from "next/link"

export default function ProjectForm({ project }: { project?: any }) {
  const initialState = { message: null, errors: {} };
  const updateWithId = project ? updateProject.bind(null, project.id) : createProject;
  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  return (
    <form action={dispatch} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          {/* Title & Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                defaultValue={project?.title}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="Project Name"
                required
              />
              {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                defaultValue={project?.slug}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="project-slug"
                required
              />
              {state?.errors?.slug && <p className="text-sm text-destructive">{state.errors.slug}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={project?.description}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="Short description for the card..."
              required
            />
            {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">Case Study Content (Markdown, Optional)</label>
            <textarea
              id="content"
              name="content"
              defaultValue={project?.content}
              className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background"
              placeholder="# Detailed case study..."
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          {/* Featured & Order */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="featured" name="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="featured" className="text-sm font-medium">Featured (Show on Home)</label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="order">Sort Order</label>
              <input
                type="number"
                id="order"
                name="order"
                defaultValue={project?.order || 0}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold text-xs text-muted-foreground uppercase">Links</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="demoUrl">Demo URL</label>
              <input id="demoUrl" name="demoUrl" defaultValue={project?.demoUrl} type="url" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://..." />
              {state?.errors?.demoUrl && <p className="text-sm text-destructive">{state.errors.demoUrl}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="githubUrl">GitHub URL</label>
              <input id="githubUrl" name="githubUrl" defaultValue={project?.githubUrl} type="url" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://github.com/..." />
              {state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl}</p>}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <label className="text-sm font-medium" htmlFor="thumbnail">Thumbnail URL</label>
            <input id="thumbnail" name="thumbnail" defaultValue={project?.thumbnail} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="/images/projects/..." />
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/admin/projects" className="flex-1 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isPending ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
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
