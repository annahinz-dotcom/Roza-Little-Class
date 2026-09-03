import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { fetchLessonFull, createLesson, updateLesson } from '../utils/api'
import type { SongRole } from '../types'

interface SongDraft {
  role: SongRole
  label: string
  youtube_url: string
  note: string
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const copy = [...arr]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

export default function LessonForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [focus, setFocus] = useState('')
  const [durationLabel, setDurationLabel] = useState('15–20 min')
  const [songs, setSongs] = useState<SongDraft[]>([
    { role: 'hello', label: 'Hello Song', youtube_url: '', note: '' },
    { role: 'theme', label: '', youtube_url: '', note: '' },
    { role: 'goodbye', label: 'Bye Bye Goodbye', youtube_url: '', note: '' }
  ])
  const [materials, setMaterials] = useState<string[]>([''])
  const [steps, setSteps] = useState<string[]>([''])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchLessonFull(id).then((l) => {
        setName(l.name)
        setFocus(l.focus)
        setDurationLabel(l.duration_label)
        setSongs(
          l.songs.length > 0
            ? l.songs.map((s) => ({ role: s.role, label: s.label, youtube_url: s.youtube_url, note: s.note ?? '' }))
            : songs
        )
        setMaterials(l.materials.length > 0 ? l.materials.map((m) => m.label) : [''])
        setSteps(l.steps.length > 0 ? l.steps.map((s) => s.content) : [''])
        setLoading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id])

  async function handleSave() {
    setSaving(true)
    const input = {
      name: name.trim(),
      focus: focus.trim(),
      duration_label: durationLabel.trim(),
      songs: songs
        .filter((s) => s.label.trim() && s.youtube_url.trim())
        .map((s) => ({ role: s.role, label: s.label.trim(), youtube_url: s.youtube_url.trim(), note: s.note.trim() || null })),
      materials: materials.map((m) => m.trim()).filter(Boolean),
      steps: steps.map((s) => s.trim()).filter(Boolean)
    }
    try {
      if (mode === 'create') {
        const newId = await createLesson(input)
        navigate(`/lesson/${newId}`)
      } else if (id) {
        await updateLesson(id, input)
        navigate(`/lesson/${id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="mt-10 text-center text-sm text-navy/40">Loading…</p>

  return (
    <div className="mx-auto max-w-md px-5 pt-6 pb-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-softer text-navy/50"
      >
        <FiArrowLeft size={18} />
      </button>

      <h1 className="text-xl font-extrabold text-navy">{mode === 'create' ? 'New lesson' : 'Edit lesson'}</h1>

      <div className="mt-5 space-y-3">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>
        <Field label="Focus">
          <input value={focus} onChange={(e) => setFocus(e.target.value)} className="input" />
        </Field>
        <Field label="Duration">
          <input value={durationLabel} onChange={(e) => setDurationLabel(e.target.value)} className="input" placeholder="15–20 min" />
        </Field>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Songs</h2>
        <div className="space-y-3">
          {songs.map((song, i) => (
            <div key={i} className="rounded-card bg-card p-3 shadow-softer">
              <div className="mb-2 flex items-center justify-between">
                <select
                  value={song.role}
                  onChange={(e) => {
                    const next = [...songs]
                    next[i] = { ...song, role: e.target.value as SongRole }
                    setSongs(next)
                  }}
                  className="rounded-xl border border-navy/10 bg-white px-2 py-1 text-xs font-bold uppercase text-navy/60"
                >
                  <option value="hello">Hello</option>
                  <option value="theme">Theme</option>
                  <option value="goodbye">Goodbye</option>
                </select>
                <button onClick={() => setSongs(songs.filter((_, idx) => idx !== i))} className="text-coral/70" aria-label="Remove song">
                  <FiTrash2 size={15} />
                </button>
              </div>
              <input
                value={song.label}
                onChange={(e) => {
                  const next = [...songs]
                  next[i] = { ...song, label: e.target.value }
                  setSongs(next)
                }}
                placeholder="Song title"
                className="input mb-2"
              />
              <input
                value={song.youtube_url}
                onChange={(e) => {
                  const next = [...songs]
                  next[i] = { ...song, youtube_url: e.target.value }
                  setSongs(next)
                }}
                placeholder="https://www.youtube.com/watch?v=…"
                className="input mb-2"
              />
              <input
                value={song.note}
                onChange={(e) => {
                  const next = [...songs]
                  next[i] = { ...song, note: e.target.value }
                  setSongs(next)
                }}
                placeholder="Note (optional)"
                className="input"
              />
            </div>
          ))}
          <button
            onClick={() => setSongs([...songs, { role: 'theme', label: '', youtube_url: '', note: '' }])}
            className="flex w-full items-center justify-center gap-1 rounded-card border border-dashed border-navy/15 py-2.5 text-xs font-bold text-navy/45"
          >
            <FiPlus size={14} /> Add song
          </button>
        </div>
      </section>

      <ReorderableList title="Materials" items={materials} setItems={setMaterials} placeholder="e.g. Whiteboard and marker" />
      <ReorderableList title="Class steps" items={steps} setItems={setSteps} placeholder="e.g. Sing the Hello Song." multiline />

      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        className="mt-8 w-full rounded-pill bg-honey py-4 text-base font-extrabold text-white shadow-soft disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save lesson'}
      </button>

      <style>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(36,55,70,0.1);
          background: white;
          padding: 0.65rem 0.9rem;
          font-size: 0.9rem;
          color: #243746;
          outline: none;
        }
        .input:focus { border-color: #6F91A8; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/40">{label}</label>
      {children}
    </div>
  )
}

function ReorderableList({
  title,
  items,
  setItems,
  placeholder,
  multiline
}: {
  title: string
  items: string[]
  setItems: (v: string[]) => void
  placeholder: string
  multiline?: boolean
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">{title}</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-card bg-card p-2.5 shadow-softer">
            <div className="flex shrink-0 flex-col pt-1">
              <button onClick={() => setItems(move(items, i, i - 1))} disabled={i === 0} className="text-navy/30 disabled:opacity-20">
                <FiChevronUp size={14} />
              </button>
              <button onClick={() => setItems(move(items, i, i + 1))} disabled={i === items.length - 1} className="text-navy/30 disabled:opacity-20">
                <FiChevronDown size={14} />
              </button>
            </div>
            {multiline ? (
              <textarea
                value={item}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = e.target.value
                  setItems(next)
                }}
                placeholder={placeholder}
                rows={2}
                className="input flex-1"
              />
            ) : (
              <input
                value={item}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = e.target.value
                  setItems(next)
                }}
                placeholder={placeholder}
                className="input flex-1"
              />
            )}
            <button
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              className="shrink-0 pt-2 text-coral/70"
              aria-label="Remove"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setItems([...items, ''])}
          className="flex w-full items-center justify-center gap-1 rounded-card border border-dashed border-navy/15 py-2.5 text-xs font-bold text-navy/45"
        >
          <FiPlus size={14} /> Add
        </button>
      </div>
    </section>
  )
}
