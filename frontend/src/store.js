/*
  This is our global state — like a shared variable box that
  every component can read from and write to.

  We use localStorage to save data so it survives page refresh.
  No external library needed — just plain JavaScript.

  HOW TO USE in any component:
    import { getProfile, setProfile } from '../store'
    const profile = getProfile()      // read
    setProfile({ age: '20', ... })    // write
*/

// ── Profile ────────────────────────────────────────────
export function getProfile() {
  const raw = localStorage.getItem('sm_profile')
  return raw ? JSON.parse(raw) : null
}

export function setProfile(profile) {
  localStorage.setItem('sm_profile', JSON.stringify(profile))
}

// ── Meal logs ──────────────────────────────────────────
export function getMealLogs() {
  const raw = localStorage.getItem('sm_logs')
  return raw ? JSON.parse(raw) : []
}

export function addMealLog(meal) {
  const logs = getMealLogs()
  const entry = {
    id:       Date.now(),                               // unique ID
    loggedAt: new Date().toISOString(),                 // full timestamp
    date:     new Date().toISOString().split('T')[0],   // YYYY-MM-DD
    ...meal,
  }
  logs.push(entry)
  localStorage.setItem('sm_logs', JSON.stringify(logs))
  return entry
}

// Returns total calories logged today
export function getTodayCalories() {
  const today = new Date().toISOString().split('T')[0]
  return getMealLogs()
    .filter(m => m.date === today)
    .reduce((sum, m) => sum + (m.calories || 0), 0)
}

// Returns today's meals only
export function getTodayMeals() {
  const today = new Date().toISOString().split('T')[0]
  return getMealLogs().filter(m => m.date === today)
}