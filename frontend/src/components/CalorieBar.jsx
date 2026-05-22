/*
  Reusable progress bar component.
  Props:
  - consumed: calories eaten today (number)
  - target:   daily calorie target (number)
*/
export default function CalorieBar({ consumed, target }) {
  const pct = Math.min(100, Math.round((consumed / target) * 100))

  // Color changes based on how close to limit
  const barColor =
    pct > 95 ? 'bg-red-500' :
    pct > 80 ? 'bg-amber-500' :
    'bg-brand-500'

  const remaining = target - consumed

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Consumed</span>
        <span>Daily target</span>
      </div>
      <div className="flex justify-between font-bold text-lg mb-3">
        <span className="text-brand-600">{consumed} kcal</span>
        <span className="text-gray-400">{target} kcal</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-2 text-right">
        {remaining > 0
          ? `${remaining} kcal remaining`
          : `${Math.abs(remaining)} kcal over budget`
        }
      </p>
    </div>
  )
}