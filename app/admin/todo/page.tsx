import { prisma } from "@/lib/prisma"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { deleteTodo, toggleTodoStatus } from "@/actions/todo"

import { Pagination } from "@/components/ui/pagination"

export const dynamic = 'force-dynamic'

const STATUS_MAP: Record<number, { label: string, color: string }> = {
  0: { label: '规划中', color: 'bg-blue-100 text-blue-800' },
  1: { label: '执行中', color: 'bg-yellow-100 text-yellow-800' },
  2: { label: '已完成', color: 'bg-green-100 text-green-800' },
  3: { label: '已废弃', color: 'bg-gray-100 text-gray-800' },
}

export default async function TodoAdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1');
  const pageSize = 10;

  const totalTodos = await prisma.todo.count();
  const totalPages = Math.ceil(totalTodos / pageSize);

  const todos = await prisma.todo.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">待办事项管理</h2>
        <Link
          href="/admin/todo/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Icon icon="ph:plus" className="mr-2 h-4 w-4" />
          新增待办
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[40%]">标题</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">状态</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">排序</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">操作</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {todos.map((todo) => {
                const statusMeta = STATUS_MAP[todo.status] || STATUS_MAP[0];
                return (
                  <tr key={todo.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      <div className="font-medium">{todo.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{todo.description}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="text-muted-foreground">{todo.sortOrder}</div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick status cycle button */}
                        <form action={async () => {
                          'use server'
                          await toggleTodoStatus(todo.id, (todo.status + 1) % 4)
                        }}>
                          <button title="切换状态" className="p-2 hover:bg-muted rounded-md transition-colors">
                            <Icon icon="ph:arrows-clockwise" className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </form>

                        <Link href={`/admin/todo/${todo.id}/edit`} className="p-2 hover:bg-muted rounded-md transition-colors">
                          <Icon icon="ph:pencil-simple" className="w-4 h-4 text-muted-foreground" />
                        </Link>
                        <form action={async () => {
                          'use server'
                          await deleteTodo(todo.id)
                        }}>
                          <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors">
                            <Icon icon="ph:trash" className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {todos.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <Pagination totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  )
}
