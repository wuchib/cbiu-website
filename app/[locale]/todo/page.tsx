import { prisma } from "@/lib/prisma"
import { Icon } from "@iconify/react"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

const STATUS_MAP: Record<number, { label: string, color: string }> = {
  0: { label: '规划中', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  1: { label: '执行中', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  2: { label: '已完成', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  3: { label: '已废弃', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
}

export default async function TodoPage() {
  const todos = await prisma.todo.findMany({
    orderBy: [
      { status: 'asc' },
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Table Content */}
        <div className="animate-in fill-mode-both overflow-x-auto fade-in slide-in-from-bottom-4 duration-700">
          {todos.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-border bg-[color:color-mix(in_srgb,var(--card)_92%,var(--foreground)_8%)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <table className="w-full border-collapse">
                <tbody className="divide-y divide-border">
                {todos.map((todo) => {
                  const meta = STATUS_MAP[todo.status] || STATUS_MAP[0];
                  return (
                    <tr
                      key={todo.id}
                      className="group transition-colors hover:bg-accent/40"
                    >
                      {/* Name Column */}
                      <td className="py-5 pr-4 pl-2 min-w-[180px]">
                        <div className="text-[16px] font-bold text-foreground transition-colors group-hover:text-primary">
                          {todo.title}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.color} font-medium`}>
                          {meta.label}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="py-5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                          <Icon icon="ph:calendar-blank-duotone" className="w-4 h-4 opacity-70" />
                          <span>{format(todo.createdAt, 'yyyy-MM-dd')}</span>
                        </div>
                      </td>

                      {/* Description Column */}
                      <td className="py-5 px-4 min-w-[240px]">
                        <p className="text-[14px] leading-relaxed text-muted-foreground opacity-90">
                          {todo.description || <span className="opacity-30 italic">暂无描述</span>}
                        </p>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-accent/15 px-4 py-20 text-center">
              <Icon icon="ph:check-square-offset-duotone" className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg font-article-canger text-muted-foreground">目前还没有任何待办事项</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
