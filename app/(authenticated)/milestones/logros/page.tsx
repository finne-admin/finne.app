import { TodosLosLogros } from '@/components/milestones/TodosLosLogros'

export default function LogrosPage() {
  return (
    <div className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Todos los logros</h1>
      <TodosLosLogros />
    </div>
  )
}
