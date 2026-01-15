'use client';

import { useActionState, useState } from 'react';
import { createShareResource, updateShareResource, fetchRepoInfo } from '@/actions/share';
import Link from "next/link"
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Admin');
  const initialState = { message: null, errors: {} };
  const updateWithId = resource ? updateShareResource.bind(null, resource.id) : createShareResource;
  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    link: resource?.link || '',
    categoryKey: resource?.categoryKey || '',
    iconName: resource?.iconName || ''
  });

  const [isFetching, setIsFetching] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleAutoFill() {
    if (!formData.link) return;
    setIsFetching(true);
    try {
      const res = await fetchRepoInfo(formData.link);
      if (res.success && res.data) {
        setFormData(prev => ({
          ...prev,
          title: res.data.title || prev.title,
          description: res.data.description || prev.description,
          iconName: res.data.iconName || prev.iconName
        }));
      } else {
        // Optional: Show toast or error
        console.warn(res.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl">
      <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">

        {/* Link - Moved to top for Auto-Fill workflow */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="link">{t('shareForm.url')}</label>
          <div className="flex gap-2">
            <input
              id="link"
              name="link"
              type="url"
              value={formData.link}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://github.com/owner/repo"
            />
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={isFetching || !formData.link}
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {isFetching ? <Icon icon="ph:spinner" className="animate-spin w-4 h-4" /> : <Icon icon="ph:magic-wand" className="w-4 h-4 mr-2" />}
              {isFetching ? ' ' : t('actions.autoFill')}
            </button>
          </div>
          {state?.errors?.link && (
            <p className="text-sm text-destructive">{state.errors.link}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">{t('shareForm.title')}</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
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
          <label className="text-sm font-medium" htmlFor="description">{t('shareForm.description')}</label>
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="A utility-first CSS framework..."
          />
          {state?.errors?.description && (
            <p className="text-sm text-destructive">{state.errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="categoryKey">{t('shareForm.category')}</label>
            <select
              id="categoryKey"
              name="categoryKey"
              value={formData.categoryKey}
              onChange={handleChange}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>{t('shareForm.selectCategory')}</option>
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
            <label className="text-sm font-medium" htmlFor="iconName">{t('shareForm.iconName')}</label>
            <div className="flex gap-2">
              <input
                id="iconName"
                name="iconName"
                value={formData.iconName}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="ph:wrench-duotone"
              />
              {formData.iconName && (
                <div className="flex items-center justify-center p-2 rounded-md border bg-muted w-10 shrink-0">
                  <Icon icon={formData.iconName} className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/admin/share" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
          {t('actions.cancel')}
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? t('actions.saving') : t('actions.save')}
        </button>
      </div>
    </form>
  )
}
