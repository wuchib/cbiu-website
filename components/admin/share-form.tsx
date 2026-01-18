'use client';

import { useActionState, useState, useEffect } from 'react';
import { createShareResource, updateShareResource, fetchRepoInfo } from '@/actions/share';
import Link from "next/link"
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
  categories: (Category & { fieldsSchema?: any })[],
  resource?: any
}) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const initialState = { message: null, errors: {} };
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (prevState: any, formData: FormData) => {
    const plainData = {
      title: formData.get('title'),
      description: formData.get('description'),
      link: formData.get('link'),
      categoryKey: formData.get('categoryKey'),
      // iconName is no longer collected, passing null or undefined is fine handled by backend optional
      customData: formData.get('customData') ? JSON.parse(formData.get('customData') as string) : {}
    }

    if (resource) {
      return await updateShareResource(resource.id, plainData)
    } else {
      return await createShareResource(plainData)
    }
  }

  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(handleSubmit, initialState);

  useEffect(() => {
    if ((state as any)?.success) {
      toast.success(t('actions.saved'));
      router.push('/admin/share');
    }
  }, [state, router, t]);

  const [formData, setFormData] = useState({
    title: resource?.title || '',
    description: resource?.description || '',
    link: resource?.link || '',
    categoryKey: resource?.categoryKey || '',
    customData: resource?.customData || {} as Record<string, any>
  });

  const selectedCategory = categories.find(c => c.key === formData.categoryKey);
  const dynamicFields = (selectedCategory?.fieldsSchema as any[]) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomDataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customData: {
        ...prev.customData,
        [key]: value
      }
    }))
  }

  const handleAutoFill = async () => {
    if (!formData.link) return;
    setIsFetching(true);
    try {
      const res = await fetchRepoInfo(formData.link);
      if (res.success && res.data) {
        setFormData(prev => ({
          ...prev,
          title: res.data.title || prev.title,
          description: res.data.description || prev.description,
          // We decided not to use iconName anymore, but if we wanted to auto-fill it to customData or somewhere else we could.
          // For now just title and description.
        }));
        toast.success(t('actions.autoFillSuccess'));
      } else {
        toast.error(t('actions.fetchError'));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('actions.fetchError'));
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl">
      <input type="hidden" name="customData" value={JSON.stringify(formData.customData)} />

      <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">

        {/* Category - First explicitly */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="categoryKey">{t('shareForm.category')}</label>
          <select
            id="categoryKey"
            name="categoryKey"
            value={formData.categoryKey}
            onChange={handleChange}
            required
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>{t('shareForm.selectCategory')}</option>
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>{cat.name}</option>
            ))}
          </select>
          {(state as any)?.errors?.categoryKey && (
            <p className="text-sm text-destructive">{(state as any).errors.categoryKey}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Link */}
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
                placeholder={t('shareForm.urlPlaceholder')}
              />
              <button
                type="button"
                onClick={handleAutoFill}
                disabled={isFetching || !formData.link}
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                title={t('actions.autoFill')}
              >
                {isFetching ? <Icon icon="ph:spinner" className="animate-spin w-4 h-4" /> : <Icon icon="ph:magic-wand" className="w-4 h-4" />}
              </button>
            </div>
            {(state as any)?.errors?.link && (
              <p className="text-sm text-destructive">{(state as any).errors.link}</p>
            )}
          </div>
          {/* Description can share the row or be below, let's keep it structurally simple */}
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
            placeholder={t('shareForm.titlePlaceholder')}
          />
          {(state as any)?.errors?.title && (
            <p className="text-sm text-destructive">{(state as any).errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">{t('shareForm.description')}</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            placeholder={t('shareForm.descriptionPlaceholder')}
          />
          {(state as any)?.errors?.description && (
            <p className="text-sm text-destructive">{(state as any).errors.description}</p>
          )}
        </div>

        {/* Dynamic Fields Area */}
        {dynamicFields.length > 0 && (
          <div className="pt-4 border-t space-y-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              {selectedCategory?.name} Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.customData[field.key] || ''}
                      onChange={e => handleCustomDataChange(field.key, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {(field.options || []).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={field.placeholder}
                      value={formData.customData[field.key] || ''}
                      onChange={e => handleCustomDataChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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

