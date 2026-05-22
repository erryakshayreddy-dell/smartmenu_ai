/*
  ALL fetch calls to the backend live in this one file.
  Components never write fetch() directly.
  If the URL changes, you fix it here — not in 10 different places.
*/

// In development: localhost:5000 (Person B's Flask server)
// In production: your Render URL (changed on Day 7)
const BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
/*
  Helper function — every API call goes through this.
  It handles the repetitive parts: setting headers, parsing JSON,
  and throwing an error if the server returns a failure status.
*/
async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await response.json()
  if (!response.ok) {
    // Throw the server's error message so components can catch it
    throw new Error(data.error || 'Server error')
  }
  return data
}

// Save user profile
export const saveProfile = (profile) =>
  request('/api/profile', { method: 'POST', body: JSON.stringify(profile) })

// Get AI recommendation for a menu
export const getRecommendation = (menu, profile) =>
  request('/api/recommend', {
    method: 'POST',
    body: JSON.stringify({ menu, profile }),
  })

// Log a meal
export const logMeal = (meal) =>
  request('/api/log', { method: 'POST', body: JSON.stringify(meal) })

// Get today's meal log
export const getTodayLog = () => request('/api/log/today')

// Get weekly calorie data
export const getWeeklyLog = () => request('/api/log/week')

// Get mess plan
export const getMessPlan = (weeklyMenu, profile) =>
  request('/api/mess-plan', {
    method: 'POST',
    body: JSON.stringify({ weekly_menu: weeklyMenu, profile }),
  })