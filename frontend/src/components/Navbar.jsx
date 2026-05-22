import { Link, useLocation } from 'react-router-dom'
import { getProfile } from '../store'

export default function Navbar() {
  const location = useLocation()
  const profile  = getProfile()

  // These are the nav links shown when a profile exists
  const links = [
    { to: '/menu',      label: 'Scan Menu' },
    { to: '/dashboard', label: 'Tracker'   },
    { to: '/mess',      label: 'Mess Plan' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-6">
      {/* Logo */}
      <Link to="/" className="font-bold text-lg text-brand-700 flex items-center gap-2">
        🌿 SmartMenu
      </Link>

      {/* Nav links — only show when profile is set up */}
      {profile && (
        <div className="flex gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === link.to
                  ? 'bg-brand-50 text-brand-700'        /* active */
                  : 'text-gray-500 hover:text-gray-800'  /* inactive */
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}