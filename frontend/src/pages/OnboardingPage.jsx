import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveProfile } from '../api'
import { setProfile } from '../store'

/*
  React component = a function that returns JSX (HTML-like syntax).
  useState(value) = creates a variable that React watches.
    When it changes, React re-renders the component.
  useNavigate() = lets you move to a different page programmatically.
*/

// The shape of our form data — all fields start empty
const INITIAL_FORM = {
  age:       '',
  weight:    '',
  height:    '',
  gender:    'male',
  diet:      'vegetarian',
  allergies: '',
  budget:    '100',
  goal:      '',
}

export default function OnboardingPage() {
  const navigate = useNavigate()

  // Current wizard step (1, 2, or 3)
  const [step, setStep] = useState(1)

  // All form field values in one object
  const [form, setForm] = useState(INITIAL_FORM)

  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  /*
    update(field, value) updates just one field.
    ...f means "keep everything else the same".
    e.g. update('age', '21') → { ...form, age: '21' }
  */
  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  // Go to next step — with basic validation
  const nextStep = () => {
    if (step === 1) {
      if (!form.age || !form.weight || !form.height) {
        setError('Please fill in all fields.')
        return
      }
    }
    if (step === 2 && !form.diet) {
      setError('Please select a diet type.')
      return
    }
    setError('')
    setStep(s => s + 1)
  }

  // Submit the form — sends to Flask backend
  const submit = async () => {
    if (!form.goal) {
      setError('Please select a health goal.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await saveProfile(form)    // calls api.js → Flask /api/profile
      setProfile(result.profile)                // saves to localStorage via store.js
      navigate('/menu')                         // redirect to the menu page
    } catch (err) {
      setError(err.message || 'Could not save profile. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  // Progress bar width (33%, 66%, 100%)
  const progressWidth = `${Math.round((step / 3) * 100)}%`

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {step === 1 && 'Tell us about yourself'}
          {step === 2 && 'Your diet preferences'}
          {step === 3 && 'Your health goal'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">Step {step} of 3</p>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
          <div
            className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>

        {/* ── Step 1: Basics ────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            {[
              { label: 'Age',          id: 'age',    type: 'number', placeholder: 'e.g. 20' },
              { label: 'Weight (kg)',  id: 'weight', type: 'number', placeholder: 'e.g. 65' },
              { label: 'Height (cm)', id: 'height', type: 'number', placeholder: 'e.g. 170' },
            ].map(({ label, id, type, placeholder }) => (
              <div key={id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[id]}
                  onChange={e => update(id, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={e => update('gender', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}

        {/* ── Step 2: Diet ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diet type</label>
              <select
                value={form.diet}
                onChange={e => update('diet', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="jain">Jain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies <span className="text-gray-400 font-normal">(leave blank if none)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. peanuts, dairy, gluten"
                value={form.allergies}
                onChange={e => update('allergies', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily food budget (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={form.budget}
                onChange={e => update('budget', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {/* ── Step 3: Goal ──────────────────────────────── */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'weight_loss',  emoji: '⬇', title: 'Weight Loss',  desc: 'Calorie deficit, fat burn' },
              { value: 'maintenance',  emoji: '=',  title: 'Maintenance',  desc: 'Stay at current weight' },
              { value: 'muscle_gain',  emoji: '⬆', title: 'Muscle Gain',  desc: 'More protein, calorie surplus' },
            ].map(goal => (
              <button
                key={goal.value}
                onClick={() => update('goal', goal.value)}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                  ${form.goal === goal.value
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-brand-300'
                  }
                `}
              >
                <span className="text-2xl">{goal.emoji}</span>
                <div>
                  <div className="font-medium text-gray-900">{goal.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{goal.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="flex-1 bg-brand-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-brand-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Profile ✓'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}