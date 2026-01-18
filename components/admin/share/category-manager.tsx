'use client'

import { useState } from 'react'
import { ShareCategory } from '@prisma/client'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { createShareCategory, updateShareCategory, deleteShareCategory } from '@/actions/share'
// import { toast } from 'sonner' // Assuming sonner or similar toast exists, checking recent-activity used none, but standard alerting is fine for now

interface CategoryManagerProps {
  categories: (ShareCategory & { _count: { resources: number } })[]
}

export default function CategoryManager({ categories }: CategoryManagerProps) {
  const t = useTranslations('Admin')
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<ShareCategory> & { fieldsSchema?: any[] }>({})
  const [loading, setLoading] = useState(false)

  const handleEdit = (category: ShareCategory) => {
    setCurrentCategory({
      ...category,
      fieldsSchema: (category.fieldsSchema as any[]) || []
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setCurrentCategory({
      key: '',
      name: '',
      description: '',
      icon: '',
      color: '',
      sortOrder: 0,
      fieldsSchema: []
    })
    setIsEditing(true)
  }

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    setLoading(true)
    const res = await deleteShareCategory(key)
    setLoading(false)

    if (res.error) {
      alert(res.error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Ensure key is present for update/create
    if (!currentCategory.key) {
      alert('Key is required')
      setLoading(false)
      return
    }

    const isNew = categories.findIndex(c => c.key === currentCategory.key) === -1 // This logic is flawed for edits if key didn't change, but key is ID.
    // Better logic: if we clicked "Edit", we know we are updating the original key (which shouldn't change actually).
    // For simplicity, let's assume Create = New Key. Edit = Existing Key (read-only).

    // Check if we are editing an existing item from the list
    const existing = categories.find(c => c.key === currentCategory.key)

    let res
    if (existing && isEditing) {
      // It's an update
      res = await updateShareCategory(currentCategory.key, currentCategory)
    } else {
      res = await createShareCategory(currentCategory)
    }

    setLoading(false)

    if (res.error) {
      alert(res.error)
    } else {
      setIsEditing(false)
    }
  }

  const addField = () => {
    const newField = { key: '', label: '', type: 'text', placeholder: '' }
    setCurrentCategory(prev => ({
      ...prev,
      fieldsSchema: [...(prev.fieldsSchema || []), newField]
    }))
  }

  const updateField = (index: number, field: any) => {
    const newFields = [...(currentCategory.fieldsSchema || [])]
    newFields[index] = field
    setCurrentCategory(prev => ({ ...prev, fieldsSchema: newFields }))
  }

  const removeField = (index: number) => {
    const newFields = [...(currentCategory.fieldsSchema || [])]
    newFields.splice(index, 1)
    setCurrentCategory(prev => ({ ...prev, fieldsSchema: newFields }))
  }

  if (isEditing) {
    return (
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold">
            {categories.find(c => c.key === currentCategory.key) ? t('actions.edit') : t('actions.new')} Category
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground">
            <Icon icon="ph:x" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Key (ID)</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.key}
                onChange={e => setCurrentCategory({ ...currentCategory, key: e.target.value })}
                disabled={!!categories.find(c => c.key === currentCategory.key)} // Disable if editing existing
                placeholder="e.g. magic"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.name}
                onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                placeholder="e.g. Magic"
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Description</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.description || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon (Iconify)</label>
              <div className="flex gap-2">
                <input
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                  value={currentCategory.icon || ''}
                  onChange={e => setCurrentCategory({ ...currentCategory, icon: e.target.value })}
                  placeholder="ph:star-duotone"
                />
                {currentCategory.icon && <Icon icon={currentCategory.icon} className="w-10 h-10 p-2 bg-muted rounded-lg" />}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Class</label>
              <input
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.color || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, color: e.target.value })}
                placeholder="text-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border bg-background"
                value={currentCategory.sortOrder || 0}
                onChange={e => setCurrentCategory({ ...currentCategory, sortOrder: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Dynamic Fields Builder */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Dynamic Fields</h3>
              <button type="button" onClick={addField} className="text-sm text-primary flex items-center gap-1">
                <Icon icon="ph:plus" /> Add Field
              </button>
            </div>

            <div className="space-y-3">
              {currentCategory.fieldsSchema?.map((field: any, index: number) => (
                <div key={index} className="flex gap-2 items-start p-3 bg-muted/30 rounded-lg border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                    <input
                      className="px-2 py-1 text-sm rounded border bg-background"
                      placeholder="Key (e.g. price)"
                      value={field.key}
                      onChange={e => updateField(index, { ...field, key: e.target.value })}
                    />
                    <input
                      className="px-2 py-1 text-sm rounded border bg-background"
                      placeholder="Label (e.g. Price)"
                      value={field.label}
                      onChange={e => updateField(index, { ...field, label: e.target.value })}
                    />
                    <select
                      className="px-2 py-1 text-sm rounded border bg-background"
                      value={field.type}
                      onChange={e => updateField(index, { ...field, type: e.target.value })}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                    </select>
                    <input
                      className="px-2 py-1 text-sm rounded border bg-background"
                      placeholder="Placeholder / Options"
                      value={field.placeholder || ''}
                      onChange={e => updateField(index, { ...field, placeholder: e.target.value })}
                    />
                  </div>
                  <button type="button" onClick={() => removeField(index)} className="text-destructive hover:opacity-70 mt-1">
                    <Icon icon="ph:trash" />
                  </button>
                </div>
              ))}
              {(!currentCategory.fieldsSchema || currentCategory.fieldsSchema.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No custom fields defined.</p>
              )}
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
        <h2 className="text-xl font-semibold">Categories</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Icon icon="ph:plus-bold" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.key} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(category)} className="p-1.5 hover:bg-muted rounded-lg text-primary">
                <Icon icon="ph:pencil-simple" />
              </button>
              <button onClick={() => handleDelete(category.key)} className="p-1.5 hover:bg-muted rounded-lg text-destructive">
                <Icon icon="ph:trash" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-muted/50 ${category.color}`}>
                {category.icon ? <Icon icon={category.icon} className="w-6 h-6" /> : <div className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{category.description}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                    <Icon icon="ph:stack" /> {category._count.resources} resources
                  </span>
                  <span>Key: {category.key}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
