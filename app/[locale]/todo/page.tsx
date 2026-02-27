import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { Icon } from "@iconify/react"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

const STATUS_MAP: Record<number, { label: string, color: string, icon: string }> = {
  0: { label: '规划中', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: 'ph:clock-duotone' },
  1: { label: '执行中', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: 'ph:spinner-gap-duotone' },
  2: { label: '已完成', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: 'ph:check-circle-duotone' },
  3: { label: '已废弃', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: 'ph:x-circle-duotone' },
}

export default async function TodoPage() {
  const todos = await prisma.todo.findMany({
    orderBy: [
      { status: 'asc' },
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  // Group by status
  const groupedTodos = todos.reduce((acc, todo) => {
    if (!acc[todo.status]) {
      acc[todo.status] = [];
    }
    acc[todo.status].push(todo);
    return acc;
  }, {} as Record<number, typeof todos>);

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Todo List
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            记录网站开发、功能迭代与未来规划的状态追踪板。
          </p>
        </div>

        {/* Content */}
        <div className="space-y-16">
          {[1, 0, 2, 3].map((status) => {
            const statusGroup = groupedTodos[status];
            if (!statusGroup || statusGroup.length === 0) return null;

            const meta = STATUS_MAP[status];

            return (
              <section key={status} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${status * 100}ms` }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-xl border ${meta.color}`}>
                    <Icon icon={meta.icon} className={`w-5 h-5 ${status === 1 ? 'animate-spin-slow' : ''}`} />
                  </div>
                  <h2 className="text-2xl font-bold">{meta.label}</h2>
                  <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {statusGroup.length}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {statusGroup.map(todo => (
                    <div
                      key={todo.id}
                      className="group relative p-6 rounded-2xl border bg-card hover:shadow-md transition-all duration-300 hover:border-primary/20"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                            {todo.title}
                          </h3>
                        </div>

                        {todo.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {todo.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t mt-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Icon icon="ph:calendar-blank-duotone" className="w-4 h-4" />
                            <span>{format(todo.createdAt, 'yyyy-MM-dd')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {todos.length === 0 && (
            <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-muted-foreground/20 bg-muted/5">
              <Icon icon="ph:check-square-offset-duotone" className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-muted-foreground text-lg">目前还没有任何待办事项</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
