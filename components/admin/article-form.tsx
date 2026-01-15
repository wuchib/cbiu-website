'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { createArticle, updateArticle } from '@/actions/articles';
import Link from "next/link"
import { Icon } from "@iconify/react"
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export default function ArticleForm({ article }: { article?: any }) {
  const t = useTranslations('Admin');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [content, setContent] = useState(article?.content || '');
  const [title, setTitle] = useState(article?.title || '');
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const initialState = { message: '', errors: {} };
  const updateWithId = article ? updateArticle.bind(null, article.id) : createArticle;
  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        e.currentTarget.value = '';
      }
    }
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!article) { // Only auto-generate for new articles
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const slugInput = document.getElementById('slug') as HTMLInputElement;
      if (slugInput) slugInput.value = slug;
    }
  }

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setContent(newText);

    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <form action={dispatch} className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Top Bar: Title & Actions */}
      {/* Top Bar: Title & Actions */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 sticky top-0">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/admin/articles" className="p-2 -ml-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-border/50 mx-2 hidden sm:block" />
          <input
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            className="flex-1 bg-transparent text-lg md:text-xl font-bold outline-none placeholder:text-muted-foreground/40 border-none p-0 focus:ring-0 leading-tight"
            placeholder={t('articleForm.titlePlaceholder')}
            required
            autoComplete="off"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={cn("p-2 rounded-full transition-colors", showSettings ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")}
            title="Settings"
          >
            <Icon icon="ph:gear-duotone" className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 border-l pl-3 ml-1 border-border/50">
            <Link href="/admin/articles" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('actions.cancel')}
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {isPending ? t('actions.saving') : t('actions.save')}
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-6 py-2 border-b bg-muted/30 overflow-x-auto z-10">
        <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Bold">
          <Icon icon="ph:text-b-bold" className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => insertMarkdown('*', '*')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Italic">
          <Icon icon="ph:text-italic" className="w-5 h-5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => insertMarkdown('# ')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Heading 1">
          <Icon icon="ph:text-h-one" className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => insertMarkdown('## ')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Heading 2">
          <Icon icon="ph:text-h-two" className="w-5 h-5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => insertMarkdown('- ')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="List">
          <Icon icon="ph:list-bullets" className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => insertMarkdown('1. ')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Numbered List">
          <Icon icon="ph:list-numbers" className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => insertMarkdown('- [ ] ')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Checklist">
          <Icon icon="ph:checks" className="w-5 h-5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => insertMarkdown('`', '`')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Inline Code">
          <Icon icon="ph:code" className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => insertMarkdown('```\n', '\n```')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Code Block">
          <Icon icon="ph:code-block" className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => insertMarkdown('> ')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Quote">
          <Icon icon="ph:quotes" className="w-5 h-5" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button type="button" onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Link">
          <Icon icon="ph:link" className="w-5 h-5" />
        </button>
        <button type="button" onClick={() => insertMarkdown('![alt](', ')')} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Image">
          <Icon icon="ph:image" className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        {/* View Layout Toggle */}
        <div className="flex items-center bg-muted/50 rounded-lg p-0.5 border border-border/50">
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={cn("px-2 py-1 rounded text-xs font-medium transition-colors", viewMode === 'editor' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={cn("px-2 py-1 rounded text-xs font-medium transition-colors", viewMode === 'split' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={cn("px-2 py-1 rounded text-xs font-medium transition-colors", viewMode === 'preview' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden relative group">

        {/* Editor Pane */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          viewMode === 'preview' && "hidden"
        )}>
          <textarea
            ref={textareaRef}
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full resize-none border-none p-6 bg-background focus:ring-0 outline-none font-mono text-sm leading-relaxed"
            placeholder={t('articleForm.contentPlaceholder')}
          />
        </div>

        {/* Divider (Only in split mode) */}
        {viewMode === 'split' && <div className="w-px bg-border" />}

        {/* Preview Pane */}
        <div className={cn(
          "flex-1 overflow-auto bg-muted/10 transition-all duration-300 p-6 md:p-8",
          viewMode === 'editor' && "hidden"
        )}>
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{content || `*${t('articleForm.previewPlaceholder')}*`}</ReactMarkdown>
          </article>
        </div>

        {/* Settings Panel (Slide-over) */}
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all animate-in fade-in zoom-in-95">
            <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">{t('articleForm.settingsTitle') || 'Article Settings'}</h3>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon icon="ph:x" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Published Status */}
                <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
                  <div className="space-y-0.5">
                    <label htmlFor="published" className="text-sm font-medium">{t('articleForm.published')}</label>
                    <p className="text-xs text-muted-foreground">{t('articleForm.publishedDesc') || 'Visible to the public.'}</p>
                  </div>
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    defaultChecked={article?.published}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="slug">{t('articleForm.slug')}</label>
                  <div className="flex items-center rounded-md border border-input bg-muted/30 px-3">
                    <span className="text-muted-foreground text-sm mr-1">/articles/</span>
                    <input
                      id="slug"
                      name="slug"
                      defaultValue={article?.slug}
                      className="flex h-9 w-full bg-transparent py-1 text-sm shadow-sm transition-colors focus-visible:outline-none placeholder:text-muted-foreground/50"
                      placeholder={t('articleForm.slugPlaceholder')}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="description">{t('articleForm.description')}</label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={article?.description}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    placeholder={t('articleForm.descriptionPlaceholder')}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="tag-input">{t('articleForm.tags')}</label>
                  <div className="flex flex-wrap gap-2 mb-2 p-1 min-h-[38px] rounded-md border border-input bg-background/50">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground animate-in zoom-in">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted-foreground hover:text-foreground ml-1"
                        >
                          <Icon icon="ph:x" className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      id="tag-input"
                      className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground/50 min-w-[120px]"
                      placeholder={tags.length === 0 ? t('articleForm.tagsPlaceholder') : ""}
                      onKeyDown={handleTagKeyDown}
                    />
                  </div>
                  <input type="hidden" name="tags" value={JSON.stringify(tags)} />
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="coverImage">{t('articleForm.coverImage')}</label>
                  <div className="flex gap-2">
                    <input
                      id="coverImage"
                      name="coverImage"
                      defaultValue={article?.coverImage}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {state?.message && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2">
                    <Icon icon="ph:warning-circle" className="w-4 h-4" />
                    {state.message}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors"
                >
                  {t('actions.close') || 'Done'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

