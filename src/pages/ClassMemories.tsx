import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiX, FiChevronLeft, FiChevronRight, FiDownload, FiTrash2, FiImage } from 'react-icons/fi'
import { fetchAllSessions } from '../utils/api'
import { fetchAllMemories, deleteMemory, updateMemoryCaption, getSignedUrl } from '../utils/memoriesApi'
import type { ClassSession, ClassMemory } from '../types'
import MemoryThumb from '../components/MemoryThumb'

interface Group {
  session: ClassSession
  memories: ClassMemory[]
}

export default function ClassMemories() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [memories, setMemories] = useState<ClassMemory[]>([])
  const [loading, setLoading] = useState(true)
  const [viewer, setViewer] = useState<{ groupIndex: number; photoIndex: number } | null>(null)

  useEffect(() => {
    Promise.all([fetchAllSessions(), fetchAllMemories()]).then(([s, m]) => {
      setSessions(s)
      setMemories(m)
      setLoading(false)
    })
  }, [])

  const groups: Group[] = useMemo(() => {
    const bySession = new Map<string, ClassMemory[]>()
    for (const m of memories) {
      const arr = bySession.get(m.session_id) ?? []
      arr.push(m)
      bySession.set(m.session_id, arr)
    }
    return sessions
      .filter((s) => bySession.has(s.id))
      .map((session) => ({ session, memories: bySession.get(session.id)! }))
  }, [sessions, memories])

  function removeMemoryFromState(id: string) {
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-6 pb-10">
      <button
        onClick={() => navigate('/progress')}
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-softer text-navy/50"
      >
        <FiArrowLeft size={18} />
      </button>

      <h1 className="text-xl font-extrabold text-navy">Class Memories</h1>
      <p className="mt-1 text-sm text-navy/50">A gentle visual record of her classes, just for you.</p>

      {loading ? (
        <p className="mt-8 text-center text-sm text-navy/40">Loading…</p>
      ) : groups.length === 0 ? (
        <div className="mt-10 rounded-card bg-card p-8 text-center shadow-soft">
          <FiImage size={28} className="mx-auto mb-3 text-navy/20" />
          <p className="text-sm font-semibold text-navy/60">No memories yet</p>
          <p className="mt-1 text-xs text-navy/40">
            Add a photo during a class or from a past one in Progress, and it'll show up here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {groups.map((group, gi) => (
            <div key={group.session.id}>
              <div className="mb-2">
                <p className="text-sm font-bold text-navy">{group.session.lesson_name_snapshot}</p>
                <p className="text-xs text-navy/45">
                  {new Date(group.session.occurred_at).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.memories.map((m, pi) => (
                  <button key={m.id} onClick={() => setViewer({ groupIndex: gi, photoIndex: pi })}>
                    <MemoryThumb path={m.thumbnail_path} className="h-20 w-20 rounded-2xl object-cover shadow-softer" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewer && (
        <Viewer
          groups={groups}
          groupIndex={viewer.groupIndex}
          photoIndex={viewer.photoIndex}
          onClose={() => setViewer(null)}
          onNavigate={(g, p) => setViewer({ groupIndex: g, photoIndex: p })}
          onDeleted={removeMemoryFromState}
        />
      )}
    </div>
  )
}

function Viewer({
  groups,
  groupIndex,
  photoIndex,
  onClose,
  onNavigate,
  onDeleted
}: {
  groups: Group[]
  groupIndex: number
  photoIndex: number
  onClose: () => void
  onNavigate: (groupIndex: number, photoIndex: number) => void
  onDeleted: (id: string) => void
}) {
  const group = groups[groupIndex]
  const memory = group?.memories[photoIndex]
  const [url, setUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState(memory?.caption ?? '')
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!memory) return
    setUrl(null)
    setCaption(memory.caption ?? '')
    getSignedUrl(memory.storage_path).then(setUrl)
  }, [memory?.id])

  if (!group || !memory) return null

  const hasPrev = photoIndex > 0
  const hasNext = photoIndex < group.memories.length - 1

  async function handleCaptionBlur() {
    if (caption === (memory.caption ?? '')) return
    await updateMemoryCaption(memory.id, caption || null)
  }

  async function handleDownload() {
    if (!url) return
    setDownloading(true)
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `roza-class-memory-${memory.id}.jpg`
      a.click()
      URL.revokeObjectURL(objectUrl)
    } finally {
      setDownloading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setDeleting(true)
    await deleteMemory(memory)
    setDeleting(false)
    onDeleted(memory.id)
    if (hasNext) onNavigate(groupIndex, photoIndex)
    else if (hasPrev) onNavigate(groupIndex, photoIndex - 1)
    else onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy/95 px-4 pt-[calc(env(safe-area-inset-top)+16px)] pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white" aria-label="Close">
          <FiX size={18} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading || !url}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-50"
            aria-label="Download"
          >
            <FiDownload size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-coral disabled:opacity-50"
            aria-label="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-4">
        {hasPrev && (
          <button
            onClick={() => onNavigate(groupIndex, photoIndex - 1)}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Previous photo"
          >
            <FiChevronLeft size={20} />
          </button>
        )}
        {url ? (
          <img src={url} alt={memory.caption ?? 'Class memory'} className="max-h-full max-w-full rounded-2xl object-contain" />
        ) : (
          <div className="h-40 w-40 animate-pulse rounded-2xl bg-white/10" />
        )}
        {hasNext && (
          <button
            onClick={() => onNavigate(groupIndex, photoIndex + 1)}
            className="absolute right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Next photo"
          >
            <FiChevronRight size={20} />
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-semibold text-white/50">
          {group.session.lesson_name_snapshot} ·{' '}
          {new Date(group.session.occurred_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={handleCaptionBlur}
          placeholder="Add a caption (optional)"
          className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-center text-sm text-white outline-none placeholder:text-white/40 focus:border-white/40"
        />
      </div>
    </div>
  )
}
