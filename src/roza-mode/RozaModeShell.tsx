import { ReactNode } from 'react'
import { FiRotateCw } from 'react-icons/fi'
import AdultGate from './AdultGate'

export default function RozaModeShell({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-cream">
      {/* Gentle, non-blocking nudge toward landscape — iPad is the primary
          target, but nothing here hard-locks orientation (that API is
          unreliable in installed PWAs), so portrait still works. */}
      <div className="flex items-center justify-center gap-2 bg-honey/15 px-4 py-2 text-center text-sm font-semibold text-honey-dark [@media(orientation:landscape)]:hidden">
        <FiRotateCw size={16} />
        Obróć iPada, żeby wygodniej się bawić
      </div>

      <div
        className="mx-auto flex min-h-[calc(100%-2.5rem)] w-full max-w-5xl flex-col px-6 py-6 [@media(orientation:landscape)]:min-h-full"
        style={{
          paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
          paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          paddingTop: 'max(1.5rem, env(safe-area-inset-top))'
        }}
      >
        {children}
      </div>

      <AdultGate />
    </div>
  )
}
