import { addMealLog } from '../store'
import toast from 'react-hot-toast'

/*
  This component receives the AI recommendation object (data prop)
  and renders it as cards.

  Props explained:
  - data: the JSON object Claude returned
  - onLogged: function to call after logging a meal (to update the UI)
*/
export default function ResultsPanel({ data, onLogged }) {
  if (!data) return null

  const meal   = data.best_meal    || {}
  const avoid  = data.avoid        || []
  const swaps  = data.smart_swaps  || []
  const budget = data.budget_pick  || null
  const nutrition = data.nutrition || {}

  const handleLog = () => {
  addMealLog({
    name: (meal.items || []).join(' + '),
    calories: nutrition.calories || 0,
    protein: nutrition.protein || 0,
    carbs: nutrition.carbs || 0,
    fat: nutrition.fat || 0,
  })

  if (onLogged) onLogged()

  toast.success('Meal logged! Check your Tracker.')
}
  return (
    <div className="space-y-4 mt-6">

      {/* Best meal card */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <p className="text-green-800 font-semibold text-sm mb-2">✅ Best meal for you</p>
        <p className="font-medium text-gray-900 text-base">
          {(meal.items || []).join(' + ')}
        </p>
        <p className="text-gray-500 text-sm mt-1">{meal.reason}</p>
        <p className="text-green-700 font-bold text-lg mt-2">
          ~{meal.total_calories} kcal
        </p>
        {/* Macro breakdown */}
        <div className="flex gap-4 mt-3">
          {[
            { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'text-blue-600'   },
            { label: 'Carbs',   value: nutrition.carbs,   unit: 'g', color: 'text-amber-600'  },
            { label: 'Fat',     value: nutrition.fat,     unit: 'g', color: 'text-orange-500' },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className={`font-semibold text-sm ${m.color}`}>{m.value}{m.unit}</div>
              <div className="text-xs text-gray-400">{m.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={handleLog}
          className="mt-4 w-full bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + Log this meal
        </button>
      </div>

      {/* Smart swaps */}
      {swaps.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-blue-800 font-semibold text-sm mb-3">💡 Smart swaps</p>
          <div className="space-y-2">
            {swaps.map((s, i) => (
              <div key={i} className="flex items-start justify-between">
                <div>
                  <span className="text-sm text-gray-700">
                    Try <strong>{s.to}</strong> instead of {s.from}
                  </span>
                  <div className="text-xs text-blue-600 mt-0.5">Save {s.calories_saved} kcal</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avoid list */}
      {avoid.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-red-800 font-semibold text-sm mb-3">⚠ Limit these</p>
          <div className="space-y-2">
            {avoid.map((a, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-gray-900">{a.item}</span>
                <span className="text-gray-500"> — {a.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget pick */}
      {budget && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-amber-800 font-semibold text-sm mb-2">₹ Best value pick</p>
          <p className="font-medium text-gray-900 text-sm">
            {(budget.items || []).join(' + ')}
          </p>
          <p className="text-amber-700 font-semibold mt-1">₹{budget.total_cost}</p>
          <p className="text-gray-500 text-xs mt-0.5">{budget.value_note}</p>
        </div>
      )}

    </div>
  )
}