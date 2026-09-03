import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchLessonFull, createSession } from '../utils/api'
import type { Engagement, Difficulty, WouldRepeat } from '../types'
import { ENGAGEMENT_LABELS, DIFFICULTY_LABELS, WOULD_REPEAT_LABELS } from '../types'
import Chip from '../components/Chip'

export default function CheckIn() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const materialsUsed: string[] = (location.state as any)?.materialsUsed ?? []

  const [lessonName, setLessonName] = useState('')
  const [engagement, setEngagement] = useState<Engagement | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [wouldRepeat, setWouldRepeat] = useState<WouldRepeat | null>(null)
  const [notes, setNotes] = useState('')
  const [favouriteActivity, setFavouriteActivity] = useState('')
  const [newWord, setNewWord] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchLessonFull(id).then((l) => setLessonName(l.name))
  }, [id])

  async function handleSave() {
    if (!id) return
    setSaving(true)
    await createSession({
      lesson_id: id,
      lesson_name_snapshot: lessonName,
      engagement,
      difficulty,
      would_repeat: wouldRepeat,
      notes: notes || null,
      favourite_activity: favouriteActivity || null,
      new_word_or_achievement: newWord || null,
      materials_used: materialsUsed.length > 0 ? materialsUsed : null
    })
    setSaving(false)
    navigate(`/lesson/${id}`)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cream px-5 pt-8 pb-10">
      <h1 className="text-xl font-extrabold text-navy">How did it go?</h1>
      <p className="mt-1 text-sm text-navy/50">{lessonName} — this takes less than a minute.</p>

      <div className="mt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Engagement</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ENGAGEMENT_LABELS) as Engagement[]).map((key) => (
            <Chip key={key} label={ENGAGEMENT_LABELS[key]} selected={engagement === key} onClick={() => setEngagement(key)} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Difficulty</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((key) => (
            <Chip key={key} label={DIFFICULTY_LABELS[key]} selected={difficulty === key} onClick={() => setDifficulty(key)} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-navy/40">Would repeat</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(WOULD_REPEAT_LABELS) as WouldRepeat[]).map((key) => (
            <Chip key={key} label={WOULD_REPEAT_LABELS[key]} selected={wouldRepeat === key} onClick={() => setWouldRepeat(key)} />
          ))}
        </div>
      </div>

      {!showMore ? (
        <button onClick={() => setShowMore(true)} className="mt-5 text-sm font-semibold text-dusty-dark underline underline-offset-2">
          Add a note (optional)
        </button>
      ) : (
        <div className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/40">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none focus:border-dusty"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/40">Favourite activity</label>
            <input
              value={favouriteActivity}
              onChange={(e) => setFavouriteActivity(e.target.value)}
              className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none focus:border-dusty"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-navy/40">New word / behaviour / achievement</label>
            <input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none focus:border-dusty"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 w-full rounded-pill bg-honey py-4 text-base font-extrabold text-white shadow-soft disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save & finish'}
      </button>
    </div>
  )
}
