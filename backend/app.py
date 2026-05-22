from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os, json, re
from datetime import datetime, timedelta
from collections import defaultdict

load_dotenv()   # reads .env file into environment variables

app = Flask(__name__)
CORS(app)       # allows React (localhost:5173) to call this server

# Initialize Gemini client using key from .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")
# ── File-based storage ─────────────────────────────────────────────────
# We save to .json files instead of a database.
# Simple, works fine for this project.
PROFILE_FILE = "profiles.json"
LOGS_FILE    = "logs.json"

def read_json(filename: str) -> dict:
    """Read a JSON file and return its contents. Returns empty dict if file doesn't exist."""
    if not os.path.exists(filename):
        return {}
    with open(filename, "r") as f:
        return json.load(f)

def write_json(filename: str, data: dict):
    """Write data to a JSON file, creating it if it doesn't exist."""
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

# ── Calorie calculator ─────────────────────────────────────────────────
def calc_calorie_target(profile: dict) -> int:
    """
    Mifflin-St Jeor equation — the formula used by real nutritionists.
    Returns the user's recommended daily calorie intake.
    """
    try:
        w = float(profile.get("weight", 65))   # kg
        h = float(profile.get("height", 170))  # cm
        a = float(profile.get("age",    20))   # years
        g = profile.get("gender", "male")

        # BMR = calories burned at rest (just being alive)
        bmr = (10*w + 6.25*h - 5*a + 5) if g == "male" else (10*w + 6.25*h - 5*a - 161)

        # TDEE = BMR × activity multiplier
        # 1.55 = moderate activity (typical student lifestyle)
        tdee = bmr * 1.55

        goal = profile.get("goal", "maintenance")
        if goal == "weight_loss":  return int(tdee - 400)
        if goal == "muscle_gain":  return int(tdee + 250)
        return int(tdee)
    except (ValueError, TypeError):
        return 2000  # safe default

# ── Rate limiter ───────────────────────────────────────────────────────
# Prevents someone from spamming your Claude API and draining your credits
_request_log = defaultdict(list)

def is_rate_limited(ip: str, max_per_min: int = 10) -> bool:
    now    = datetime.now()
    cutoff = now - timedelta(minutes=1)
    # Remove timestamps older than 1 minute
    _request_log[ip] = [t for t in _request_log[ip] if t > cutoff]
    if len(_request_log[ip]) >= max_per_min:
        return True
    _request_log[ip].append(now)
    return False

# ── Health check ───────────────────────────────────────────────────────
@app.route("/health")
def health():
    return jsonify({"status": "ok", "message": "SmartMenu backend running"})

# ── Profile routes ─────────────────────────────────────────────────────
@app.route("/api/profile", methods=["POST"])
def save_profile():
    data = request.json
    if not data:
        return jsonify({"error": "No data sent"}), 400

    # Validate required fields
    for field in ["age", "weight", "height", "diet", "goal"]:
        if not data.get(field):
            return jsonify({"error": f"Missing field: {field}"}), 422

    # Calculate calorie target and attach it to profile
    data["calorieTarget"] = calc_calorie_target(data)

    profiles = read_json(PROFILE_FILE)
    profiles["user1"] = data
    write_json(PROFILE_FILE, profiles)

    print(f"Profile saved → goal={data['goal']}, cal_target={data['calorieTarget']}")
    return jsonify({"status": "saved", "profile": data}), 201

@app.route("/api/profile", methods=["GET"])
def get_profile():
    profiles = read_json(PROFILE_FILE)
    profile  = profiles.get("user1")
    if not profile:
        return jsonify({"error": "No profile found"}), 404
    return jsonify({"profile": profile})

# ── AI recommendation ──────────────────────────────────────────────────
@app.route("/api/recommend", methods=["POST"])
def recommend():
    # Rate limit check
    if is_rate_limited(request.remote_addr):
        return jsonify({"error": "Too many requests. Wait a minute."}), 429

    data    = request.json
    menu    = data.get("menu", "").strip()
    profile = data.get("profile", {})

    if not menu:
        return jsonify({"error": "Menu cannot be empty"}), 400
    if len(menu) > 3000:
        menu = menu[:3000]  # trim to save API cost

    target = calc_calorie_target(profile)

    prompt = f"""You are SmartMenu AI — a personal nutrition assistant for Indian students.

USER PROFILE:
- Age: {profile.get("age","?")} | Weight: {profile.get("weight","?")} kg | Height: {profile.get("height","?")} cm
- Diet: {profile.get("diet","any")} | Allergies: {profile.get("allergies","none")}
- Goal: {profile.get("goal","maintenance")} | Daily budget: ₹{profile.get("budget",100)}
- Daily calorie target: {target} kcal

MENU:
{menu}

YOUR JOB:
- Recommend the best meal for this user's diet and goal
- Suggest smart swaps (healthier alternatives from the SAME menu)
- Flag items to avoid with clear reasons
- Find the best value option within their budget
- Never suggest non-vegetarian items to a vegetarian user
- Never suggest items matching their allergies
- Keep all reasons to 1 short sentence

Respond ONLY with valid JSON, no text before or after:
{{
  "best_meal": {{
    "items": ["Dal Rice", "Sambar"],
    "total_calories": 430,
    "reason": "High protein, fits weight loss calorie target, fully vegetarian"
  }},
  "avoid": [
    {{"item": "Fried Rice", "reason": "180 extra calories from oil with little nutrition gain"}}
  ],
  "smart_swaps": [
    {{"from": "Fried Rice", "to": "Steamed Rice", "calories_saved": 180}}
  ],
  "nutrition": {{"calories": 430, "protein": 16, "carbs": 72, "fat": 6}},
  "budget_pick": {{
    "items": ["Dal Rice", "Roti"],
    "total_cost": 75,
    "value_note": "Best protein per rupee on this menu"
  }}
}}"""

    try:
        response = model.generate_content(prompt)
        raw = response.text
        # Strip markdown fences Claude sometimes adds
        raw = re.sub(r"```json|```", "", raw).strip()
        result = json.loads(raw)
        return jsonify({"status": "success", "data": result})

    except json.JSONDecodeError:
        return jsonify({"status": "success", "data": {"raw": raw}})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Mess plan ──────────────────────────────────────────────────────────
