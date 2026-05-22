/*
  ALL fetch calls to the backend live in this one file.
  Components never write fetch() directly.
  If the URL changes, you fix it here — not in 10 different places.
*/

// In development: localhost:5000 (Person B's Flask server)
// In production: your Render URL (changed on Day 7)
const BASE = 'http://localhost:5000'

/*
  Helper function — every API call goes through this.
  It handles the repetitive parts: setting headers, parsing JSON,
  and throwing an error if the server returns a failure status.
*/
async function request(path, options = {}) {
  try {
    const response = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Server error')
    return data
  } catch (err) {
    // Network error (backend not running)
    if (err.name === 'TypeError') {
      throw new Error('Cannot reach server. Make sure the backend is running.')
    }
    throw err
  }
}
export async function saveProfile(profile) {
  return request('/api/profile', {
    method: 'POST',
    body: JSON.stringify(profile),
  })
}

export async function loadProfile() {
  return request('/api/profile')
}
export async function getRecommendation(payload) {
  return request('/api/recommend', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getMessPlan(payload) {
  return request('/api/mess-plan', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}