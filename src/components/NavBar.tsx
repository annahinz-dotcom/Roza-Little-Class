import { NavLink } from 'react-router-dom'
import { FiBookOpen, FiUser, FiCalendar } from 'react-icons/fi'

const tabs = [
  { to: '/', label: 'Lessons', icon: FiBookOpen, end: true },
  { to: '/plan', label: 'Plan', icon: FiCalendar, end: false },
  { to: '/progress', label: 'Progress', icon: FiUser, end: false }
]

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-navy/5 bg-card/95 backdrop-blur px-6 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 shadow-soft">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 text-xs font-semibold transition-colors ${
                isActive ? 'text-honey-dark' : 'text-navy/45'
              }`
            }
          >
            <Icon size={22} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
