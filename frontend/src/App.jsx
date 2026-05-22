import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import OnboardingPage from './pages/OnboardingPage'
import MenuPage from './pages/MenuPage'
import DashboardPage from './pages/DashboardPage'
import MessPage from './pages/MessPage'
import { getProfile } from './store'

/*
  ProtectedRoute: if the user hasn't filled their profile yet,
  redirect them to the onboarding page instead of showing the requested page.
  This prevents crashes from undefined profile data.
*/
function ProtectedRoute({ children }) {
  const profile = getProfile()
  if (!profile) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar shows on every page */}
      <Navbar />

      <Routes>
        {/* / redirects to /onboarding if no profile, else /menu */}
        <Route
          path="/"
          element={
            getProfile()
              ? <Navigate to="/menu" replace />
              : <Navigate to="/onboarding" replace />
          }
        />

        {/* Public — anyone can visit */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected — need a profile */}
        <Route path="/menu"      element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/mess"      element={<ProtectedRoute><MessPage /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
