import { useEffect, useRef, useState, type ReactNode, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiTrash2, FiChevronUp, FiChevronDown, FiImage, FiX } from 'react-icons/fi'
import { fetchLessonFull, createLesson, updateLesson, uploadCustomVisual } from '../utils/api'
import type { SongRole } from '../types'
import ActivityVisual, { ACTIVITY_VISUAL_OPTIONS, suggestActivityVisualKey, getActivityVisualLabel } from '../components/activityVisuals'

interface SongDraft {
  role: SongRole
  label: string
  youtube_url: string
  note: string
}

interface StepDraft {
  content: string
  activityVisualKey: string | null
  customVisualUrl: string | null
  suggested?: boolean // true until the parent has confirmed/changed the auto-suggestion
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
  const [steps, setSteps] = useState<StepDraft[]>([{ content: '', activityVisualKey: null, customVisualUrl: null }])
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
        setSteps(
          l.steps.length > 0
            ? l.steps.map((s) => ({
                content: s.content,
                activityVisualKey: s.activity_visual_key,
                customVisualUrl: s.custom_visual_url
              }))
            : [{ content: '', activityVisualKey: null, customVisualUrl: null }]
        )
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
      steps: steps
        .filter((s) => s.content.trim())
        .map((s) => ({
          content: s.content.trim(),
          activityVisualKey: s.activityVisualKey,
          customVisualUrl: s.customVisualUrl
        }))
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

      <StepsEditor steps={steps} setSteps={setSteps} />

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

function StepsEditor({ steps, setSteps }: { steps: StepDraft[]; setSteps: (v: StepDraft[]) => void }) {
  const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null)

  function updateStep(i: number, patch: Partial<StepDraft>) {
    const next = [...steps]
    next[i] = { ...next[i], ...patch }
    setSteps(next)
  }

  function handleContentChange(i: number, value: string) {
    const step = steps[i]
    // Only auto-suggest while the parent hasn't manually picked or confirmed a
    // visual for this step yet — never overwrite a deliberate choice.
    const shouldAutoSuggest = !step.activityVisualKey || step.suggested
    const nextVisual = shouldAutoSuggest ? suggestActivityVisualKey(value) : step.activityVisualKey
    updateStep(i, { content: value, activityVisualKey: nextVisual, suggested: shouldAutoSuggest ? true : step.suggested })
  }

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Class steps</h2>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="rounded-card bg-card p-2.5 shadow-softer">
            <div className="flex items-start gap-2">
              <div className="flex shrink-0 flex-col pt-1">
                <button onClick={() => setSteps(move(steps, i, i - 1))} disabled={i === 0} className="text-navy/30 disabled:opacity-20">
                  <FiChevronUp size={14} />
                </button>
                <button
                  onClick={() => setSteps(move(steps, i, i + 1))}
                  disabled={i === steps.length - 1}
                  className="text-navy/30 disabled:opacity-20"
                >
                  <FiChevronDown size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPickerOpenIndex(pickerOpenIndex === i ? null : i)}
                className="shrink-0"
                aria-label="Choose activity visual"
              >
                <ActivityVisual activityKey={step.activityVisualKey} customUrl={step.customVisualUrl} size={52} />
              </button>

              <textarea
                value={step.content}
                onChange={(e) => handleContentChange(i, e.target.value)}
                placeholder="e.g. Sing the Hello Song."
                rows={2}
                className="input flex-1"
              />

              <button
                onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
                className="shrink-0 pt-2 text-coral/70"
                aria-label="Remove step"
              >
                <FiTrash2 size={15} />
              </button>
            </div>

            <div className="ml-[4.75rem] mt-1 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-navy/40">{getActivityVisualLabel(step.activityVisualKey)}</span>
              <button
                type="button"
                onClick={() => setPickerOpenIndex(pickerOpenIndex === i ? null : i)}
                className="text-[11px] font-bold text-dusty-dark underline underline-offset-2"
              >
                {pickerOpenIndex === i ? 'Close' : 'Change visual'}
              </button>
            </div>

            {pickerOpenIndex === i && (
              <VisualPicker
                step={step}
                onSelect={(key) => {
                  updateStep(i, { activityVisualKey: key, customVisualUrl: null, suggested: false })
                  setPickerOpenIndex(null)
                }}
                onCustomUpload={(url) => {
                  updateStep(i, { customVisualUrl: url, suggested: false })
                  setPickerOpenIndex(null)
                }}
              />
            )}
          </div>
        ))}
        <button
          onClick={() => setSteps([...steps, { content: '', activityVisualKey: null, customVisualUrl: null }])}
          className="flex w-full items-center justify-center gap-1 rounded-card border border-dashed border-navy/15 py-2.5 text-xs font-bold text-navy/45"
        >
          <FiPlus size={14} /> Add step
        </button>
      </div>
    </section>
  )
}

function VisualPicker({
  step,
  onSelect,
  onCustomUpload
}: {
  step: StepDraft
  onSelect: (key: string) => void
  onCustomUpload: (url: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadCustomVisual(file)
      onCustomUpload(url)
    } catch (err) {
      setError('Could not upload that image — check the lesson-visuals storage bucket exists.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-2 rounded-2xl border border-navy/10 bg-white p-3">
      <div className="grid grid-cols-5 gap-2">
        {ACTIVITY_VISUAL_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onSelect(opt.key)}
            className={`flex flex-col items-center gap-1 rounded-xl p-1 ${
              step.activityVisualKey === opt.key && !step.customVisualUrl ? 'bg-honey/15 ring-2 ring-honey' : ''
            }`}
            title={opt.label}
          >
            <ActivityVisual activityKey={opt.key} size={40} />
            <span className="line-clamp-1 text-center text-[9px] font-semibold text-navy/50">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-navy/5 pt-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-bold text-dusty-dark"
        >
          <FiImage size={14} /> {uploading ? 'Uploading…' : 'Upload custom image'}
        </button>
        {step.customVisualUrl && (
          <span className="flex items-center gap-1 text-xs font-semibold text-sage">
            Custom image set
            <FiX size={12} className="cursor-pointer" onClick={() => onCustomUpload('')} />
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-[11px] font-semibold text-coral">{error}</p>}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
