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
    <main className="min-h-screen pb-20 bg-[#F3EBE1]">
      <div className="container max-w-5xl mx-auto px-6 pt-10">
        {/* Table Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both overflow-x-auto">
          {todos.length > 0 ? (
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-[#E8DDD0]">
                {todos.map((todo) => {
                  const meta = STATUS_MAP[todo.status] || STATUS_MAP[0];
                  return (
                    <tr
                      key={todo.id}
                      className="group hover:bg-[#E8DDD0]/30 transition-colors"
                    >
                      {/* Name Column */}
                      <td className="py-5 pr-4 pl-2 min-w-[180px]">
                        <div className="font-bold text-[16px] text-[#2C2520] group-hover:text-[#C4956A] transition-colors">
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
                        <div className="flex items-center gap-2 text-[12px] text-[#8B7E74]">
                          <Icon icon="ph:calendar-blank-duotone" className="w-4 h-4 opacity-70" />
                          <span>{format(todo.createdAt, 'yyyy-MM-dd')}</span>
                        </div>
                      </td>

                      {/* Description Column */}
                      <td className="py-5 px-4 min-w-[240px]">
                        <p className="text-[14px] text-[#5C5147] leading-relaxed opacity-90">
                          {todo.description || <span className="opacity-30 italic">暂无描述</span>}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-[#E8DDD0] bg-[#E8DDD0]/10">
              <Icon icon="ph:check-square-offset-duotone" className="w-16 h-16 mx-auto mb-4 text-[#8B7E74]/30" />
              <p className="text-[#8B7E74] text-lg font-article-canger">目前还没有任何待办事项</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
