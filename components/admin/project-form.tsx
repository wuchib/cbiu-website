'use client';

import { useActionState, useState, useRef } from 'react';
import { createProject, updateProject, fetchRepoInfo } from '@/actions/projects';
import { uploadImage } from '@/actions/upload';
import Link from "next/link"
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

export default function ProjectForm({ project }: { project?: any }) {
  const t = useTranslations('Admin');
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          stars: res.data.stars !== undefined ? res.data.stars : prev.stars,
          // @ts-ignore
          thumbnail: !prev.thumbnail && res.data.thumbnail ? res.data.thumbnail : prev.thumbnail
        }));
      }
    } finally {
      setIsFetching(false);
    }
  }

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setUploadError(null);

    // Client-side validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t('actions.upload.errorSize'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const result = await uploadImage(formDataUpload);

      if (result.url) {
        setFormData(prev => ({ ...prev, thumbnail: result.url }));
      } else {
        setUploadError(result.error || t('actions.upload.errorGeneric'));
      }
    } catch (e) {
      setUploadError(t('actions.upload.errorGeneric'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <form action={dispatch} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {uploadError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Icon icon="ph:warning-circle-duotone" className="w-5 h-5" />
            {uploadError}
            <button type="button" onClick={() => setUploadError(null)} className="ml-auto hover:opacity-70">
              <Icon icon="ph:x" className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* GitHub Auto-Fill Card */}
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2 border-b pb-3 mb-2">
            <Icon icon="ph:github-logo-duotone" className="w-5 h-5 text-primary" />
            {t('projectForm.githubUrl')}
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                type="url"
                className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono placeholder:text-muted-foreground/50"
                placeholder={t('projectForm.githubUrlPlaceholder')}
              />
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={isFetching || !formData.githubUrl}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 min-w-[100px]"
              >
                {isFetching ? <Icon icon="ph:spinner" className="animate-spin w-4 h-4 mr-2" /> : <Icon icon="ph:magic-wand" className="w-4 h-4 mr-2" />}
                {isFetching ? t('actions.filling') : t('actions.autoFill')}
              </button>
            </div>
            {state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl}</p>}
            <p className="text-xs text-muted-foreground">{t('projectForm.githubUrlHint')}</p>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2 border-b pb-3">
            <Icon icon="ph:info-duotone" className="w-5 h-5 text-indigo-500" />
            Basic Information
          </h3>

          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="title">{t('projectForm.title')}</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                placeholder={t('projectForm.titlePlaceholder')}
                required
              />
              {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="slug">{t('projectForm.slug')}</label>
              <input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono placeholder:text-muted-foreground/50"
                placeholder={t('projectForm.slugPlaceholder')}
                required
              />
              {state?.errors?.slug && <p className="text-sm text-destructive">{state.errors.slug}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">{t('projectForm.description')}</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex min-h-[100px] w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed placeholder:text-muted-foreground/50"
              placeholder={t('projectForm.descriptionPlaceholder')}
              required
            />
            {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="content">{t('projectForm.content')}</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="flex min-h-[300px] w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              placeholder={t('projectForm.contentPlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">

        {/* Cover Image Card */}
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon icon="ph:image-duotone" className="w-5 h-5 text-pink-500" />
              {t('projectForm.thumbnail')}
            </h3>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors flex items-center gap-1"
            >
              {isUploading ? <Icon icon="ph:spinner" className="animate-spin" /> : <Icon icon="ph:upload-simple" />}
              Upload
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="relative group">
                <Icon icon="ph:link" className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 pl-10 pr-3 py-1 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-background shadow-sm placeholder:text-muted-foreground/50"
                  placeholder={t('projectForm.thumbnailPlaceholder')}
                />
              </div>

              {/* Image Preview */}
              <div className="aspect-video w-full rounded-xl border-2 border-dashed border-muted/50 bg-muted/10 flex items-center justify-center overflow-hidden relative group">
                {formData.thumbnail ? (
                  <>
                    <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Thumbnail" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                        className="bg-destructive text-white p-2 rounded-full hover:bg-destructive/90 transition-transform hover:scale-105"
                      >
                        <Icon icon="ph:trash" className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Icon icon="ph:image" className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground/50">
                      Click upload or enter URL
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Links */}
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2 border-b pb-3">
            <Icon icon="ph:faders-duotone" className="w-5 h-5 text-orange-500" />
            Settings
          </h3>

          {/* Featured & Order */}
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-background/50">
              <label htmlFor="featured" className="text-sm font-medium cursor-pointer">{t('projectForm.featured')}</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-sm"></div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="order">{t('projectForm.order')}</label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="stars">{t('projectForm.stars')}</label>
              <div className="relative">
                <input
                  type="number"
                  id="stars"
                  name="stars"
                  value={formData.stars}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm pl-9 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <Icon icon="ph:star-duotone" className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="demoUrl">{t('projectForm.demoUrl')}</label>
              <input
                id="demoUrl"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                type="url"
                className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder={t('projectForm.demoUrlPlaceholder')}
              />
              {state?.errors?.demoUrl && <p className="text-sm text-destructive">{state.errors.demoUrl}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Link href="/admin/projects" className="flex-1 inline-flex h-10 items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
            {t('actions.cancel')}
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {isPending ? <Icon icon="ph:spinner" className="animate-spin w-4 h-4 mr-2" /> : <Icon icon="ph:check" className="w-4 h-4 mr-2" />}
            {isPending ? t('actions.saving') : t('actions.save')}
          </button>
        </div>

        {state?.message && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm text-center border border-destructive/20 animate-in fade-in slide-in-from-top-2">
            {state.message}
          </div>
        )}
      </div>
    </form>
  )
}
