'use client';

import { useActionState, useState } from 'react';
import { createProject, updateProject, fetchRepoInfo } from '@/actions/projects';
import Link from "next/link"
import { Icon } from '@iconify/react';

export default function ProjectForm({ project }: { project?: any }) {
  const initialState = { message: null, errors: {} };
  const updateWithId = project ? updateProject.bind(null, project.id) : createProject;
  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    content: project?.content || '',
    thumbnail: project?.thumbnail || '',
    demoUrl: project?.demoUrl || '',
    githubUrl: project?.githubUrl || '',
    featured: project?.featured || false,
    order: project?.order || 0,
    stars: project?.stars || 0
  });

  const [isFetching, setIsFetching] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug from title if it's a new project (simple logic)
      if (name === 'title' && !project) {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return newData;
    });
  };

  async function handleAutoFill() {
    if (!formData.githubUrl) return;
    setIsFetching(true);
    try {
      const res = await fetchRepoInfo(formData.githubUrl);
      if (res.success && res.data) {
        setFormData(prev => ({
          ...prev,
          title: res.data.title || prev.title,
          slug: !project ? (res.data.title || prev.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug,
          description: res.data.description || prev.description,
          demoUrl: res.data.demoUrl || prev.demoUrl,
          githubUrl: res.data.githubUrl || prev.githubUrl,
          stars: res.data.stars !== undefined ? res.data.stars : prev.stars
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <form action={dispatch} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
          {/* GitHub Auto-Fill */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="githubUrl">GitHub / Gitee URL (Auto Fill Settings)</label>
            <div className="flex gap-2">
              <input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                type="url"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                placeholder="https://github.com/username/repo"
              />
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={isFetching || !formData.githubUrl}
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50 min-w-[100px]"
              >
                {isFetching ? <Icon icon="ph:spinner" className="animate-spin w-4 h-4 mr-2" /> : <Icon icon="ph:magic-wand" className="w-4 h-4 mr-2" />}
                {isFetching ? 'Filling...' : 'Auto Fill'}
              </button>
            </div>
            {state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl}</p>}
            <p className="text-xs text-muted-foreground">Enter a repository URL and click "Auto Fill" to automatically populate Title, Description, Demo URL, and Stars.</p>
          </div>

          <div className="h-px bg-border/50 my-4" />

          {/* Title & Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                value={formData.slug}
                onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
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
              value={formData.content}
              onChange={handleChange}
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
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium">Featured (Show on Home)</label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="order">Sort Order</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="stars">Stars</label>
              <div className="relative">
                <input
                  type="number"
                  id="stars"
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-8"
                />
                <div className="absolute left-2.5 top-2.5 text-muted-foreground">
                  <Icon icon="ph:star-duotone" className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold text-xs text-muted-foreground uppercase">Links</h4>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="demoUrl">Demo URL</label>
              <input
                id="demoUrl"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                type="url"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="https://..."
              />
              {state?.errors?.demoUrl && <p className="text-sm text-destructive">{state.errors.demoUrl}</p>}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <label className="text-sm font-medium" htmlFor="thumbnail">Thumbnail URL</label>
            <input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="/images/projects/..."
            />
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
