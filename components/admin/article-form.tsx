'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { createArticle, updateArticle } from '@/actions/articles';
import { uploadImage } from '@/actions/upload';
import Link from "next/link"
import { Icon } from "@iconify/react"
import { useTranslations } from 'next-intl';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export default function ArticleForm({ article }: { article?: any }) {
  const t = useTranslations('Admin');

  // Step 1: Content (Title + Markdown)
  // Step 2: Settings (Metadata + Publish)
  const [step, setStep] = useState<1 | 2>(1);

  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [content, setContent] = useState(article?.content || '');
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [coverImage, setCoverImage] = useState(article?.coverImage || '');
  const [isUploading, setIsUploading] = useState(false);

  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const initialState = { message: '', errors: {} };
  const updateWithId = article ? updateArticle.bind(null, article.id) : createArticle;
  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  // Ensure we start at Step 1 when component mounts (fixes issue with subsequent creations)
  useEffect(() => {
    setStep(1);
    // Reset state if it's a new article (no ID) and we might have stale state
    if (!article) {
      setContent('');
      setTitle('');
      setTags([]);
      setSlug('');
      setCoverImage('');
    }
  }, [article]);

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
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (!article) { // Only auto-generate for new articles
      const newSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(newSlug);
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

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error (if we had a global one, but for editor we might just use alert or toast)
    // For consistency with requested simplicity, let's use valid check
    if (file.size > 5 * 1024 * 1024) {
      alert(t('actions.upload.errorSize'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadImage(formData);

    if (result.url) {
      insertMarkdown(`![${file.name}](${result.url})`);
    } else {
      console.error(result.error);
      // @ts-ignore
      const errorMessage = result.error ? t(`actions.upload.${result.error}`) : t('actions.upload.errorGeneric');
      alert(errorMessage);
    }


    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(t('actions.upload.errorSize'));
      if (coverInputRef.current) coverInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadImage(formData);

    if (result.url) {
      setCoverImage(result.url);
    } else {
      console.error(result.error);
      // @ts-ignore
      const errorMessage = result.error ? t(`actions.upload.${result.error}`) : t('actions.upload.errorGeneric');
      alert(errorMessage);
    }

    setIsUploading(false);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  return (
    <form action={dispatch} className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Top Bar: Navigation & Actions */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 sticky top-0">
        <div className="flex items-center gap-4 flex-1">
          {step === 1 ? (
            <Link href="/admin/articles" className="p-2 -ml-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <Icon icon="ph:arrow-left" className="w-5 h-5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="p-2 -ml-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Icon icon="ph:arrow-left" className="w-5 h-5" />
            </button>
          )}

          {step === 1 ? (
            <div className="flex-1">
              <input
                id="title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                className="w-full bg-transparent text-lg md:text-xl font-bold outline-none placeholder:text-muted-foreground/40 border-none p-0 focus:ring-0 leading-tight"
                placeholder={t('articleForm.titlePlaceholder')}
                required
                autoComplete="off"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold truncate max-w-md">{title || t('articleForm.titlePlaceholder')}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium text-muted-foreground">{t('articleForm.settingsTitle')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-l pl-3 ml-1 border-border/50">
            {step === 1 ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setStep(2); }}
                disabled={!title}
                className="px-6 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                {t('actions.continue')}
                <Icon icon="ph:arrow-right" className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                {isPending ? <Icon icon="ph:spinner" className="animate-spin w-4 h-4" /> : <Icon icon="ph:check" className="w-4 h-4" />}
                {isPending ? t('actions.saving') : t('actions.save')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step 1: Content Editor */}
      {step === 1 && (
        <>
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
            <div className="w-px h-4 bg-border mx-1" />
            <button type="button" onClick={() => {
              const textarea = textareaRef.current;
              if (!textarea) return;

              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = textarea.value;
              const selection = text.substring(start, end);

              // Simple URL detection
              const isUrl = /^(http|https):\/\/[^ "]+$/.test(selection);

              let newText = '';
              let newSelectionStart = 0;
              let newSelectionEnd = 0;

              if (isUrl) {
                // If selection is a URL, use it as the link target
                newText = text.substring(0, start) + `[text](${selection})` + text.substring(end);
                // Select "text" so user can type description
                newSelectionStart = start + 1;
                newSelectionEnd = start + 5;
              } else {
                // If selection is not a URL (or empty), put it in brackets and add http placeholder
                const placeholder = 'https://';
                newText = text.substring(0, start) + `[${selection}](${placeholder})` + text.substring(end);
                // Select "https://" so user can type URL
                newSelectionStart = start + selection.length + 3;
                newSelectionEnd = newSelectionStart + placeholder.length;
              }

              setContent(newText);

              setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
              }, 0);
            }} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Link">
              <Icon icon="ph:link" className="w-5 h-5" />
            </button>

            {/* Image Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleEditorImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground relative"
              title="Upload Image"
              disabled={isUploading}
            >
              {isUploading ? <Icon icon="ph:spinner" className="animate-spin w-5 h-5" /> : <Icon icon="ph:image" className="w-5 h-5" />}
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
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity" />
                    )
                  }}
                >
                  {content || `*${t('articleForm.previewPlaceholder')}*`}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Settings */}
      {step === 2 && (
        <div className="flex-1 overflow-y-auto w-full animate-in slide-in-from-right-8 fade-in duration-300 bg-muted/5">
          <div className="max-w-5xl mx-auto p-6 md:p-10">
            {/* Hidden inputs to preserve data from Step 1 */}
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="title" value={title} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Main Metadata */}
              <div className="md:col-span-2 space-y-6">
                <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b bg-muted/20">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon icon="ph:article-duotone" className="w-5 h-5 text-primary" />
                      {t('articleForm.settingsTitle')}
                    </h3>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Slug */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground" htmlFor="slug">{t('articleForm.slug')}</label>
                      <div className="group flex items-center rounded-xl border border-input/50 bg-background/50 px-3 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary focus-within:bg-background">
                        <span className="text-muted-foreground/60 text-sm mr-1">/articles/</span>
                        <input
                          id="slug"
                          name="slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="flex h-11 w-full bg-transparent py-1 text-sm shadow-none transition-colors focus-visible:outline-none placeholder:text-muted-foreground/50 font-mono"
                          placeholder={t('articleForm.slugPlaceholder')}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground/60">Using unique ID for URL routing.</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-muted-foreground" htmlFor="description">{t('articleForm.description')}</label>
                      <div className="rounded-xl border border-input/50 bg-background/50 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary focus-within:bg-background">
                        <textarea
                          id="description"
                          name="description"
                          defaultValue={article?.description}
                          className="flex min-h-[120px] w-full bg-transparent px-4 py-3 text-sm shadow-none focus-visible:outline-none resize-none leading-relaxed"
                          placeholder={t('articleForm.descriptionPlaceholder')}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags Card */}
                <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b bg-muted/20">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon icon="ph:tag-duotone" className="w-5 h-5 text-indigo-500" />
                      {t('articleForm.tags')}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl border border-input/50 bg-background/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary focus-within:bg-background transition-all">
                        {tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300 animate-in zoom-in border border-indigo-500/20">
                            <Icon icon="ph:hash" className="w-3 h-3 opacity-50" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-indigo-500/60 hover:text-indigo-600 ml-1 transition-colors"
                            >
                              <Icon icon="ph:x" className="w-3.5 h-3.5" />
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
                      <p className="text-xs text-muted-foreground/60 p-1">Press <kbd className="font-sans px-1 rounded bg-muted">Enter</kbd> to add tags.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Status & Assets */}
              <div className="space-y-6">
                {/* Publish Card */}
                <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                      <Icon icon="ph:paper-plane-tilt-duotone" className="w-5 h-5 text-green-500" />
                      Publishing
                    </h3>
                    <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-background/50">
                      <div className="space-y-1">
                        <label htmlFor="published" className="font-medium cursor-pointer block text-sm">Status</label>
                        <p className="text-xs text-muted-foreground">{t('articleForm.publishedDesc')}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="published"
                          name="published"
                          defaultChecked={article?.published}
                          className="peer sr-only"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cover Image Card */}
                <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b bg-muted/20 flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Icon icon="ph:image-duotone" className="w-5 h-5 text-pink-500" />
                      {t('articleForm.coverImage')}
                    </h3>
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={isUploading}
                      className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors flex items-center gap-1"
                    >
                      {isUploading ? <Icon icon="ph:spinner" className="animate-spin" /> : <Icon icon="ph:upload-simple" />}
                      Upload
                    </button>
                    <input
                      type="file"
                      ref={coverInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverUpload}
                    />
                  </div>
                  <div className="p-6 pt-6">
                    <div className="space-y-4">
                      <div className="relative group">
                        <Icon icon="ph:link" className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          id="coverImage"
                          name="coverImage"
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="flex h-11 w-full rounded-xl border border-input/50 bg-background/50 pl-10 pr-3 py-1 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:bg-background shadow-sm placeholder:text-muted-foreground/50"
                          placeholder={t('articleForm.coverImage')}
                        />
                      </div>
                      <div className="aspect-video w-full rounded-xl border-2 border-dashed border-muted/50 bg-muted/10 flex items-center justify-center overflow-hidden relative group">
                        {coverImage ? (
                          <>
                            <img src={coverImage} className="w-full h-full object-cover" alt="Cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => setCoverImage('')}
                                className="bg-destructive text-white p-2 rounded-full hover:bg-destructive/90"
                              >
                                <Icon icon="ph:trash" className="w-5 h-5" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4 cursor-pointer" onClick={() => coverInputRef.current?.click()}>
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
              </div>

              {state?.message && (
                <div className="md:col-span-3 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border border-destructive/20">
                  <Icon icon="ph:warning-circle-duotone" className="w-5 h-5" />
                  {state.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
