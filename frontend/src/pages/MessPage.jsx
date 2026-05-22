import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../store'
import { getMessPlan } from '../api'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

// Empty week template
const emptyWeek = () =>
  Object.fromEntries(DAYS.map(d => [d, { breakfast: '', lunch: '', dinner: '' }]))

export default function MessPage() {
  const profile  = getProfile()
  const [menu,   setMenu]   = useState(emptyWeek())
  const [result, setResult] = useState(null)
  const [loading,setLoading]= useState(false)
  const [error,  setError]  = useState('')

  // Update one meal slot (e.g. Monday breakfast)
  const updateMeal = (day, mealType, value) => {
    setMenu(prev => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: value }
    }))
  }

  const submit = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await getMessPlan(menu, profile)
      setResult(data.data)
    } catch (err) {
      setError(err.message || 'Could not analyse. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Mess Planner</h1>
      <p className="text-gray-500 text-sm mb-6">
        Enter your hostel's weekly menu and get personalised daily tips
      </p>

      {/* 7-day grid */}
      <div className="space-y-4">
        {DAYS.map(day => (
          <div
            key={day}
            className={`bg-white border rounded-2xl p-4 transition-colors ${
              result?.best_day  === day ? 'border-green-300 bg-green-50' :
              result?.worst_day === day ? 'border-red-300 bg-red-50'   :
              'border-gray-100'
            }`}
          >
            {/* Day header */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-gray-800">{day}</p>
              {result?.best_day  === day && <span className="text-xs text-green-600 font-medium">★ Best day</span>}
              {result?.worst_day === day && <span className="text-xs text-red-600 font-medium">⚠ Worst day</span>}
            </div>

            {/* 3 meal inputs */}
            <div className="grid grid-cols-3 gap-2">
              {['breakfast','lunch','dinner'].map(meal => (
                <div key={meal}>
                  <label className="text-xs text-gray-400 capitalize">{meal}</label>
                  <input
                    type="text"
                    value={menu[day][meal]}
                    onChange={e => updateMeal(day, meal, e.target.value)}
                    placeholder={meal === 'breakfast' ? 'Idli, Dosa...' : meal === 'lunch' ? 'Dal Rice...' : 'Roti, Sabzi...'}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand-500 mt-0.5"
                  />
                </div>
              ))}
            </div>

            {/* AI tip for this day */}
            {result?.daily_tips?.[day] && (
              <p className="text-xs text-green-700 mt-2 pt-2 border-t border-green-200">
                💡 {result.daily_tips[day]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={loading}
        className="mt-6 w-full bg-brand-600 text-white rounded-xl py-3.5 font-medium text-sm hover:bg-brand-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Analysing your week...' : 'Analyse My Week →'}
      </button>

      {/* Weekly insight */}
      {result?.weekly_insight && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="font-semibold text-blue-800 text-sm mb-1">📊 Weekly insight</p>
          <p className="text-blue-700 text-sm">{result.weekly_insight}</p>
        </div>
      )}

    </div>
  )
}