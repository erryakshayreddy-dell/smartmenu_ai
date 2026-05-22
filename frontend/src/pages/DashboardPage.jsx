import { useState, useEffect } from 'react'
import { getProfile, getTodayMeals, getTodayCalories, getMealLogs } from '../store'
import CalorieBar from '../components/CalorieBar'

export default function DashboardPage() {
  const profile  = getProfile()
  const target   = profile?.calorieTarget || 2000

  /*
    We use useState + useEffect to load fresh data when the page renders.
    useEffect runs the function inside it after the component renders.
    The empty [] means "run once when the page first loads".
  */
  const [consumed, setConsumed] = useState(0)
  const [meals,    setMeals]    = useState([])
  const [macros,   setMacros]   = useState({ protein: 0, carbs: 0, fat: 0 })
  const [weekly,   setWeekly]   = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const todayMeals = getTodayMeals()
    const todayCal   = getTodayCalories()

    // Sum macros for today
    const totals = todayMeals.reduce(
      (acc, m) => ({
        protein: acc.protein + (m.protein || 0),
        carbs:   acc.carbs   + (m.carbs   || 0),
        fat:     acc.fat     + (m.fat     || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    )

    setConsumed(todayCal)
    setMeals(todayMeals)
    setMacros(totals)

    // Build weekly chart data from localStorage
    const allLogs = getMealLogs()
    const weekData = []
    for (let i = 6; i >= 0; i--) {
      const d    = new Date()
      d.setDate(d.getDate() - i)
      const date = d.toISOString().split('T')[0]
      const cal  = allLogs
        .filter(m => m.date === date)
        .reduce((s, m) => s + (m.calories || 0), 0)
      weekData.push({
        label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        cal,
      })
    }
    setWeekly(weekData)
  }

  // Max calories in week (for bar height scaling)
  const maxCal = Math.max(...weekly.map(d => d.cal), target, 1)

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Today's Tracker</h1>
      <p className="text-gray-400 text-sm mb-6">{today}</p>

      {/* Calorie bar */}
      <CalorieBar consumed={consumed} target={target} />

      {/* Macro cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: 'Protein', value: macros.protein, color: 'text-blue-600',   bg: 'bg-blue-50'  },
          { label: 'Carbs',   value: macros.carbs,   color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Fat',     value: macros.fat,     color: 'text-orange-500', bg: 'bg-orange-50'},
        ].map(m => (
          <div key={m.label} className={`${m.bg} rounded-2xl p-4 text-center`}>
            <div className={`text-xl font-bold ${m.color}`}>{m.value}g</div>
            <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly bar chart — built with plain CSS bars */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-4">
        <p className="font-semibold text-sm text-gray-700 mb-4">This week</p>
        <div className="flex items-end justify-between gap-2 h-28">
          {weekly.map((d, i) => {
            const heightPct = maxCal > 0 ? (d.cal / maxCal) * 100 : 0
            const isOver    = d.cal > target
            const isToday   = i === 6
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs text-gray-400">{d.cal > 0 ? d.cal : ''}</span>
                <div className="w-full rounded-t-md relative" style={{ height: '80px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-md transition-all ${
                      isToday ? 'bg-brand-500' : isOver ? 'bg-red-300' : 'bg-brand-200'
                    }`}
                    style={{ height: `${heightPct}%`, minHeight: d.cal > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className={`text-xs font-medium ${isToday ? 'text-brand-600' : 'text-gray-400'}`}>
                  {d.label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-3 h-3 bg-brand-500 rounded-sm" />
          <span className="text-xs text-gray-400">today</span>
          <div className="w-3 h-3 bg-red-300 rounded-sm ml-3" />
          <span className="text-xs text-gray-400">over target</span>
        </div>
      </div>

      {/* Today's meals */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-gray-700">Meals logged today</p>
          <button
            onClick={loadData}
            className="text-xs text-brand-600 hover:text-brand-700"
          >
            Refresh
          </button>
        </div>

        {meals.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No meals yet. <a href="/menu" className="text-brand-600">Scan a menu →</a>
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {meals.map(m => (
              <div key={m.id} className="flex justify-between items-center py-2.5">
                <span className="text-sm text-gray-700">{m.name}</span>
                <span className="text-sm font-medium text-gray-400">{m.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}