import { useRef, useState } from 'react'
import { FiCamera, FiImage, FiX, FiCheck, FiRefreshCw, FiPlus } from 'react-icons/fi'
import { addMemory } from '../utils/memoriesApi'
import type { ClassMemory } from '../types'

type Stage = 'sheet' | 'preview'
type ItemStatus = 'pending' | 'uploading' | 'done' | 'error'

interface PendingItem {
  key: string
  file: File
  previewUrl: string
  caption: string
  status: ItemStatus
  errorMsg?: string
  saved?: ClassMemory
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg === 'unsupported-format') return "That file doesn't look like a photo."
  if (msg.toLowerCase().includes('exceed') || msg.toLowerCase().includes('too large')) return 'That photo is too large.'
  if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) return 'Connection interrupted — try again.'
  return "Couldn't save this photo — try again."
}

export default function MemoryCapture({
  open,
  onClose,
  sessionId,
  lessonId,
  stepId = null,
  onSaved
}: {
  open: boolean
  onClose: () => void
  sessionId: string
  lessonId: string | null
  stepId?: string | null
  onSaved: (memories: ClassMemory[]) => void
}) {
  const [stage, setStage] = useState<Stage>('sheet')
  const [items, setItems] = useState<PendingItem[]>([])
  const [saving, setSaving] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const libraryInputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const next: PendingItem[] = Array.from(fileList).map((file) => ({
      key: `${file.name}-${file.size}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      caption: '',
      status: 'pending'
    }))
    setItems((prev) => [...prev, ...next])
    setStage('preview')
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function updateCaption(key: string, caption: string) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, caption } : i)))
  }

  async function uploadOne(item: PendingItem) {
    setItems((prev) => prev.map((i) => (i.key === item.key ? { ...i, status: 'uploading', errorMsg: undefined } : i)))
    try {
      const saved = await addMemory({
        file: item.file,
        sessionId,
        lessonId,
        stepId,
        caption: item.caption.trim() || null
      })
      setItems((prev) => prev.map((i) => (i.key === item.key ? { ...i, status: 'done', saved } : i)))
      return saved
    } catch (err) {
      setItems((prev) =>
        prev.map((i) => (i.key === item.key ? { ...i, status: 'error', errorMsg: friendlyError(err) } : i))
      )
      return null
    }
  }

  async function handleSaveAll() {
    setSaving(true)
    const toUpload = items.filter((i) => i.status === 'pending' || i.status === 'error')
    const results = await Promise.all(toUpload.map(uploadOne))
    setSaving(false)
    const savedNow = results.filter((r): r is ClassMemory => !!r)
    if (savedNow.length > 0) onSaved(savedNow)

    const stillFailing = items.some((i) => i.status === 'error') && toUpload.some((i) => i.status !== 'done')
    // Re-check post-upload state on next tick isn't needed — if nothing is
    // left pending/error, we can close and reset.
    setTimeout(() => {
      setItems((current) => {
        const anyUnresolved = current.some((i) => i.status !== 'done')
        if (!anyUnresolved) {
          handleClose()
        }
        return current
      })
    }, 0)
  }

  function handleClose() {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl))
    setItems([])
    setStage('sheet')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40" onClick={stage === 'sheet' ? handleClose : undefined}>
      <div
        className="w-full max-w-md rounded-t-[28px] bg-cream p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {stage === 'sheet' && (
          <>
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-pill bg-navy/15" />
            <h2 className="mb-4 text-center text-base font-extrabold text-navy">Add a memory</h2>
            <div className="space-y-2">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-card bg-card p-4 text-left shadow-softer"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-dusty/15 text-dusty-dark">
                  <FiCamera size={18} />
                </span>
                <span className="font-semibold text-navy">Take a photo</span>
              </button>
              <button
                onClick={() => libraryInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-card bg-card p-4 text-left shadow-softer"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-honey/15 text-honey-dark">
                  <FiImage size={18} />
                </span>
                <span className="font-semibold text-navy">Choose from camera roll</span>
              </button>
              <button onClick={handleClose} className="w-full rounded-card py-3 text-center text-sm font-semibold text-navy/45">
                Cancel
              </button>
            </div>
          </>
        )}

        {stage === 'preview' && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-navy">
                {items.length} {items.length === 1 ? 'photo' : 'photos'}
              </h2>
              <button onClick={handleClose} className="text-navy/40" aria-label="Close">
                <FiX size={20} />
              </button>
            </div>

            <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 rounded-card bg-card p-2.5 shadow-softer">
                  <img src={item.previewUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <input
                      value={item.caption}
                      onChange={(e) => updateCaption(item.key, e.target.value)}
                      placeholder="Add a caption (optional)"
                      disabled={item.status === 'uploading' || item.status === 'done'}
                      className="w-full rounded-xl border border-navy/10 bg-white px-3 py-1.5 text-xs outline-none focus:border-dusty disabled:opacity-60"
                    />
                    {item.status === 'error' && <p className="mt-1 text-[11px] font-semibold text-coral">{item.errorMsg}</p>}
                    {item.status === 'done' && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-sage">
                        <FiCheck size={11} /> Saved
                      </p>
                    )}
                  </div>
                  {item.status === 'done' ? null : item.status === 'uploading' ? (
                    <span className="shrink-0 self-center text-[11px] font-semibold text-navy/40">Saving…</span>
                  ) : item.status === 'error' ? (
                    <button onClick={() => uploadOne(item)} className="shrink-0 self-center text-coral" aria-label="Retry">
                      <FiRefreshCw size={16} />
                    </button>
                  ) : (
                    <button onClick={() => removeItem(item.key)} className="shrink-0 self-center text-navy/30" aria-label="Remove">
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => libraryInputRef.current?.click()}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-card border border-dashed border-navy/15 py-2.5 text-xs font-bold text-navy/45"
            >
              <FiPlus size={14} /> Add more
            </button>

            <div className="mt-4 flex gap-3">
              <button onClick={handleClose} className="flex-1 rounded-pill border border-navy/10 py-3 text-sm font-semibold text-navy/60">
                {items.every((i) => i.status === 'done') ? 'Done' : 'Cancel'}
              </button>
              {!items.every((i) => i.status === 'done') && (
                <button
                  onClick={handleSaveAll}
                  disabled={saving || items.length === 0}
                  className="flex-1 rounded-pill bg-honey py-3 text-sm font-extrabold text-white shadow-soft disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              )}
            </div>
          </>
        )}

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <input
          ref={libraryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}
