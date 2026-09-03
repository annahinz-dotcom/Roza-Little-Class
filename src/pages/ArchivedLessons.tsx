import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiRotateCcw, FiEdit2 } from 'react-icons/fi'
import { fetchLessons, restoreLesson } from '../utils/api'
import type { Lesson } from '../types'

export default function ArchivedLessons() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setLessons(await fetchLessons('archived'))
    setLoading(false)
  }

  async function handleRestore(id: string) {
    await restoreLesson(id)
    load()
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-6">
      <button onClick={() => navigate('/')} className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-softer text-navy/50">
        <FiArrowLeft size={18} />
      </button>
      <h1 className="text-xl font-extrabold text-navy">Archived lessons</h1>
      <p className="mt-1 text-sm text-navy/50">Their class history is kept — restore any of them anytime.</p>

      <div className="mt-5 space-y-2 pb-6">
        {loading ? (
          <p className="text-sm text-navy/40">Loading…</p>
        ) : lessons.length === 0 ? (
          <p className="rounded-card bg-card p-4 text-sm text-navy/50 shadow-softer">No archived lessons.</p>
        ) : (
          lessons.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-2 rounded-card bg-card p-4 shadow-softer">
              <div className="min-w-0">
                <p className="truncate font-bold text-navy">{l.name}</p>
                <p className="truncate text-xs text-navy/45">{l.focus}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => navigate(`/lesson/${l.id}/edit`)} className="rounded-full p-2 text-navy/35 hover:bg-cream" aria-label="Edit">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => handleRestore(l.id)} className="rounded-full p-2 text-sage hover:bg-cream" aria-label="Restore">
                  <FiRotateCcw size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
