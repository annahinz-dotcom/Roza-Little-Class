import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Lessons from './pages/Lessons'
import LessonDetail from './pages/LessonDetail'
import StartClass from './pages/StartClass'
import CheckIn from './pages/CheckIn'
import LessonForm from './pages/LessonForm'
import ArchivedLessons from './pages/ArchivedLessons'
import ProgressPage from './pages/Progress'
import PlanPage from './pages/Plan'
import ClassMemories from './pages/ClassMemories'
import NavBar from './components/NavBar'
import RozaModeHome from './roza-mode/RozaModeHome'
import WordPicker from './roza-mode/slowo/WordPicker'
import WordArrange from './roza-mode/slowo/WordArrange'
import KsztaltyPicker from './roza-mode/ksztalty/KsztaltyPicker'
import DopasujKsztalty from './roza-mode/ksztalty/DopasujKsztalty'
import ZnajdzKsztalt from './roza-mode/ksztalty/ZnajdzKsztalt'
import ZbudujKsztalt from './roza-mode/ksztalty/ZbudujKsztalt'
import Uczucia from './roza-mode/Uczucia'
import KoloryPoAngielsku from './roza-mode/KoloryPoAngielsku'

function ProtectedShell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream text-navy/60">
        Opening the class box…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={`min-h-screen bg-cream ${nav ? 'pb-24' : ''}`}>
      {children}
      {nav && <NavBar />}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedShell><Lessons /></ProtectedShell>} />
      <Route path="/archived" element={<ProtectedShell><ArchivedLessons /></ProtectedShell>} />
      <Route path="/progress" element={<ProtectedShell><ProgressPage /></ProtectedShell>} />
      <Route path="/memories" element={<ProtectedShell><ClassMemories /></ProtectedShell>} />
      <Route path="/plan" element={<ProtectedShell><PlanPage /></ProtectedShell>} />
      <Route path="/lesson/new" element={<ProtectedShell><LessonForm mode="create" /></ProtectedShell>} />
      <Route path="/lesson/:id" element={<ProtectedShell><LessonDetail /></ProtectedShell>} />
      <Route path="/lesson/:id/edit" element={<ProtectedShell><LessonForm mode="edit" /></ProtectedShell>} />
      <Route path="/lesson/:id/class" element={<ProtectedShell nav={false}><StartClass /></ProtectedShell>} />
      <Route path="/lesson/:id/checkin" element={<ProtectedShell nav={false}><CheckIn /></ProtectedShell>} />
      <Route path="/roza-mode" element={<ProtectedShell nav={false}><RozaModeHome /></ProtectedShell>} />
      <Route path="/roza-mode/slowo" element={<ProtectedShell nav={false}><WordPicker /></ProtectedShell>} />
      <Route path="/roza-mode/slowo/:wordId" element={<ProtectedShell nav={false}><WordArrange /></ProtectedShell>} />
      <Route path="/roza-mode/ksztalty" element={<ProtectedShell nav={false}><KsztaltyPicker /></ProtectedShell>} />
      <Route path="/roza-mode/ksztalty/dopasuj" element={<ProtectedShell nav={false}><DopasujKsztalty /></ProtectedShell>} />
      <Route path="/roza-mode/ksztalty/znajdz" element={<ProtectedShell nav={false}><ZnajdzKsztalt /></ProtectedShell>} />
      <Route path="/roza-mode/ksztalty/zbuduj" element={<ProtectedShell nav={false}><ZbudujKsztalt /></ProtectedShell>} />
      <Route path="/roza-mode/uczucia" element={<ProtectedShell nav={false}><Uczucia /></ProtectedShell>} />
      <Route path="/roza-mode/kolory" element={<ProtectedShell nav={false}><KoloryPoAngielsku /></ProtectedShell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
