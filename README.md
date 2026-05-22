# SmartMenu AI 🌿

AI-powered meal recommendations for any canteen or restaurant menu.

## Live Demo
🔗 https://smartmenuai.netlify.app

## What it does
- Set up a health profile (age, weight, diet, goal, budget)
- Upload any food menu as text or photo (OCR)
- Get instant AI meal picks personalised to your goals
- Smart swaps to save calories and money
- Daily calorie and macro tracker
- Hostel mess weekly planner

## Tech stack
- Frontend: React (Vite) + Tailwind CSS
- Backend:  Python Flask + Gemini API
- Storage:  JSON files (no database needed)
- Deploy:   Netlify (frontend) + Render (backend)

## Run locally

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Create .env with GEMINI_API_KEY=your_key
python app.py

### Frontend
cd frontend
npm install
npm run dev