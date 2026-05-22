import { useState } from 'react'
import { getProfile } from '../store'
import { getRecommendation } from '../api'
import ResultsPanel from '../components/ResultsPanel'

export default function MenuPage() {
  const profile = getProfile()

  const [menuText, setMenuText] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [ocrMsg,   setOcrMsg]   = useState('')
  const [result,   setResult]   = useState(null)
  const [error,    setError]    = useState('')

  // ── OCR: convert menu image → text ─────────────
  // Tesseract.js is loaded via CDN in index.html
  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setOcrMsg('Reading image... this takes about 10–15 seconds')
    setResult(null)

    /*
      Tesseract.recognize reads the image file and returns the text found in it.
      We use 'eng' for English. For Hindi menus, add 'hin'.
    */
    const { data: { text } } = await window.Tesseract.recognize(file, 'eng')
    setMenuText(text)
    setOcrMsg('✓ Text extracted! Review it above, then click Analyse.')
  }

  // ── Send menu to AI ─────────────────────────────
  const analyse = async () => {
    if (!menuText.trim()) {
      setError('Please paste a menu or upload a photo first.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await getRecommendation(menuText, profile)
      setResult(data.data)
    } catch (err) {
      setError(err.message || 'Could not get recommendation. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Scan a Menu</h1>
      <p className="text-gray-500 text-sm mb-6">
        Hello {profile?.diet} eater! Upload a photo or paste the menu text below.
      </p>

      {/* Image upload */}
      <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 transition-colors mb-4">
        <span className="text-gray-400 text-sm">
          📷 Click to upload a menu photo (JPG, PNG)
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />
      </label>

      {/* OCR status message */}
      {ocrMsg && (
        <p className={`text-sm mb-3 ${ocrMsg.startsWith('✓') ? 'text-green-600' : 'text-amber-600'}`}>
          {ocrMsg}
        </p>
      )}

      {/* Divider */}
      <p className="text-center text-gray-300 text-xs my-3">— or type/paste the menu —</p>

      {/* Text area */}
      <textarea
        value={menuText}
        onChange={e => setMenuText(e.target.value)}
        placeholder="e.g. Dal Rice ₹60, Paneer Butter Masala ₹120, Fried Rice ₹80, Roti ₹15..."
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none h-44 focus:outline-none focus:border-brand-500 transition-colors"
      />

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Analyse button */}
      <button
        onClick={analyse}
        disabled={loading || !menuText.trim()}
        className="mt-4 w-full bg-brand-600 text-white rounded-xl py-3.5 font-medium text-sm hover:bg-brand-700 disabled:opacity-40 transition-colors"
      >
        {loading ? 'AI is thinking...' : 'Get Recommendations →'}
      </button>

      {/* Loading spinner */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm mt-3">Reading your menu... usually 5–10 seconds</p>
        </div>
      )}

      {/* Results */}
      <ResultsPanel data={result} onLogged={() => setResult(null)} />
    </div>
  )
}