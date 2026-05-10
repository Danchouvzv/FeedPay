import { useMemo, useState } from 'react'
import { ClipboardCheck, Plus, WandSparkles } from 'lucide-react'
import type { ManagerTask } from '../types/review'
import { getActionItems } from '../utils/intelligence'
import { getReviews, getTasks, saveTask, saveTasks } from '../utils/storage'

const statuses: ManagerTask['status'][] = ['open', 'in_progress', 'done']

export function TasksPage() {
  const [tasks, setTasks] = useState(() => getTasks())
  const actionItems = useMemo(() => getActionItems(getReviews()), [])

  const createFromPipeline = () => {
    const nextTasks = actionItems.map<ManagerTask>((item) => ({
      id: crypto.randomUUID(),
      title: item.title,
      topic: item.topic,
      priority: item.priority,
      status: 'open',
      source: 'pipeline',
      createdAt: new Date().toISOString(),
      description: item.description,
    }))
    saveTasks([...nextTasks, ...tasks])
    setTasks(getTasks())
  }

  const addManual = () => {
    saveTask({
      id: crypto.randomUUID(),
      title: 'Проверить новую гипотезу сервиса',
      topic: 'service',
      priority: 'Medium',
      status: 'open',
      source: 'manual',
      createdAt: new Date().toISOString(),
      description: 'Создано вручную менеджером для follow-up.',
    })
    setTasks(getTasks())
  }

  const moveTask = (task: ManagerTask, status: ManagerTask['status']) => {
    const updated = tasks.map((item) => (item.id === task.id ? { ...item, status } : item))
    saveTasks(updated)
    setTasks(updated)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="rounded-[2.5rem] border-2 border-black bg-[#CCFF00] p-6 text-black shadow-[10px_10px_0_#000] md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#000]">
              Manager task board
            </span>
            <h1 className="mt-6 text-5xl font-black uppercase leading-none md:text-7xl">Отзывы → задачи</h1>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-black/65">Pipeline создаёт action items, а менеджер ведёт их до результата.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={createFromPipeline} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-[#0038FF] px-5 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_#000]">
              <WandSparkles className="size-4" />
              Создать из pipeline
            </button>
            <button onClick={addManual} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-black bg-white px-5 py-4 text-sm font-black uppercase text-black shadow-[5px_5px_0_#000]">
              <Plus className="size-4" />
              Manual task
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {statuses.map((status) => (
          <article key={status} className="rounded-[2.5rem] border-2 border-black bg-white p-5 text-black shadow-[10px_10px_0_#000]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase">{status.replace('_', ' ')}</h2>
              <ClipboardCheck className="size-6 text-[#0038FF]" />
            </div>
            <div className="grid gap-3">
              {tasks.filter((task) => task.status === status).map((task) => (
                <div key={task.id} className="rounded-[1.5rem] border-2 border-black bg-[#F8F9FA] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black uppercase">{task.title}</h3>
                    <span className="rounded-full bg-[#CCFF00] px-2 py-1 text-[10px] font-black">{task.priority}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-black/55">{task.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {statuses.map((next) => (
                      <button key={next} onClick={() => moveTask(task, next)} className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase">
                        {next.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
