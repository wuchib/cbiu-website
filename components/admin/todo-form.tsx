'use client';

import { useActionState, useState } from 'react';
import { createTodo, updateTodo } from '@/actions/todo';
import Link from "next/link";
import { Icon } from '@iconify/react';

const STATUS_OPTIONS = [
  { value: 0, label: '规划中' },
  { value: 1, label: '执行中' },
  { value: 2, label: '已完成' },
  { value: 3, label: '已废弃' },
];

export default function TodoForm({ todo }: { todo?: any }) {
  const initialState = { message: null, errors: {} };
  const updateWithId = todo ? updateTodo.bind(null, todo.id) : createTodo;
  // @ts-ignore
  const [state, dispatch, isPending] = useActionState(updateWithId, initialState);

  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    status: todo?.status ?? 0,
    sortOrder: todo?.sortOrder || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'status' || name === 'sortOrder' ? Number(value) : value }));
  };

  return (
    <form action={dispatch} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2 border-b pb-3">
            <Icon icon="ph:info-duotone" className="w-5 h-5 text-indigo-500" />
            基本信息
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">标题</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              placeholder="待办事项标题"
              required
            />
            {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex min-h-[100px] w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed placeholder:text-muted-foreground/50"
              placeholder="待办理事项详细描述（可选）"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2 border-b pb-3">
            <Icon icon="ph:faders-duotone" className="w-5 h-5 text-orange-500" />
            设置
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="status">状态</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sortOrder">排序</label>
            <input
              type="number"
              id="sortOrder"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              className="flex h-10 w-full rounded-xl border border-input/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Link href="/admin/todo" className="flex-1 inline-flex h-10 items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
            取消
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {isPending ? <Icon icon="ph:spinner" className="animate-spin w-4 h-4 mr-2" /> : <Icon icon="ph:check" className="w-4 h-4 mr-2" />}
            {isPending ? '保存中...' : '保存'}
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