@app.route("/api/mess-plan", methods=["POST"])
def mess_plan():
    if is_rate_limited(request.remote_addr, max_per_min=5):
        return jsonify({"error": "Too many requests. Wait a minute."}), 429

    data    = request.json
    weekly  = data.get("weekly_menu", {})
    profile = data.get("profile", {})

    menu_str = "\n".join(
        f"{day}: B={v.get('breakfast','')} | L={v.get('lunch','')} | D={v.get('dinner','')}"
        for day, v in weekly.items()
    )

    prompt = f"""You are SmartMenu AI — a nutrition assistant for Indian hostel students.

STUDENT PROFILE:
- Diet type: {profile.get("diet", "vegetarian")}
- Health goal: {profile.get("goal", "maintenance")}
- Age: {profile.get("age", "?")} | Weight: {profile.get("weight", "?")} kg
- Daily calorie target: {calc_calorie_target(profile)} kcal
- Allergies: {profile.get("allergies", "none")}

THEIR HOSTEL MENU THIS WEEK:
{menu_str}

YOUR JOB:
1. Look at every meal across all 7 days
2. Find the BEST day — the day whose meals best match the student's goal and diet
3. Find the WORST day — the day with the least healthy or least suitable meals
4. Write a short specific tip for EACH day (1-2 sentences max)
   - The tip MUST mention actual food items from that day's menu by name
   - The tip MUST give a clear action: "choose X over Y" or "add X to your lunch"
   - Never write a generic tip like "eat more protein" without naming a specific dish
5. Write a weekly insight — one pattern you noticed across the whole week

RULES:
- Never suggest non-vegetarian food to a vegetarian student
- Never suggest food matching their allergies
- Keep every tip practical and specific to the actual menu items listed
- If a day has empty fields, say "No menu listed for this day"

Reply ONLY with this exact JSON structure, no text before or after:
{{
  "best_day": "Monday",
  "worst_day": "Friday",
  "daily_tips": {{
    "Monday": "Your lunch looks great — dal rice is high protein and fits your goal. Add a banana from the canteen for potassium.",
    "Tuesday": "The puri at breakfast adds 300 unnecessary calories. Choose the idli instead — same satisfaction, 150 fewer calories.",
    "Wednesday": "Good balanced day. The sambar at lunch gives iron which vegetarians often miss.",
    "Thursday": "Fried rice at dinner is your main concern today — swap it for steamed rice to save 180 kcal.",
    "Friday": "Three high-carb meals with no protein source today. Ask the mess for an extra dal portion.",
    "Saturday": "Upma breakfast is excellent — high fibre, low fat. Solid day overall.",
    "Sunday": "No menu listed for Sunday."
  }},
  "weekly_insight": "Your protein intake drops significantly on weekdays. Try to always pick dal, curd, or eggs when they appear on the menu."
}}"""

    try:
        response = model.generate_content(prompt)
        raw = response.text
        raw = re.sub(r"```json|```", "", raw).strip()
        result = json.loads(raw)
        return jsonify({"status": "success", "data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Meal log routes ────────────────────────────────────────────────────
@app.route("/api/log", methods=["POST"])
def log_meal():
    data = request.json
    if not data:
        return jsonify({"error": "No data"}), 400

    logs = read_json(LOGS_FILE)
    if "entries" not in logs:
        logs["entries"] = []

    entry = {
        "id":       len(logs["entries"]) + 1,
        "loggedAt": datetime.now().isoformat(),
        "date":     datetime.now().strftime("%Y-%m-%d"),
        **data
    }
    logs["entries"].append(entry)
    write_json(LOGS_FILE, logs)
    return jsonify({"status": "logged", "entry": entry}), 201

@app.route("/api/log/today", methods=["GET"])
def today_log():
    logs  = read_json(LOGS_FILE)
    today = datetime.now().strftime("%Y-%m-%d")
    today_entries = [e for e in logs.get("entries", []) if e.get("date") == today]
    total = sum(e.get("calories", 0) for e in today_entries)
    return jsonify({"meals": today_entries, "total_calories": total})

@app.route("/api/log/week", methods=["GET"])
def week_log():
    logs   = read_json(LOGS_FILE)
    by_day = defaultdict(int)
    for e in logs.get("entries", []):
        by_day[e.get("date", "")] += e.get("calories", 0)

    result = []
    for i in range(6, -1, -1):
        d = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        result.append({"date": d, "calories": by_day.get(d, 0)})
    return jsonify({"weekly": result})

if __name__ == "__main__":
    # Validate API key exists before starting
    if not os.getenv("GEMINI_API_KEY"):
        raise ValueError("GEMINI_API_KEY not found in .env file!")

    print("SmartMenu backend starting at http://localhost:5000")

    app.run(debug=True, port=5000, host="0.0.0.0")