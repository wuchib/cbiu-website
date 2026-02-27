import TodoForm from "@/components/admin/todo-form"
import Link from "next/link"
import { Icon } from "@iconify/react"

export default async function NewTodoPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/todo" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">新增待办</h2>
      </div>

      <TodoForm />
    </div>
  )
}
