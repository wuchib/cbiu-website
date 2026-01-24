'use client'

import { useState } from 'react'
import { ArticleCategory } from '@prisma/client'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { createArticleCategory, updateArticleCategory, deleteArticleCategory } from '@/actions/article-categories'

interface CategoryManagerProps {
  categories: (ArticleCategory & { _count: { articles: number } })[]
}

export default function CategoryManager({ categories }: CategoryManagerProps) {
  const t = useTranslations('Admin')
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<ArticleCategory>>({})
  const [loading, setLoading] = useState(false)

  const handleEdit = (category: ArticleCategory) => {
    setCurrentCategory(category)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setCurrentCategory({
      name: '',
      slug: '',
      description: '',
      color: '',
      sortOrder: 0
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete.category'))) return

    setLoading(true)
    const res = await deleteArticleCategory(id)
    setLoading(false)

    if (res.error) {
      alert(res.error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!currentCategory.name || !currentCategory.slug) {
      alert('Name and Slug are required')
      setLoading(false)
      return
    }

    const existing = categories.find(c => c.id === currentCategory.id)

    let res
    if (existing && currentCategory.id) {
      res = await updateArticleCategory(currentCategory.id, currentCategory)
    } else {
      res = await createArticleCategory(currentCategory)
    }

    setLoading(false)

    if (res.error) {
      alert(res.error)
    } else {
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold">
            {currentCategory.id ? t('actions.edit') : t('actions.new')} {t('articleCategories')}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
            <Icon icon="ph:x" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('categoryForm.name')}</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.name || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                placeholder="e.g. Technology"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('categoryForm.slug')}</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.slug || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                placeholder="e.g. technology"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">{t('categoryForm.description')}</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.description || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                placeholder="Category description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('categoryForm.color')}</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.color || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, color: e.target.value })}
                placeholder="text-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('categoryForm.sortOrder')}</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.sortOrder || 0}
                onChange={e => setCurrentCategory({ ...currentCategory, sortOrder: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              disabled={loading}
            >
              {t('actions.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Icon icon="ph:spinner" className="animate-spin" />}
              {t('actions.save')}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('articleCategories')}</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Icon icon="ph:plus-bold" />
          {t('actions.new')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(category)} className="p-1.5 hover:bg-muted rounded-lg text-primary">
                <Icon icon="ph:pencil-simple" />
              </button>
              <button onClick={() => handleDelete(category.id)} className="p-1.5 hover:bg-muted rounded-lg text-destructive">
                <Icon icon="ph:trash" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-muted/50 ${category.color || ''}`}>
                <Icon icon="ph:folder-open" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{category.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                    <Icon icon="ph:article" /> {category._count.articles} {t('messages.articlesCount')}
                  </span>
                  <span className="font-mono text-xs">{category.slug}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {t('list.noData')}
          </div>
        )}
      </div>
    </div>
  )
}
