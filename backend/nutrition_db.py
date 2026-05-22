"""
Nutrition database for common Indian foods.
Values are approximate per standard serving.
find_nutrition() does fuzzy matching — so "dal rice" matches "dal rice",
"rice with dal", "dal and rice", etc.
"""

NUTRITION_DB = {

    # =========================
    # RICE DISHES
    # =========================
    "dal rice":             {"cal": 350, "protein": 12, "carbs": 60, "fat": 4},
    "steamed rice":         {"cal": 240, "protein": 5,  "carbs": 50, "fat": 1},
    "fried rice":           {"cal": 420, "protein": 10, "carbs": 70, "fat": 12},
    "curd rice":            {"cal": 250, "protein": 7,  "carbs": 45, "fat": 5},
    "veg pulao":            {"cal": 280, "protein": 6,  "carbs": 52, "fat": 6},
    "jeera rice":           {"cal": 260, "protein": 5,  "carbs": 48, "fat": 5},
    "lemon rice":           {"cal": 300, "protein": 6,  "carbs": 52, "fat": 8},
    "tamarind rice":        {"cal": 320, "protein": 6,  "carbs": 56, "fat": 9},
    "coconut rice":         {"cal": 340, "protein": 5,  "carbs": 50, "fat": 13},
    "khichdi":              {"cal": 230, "protein": 8,  "carbs": 38, "fat": 5},
    "bisibele bath":        {"cal": 350, "protein": 10, "carbs": 58, "fat": 9},
    "veg biryani":          {"cal": 360, "protein": 8,  "carbs": 62, "fat": 10},
    "chicken biryani":      {"cal": 490, "protein": 28, "carbs": 55, "fat": 18},
    "mutton biryani":       {"cal": 550, "protein": 30, "carbs": 58, "fat": 24},
    "egg biryani":          {"cal": 430, "protein": 18, "carbs": 52, "fat": 16},
    "hyderabadi biryani":   {"cal": 520, "protein": 29, "carbs": 56, "fat": 21},

    # =========================
    # BREADS
    # =========================
    "roti":                 {"cal": 80,  "protein": 3,  "carbs": 15, "fat": 1},
    "butter roti":          {"cal": 110, "protein": 3,  "carbs": 15, "fat": 4},
    "naan":                 {"cal": 260, "protein": 8,  "carbs": 45, "fat": 6},
    "butter naan":          {"cal": 320, "protein": 9,  "carbs": 46, "fat": 11},
    "garlic naan":          {"cal": 300, "protein": 8,  "carbs": 45, "fat": 9},
    "paratha":              {"cal": 200, "protein": 5,  "carbs": 28, "fat": 8},
    "aloo paratha":         {"cal": 290, "protein": 7,  "carbs": 38, "fat": 12},
    "gobi paratha":         {"cal": 240, "protein": 6,  "carbs": 32, "fat": 10},
    "paneer paratha":       {"cal": 310, "protein": 12, "carbs": 30, "fat": 15},
    "puri":                 {"cal": 150, "protein": 3,  "carbs": 20, "fat": 7},
    "bhatura":              {"cal": 320, "protein": 8,  "carbs": 40, "fat": 14},
    "missi roti":           {"cal": 120, "protein": 5,  "carbs": 18, "fat": 3},

    # =========================
    # CURRIES & SABZI
    # =========================
    "paneer butter masala": {"cal": 320, "protein": 14, "carbs": 18, "fat": 22},
    "shahi paneer":         {"cal": 340, "protein": 13, "carbs": 16, "fat": 25},
    "kadai paneer":         {"cal": 280, "protein": 13, "carbs": 14, "fat": 19},
    "palak paneer":         {"cal": 260, "protein": 14, "carbs": 10, "fat": 18},
    "dal makhani":          {"cal": 220, "protein": 11, "carbs": 28, "fat": 8},
    "dal tadka":            {"cal": 180, "protein": 9,  "carbs": 24, "fat": 5},
    "rajma":                {"cal": 180, "protein": 9,  "carbs": 30, "fat": 3},
    "chana masala":         {"cal": 200, "protein": 10, "carbs": 32, "fat": 5},
    "aloo gobi":            {"cal": 170, "protein": 4,  "carbs": 22, "fat": 7},
    "bhindi masala":        {"cal": 160, "protein": 3,  "carbs": 14, "fat": 9},
    "baingan bharta":       {"cal": 140, "protein": 3,  "carbs": 12, "fat": 8},
    "mix veg curry":        {"cal": 190, "protein": 5,  "carbs": 18, "fat": 10},
    "malai kofta":          {"cal": 350, "protein": 9,  "carbs": 24, "fat": 24},
    "kofta curry":          {"cal": 330, "protein": 8,  "carbs": 20, "fat": 23},

    # =========================
    # NON-VEG
    # =========================
    "grilled chicken":      {"cal": 200, "protein": 35, "carbs": 0,  "fat": 5},
    "chicken curry":        {"cal": 290, "protein": 25, "carbs": 8,  "fat": 16},
    "butter chicken":       {"cal": 430, "protein": 28, "carbs": 12, "fat": 30},
    "tandoori chicken":     {"cal": 260, "protein": 32, "carbs": 4,  "fat": 12},
    "fish curry":           {"cal": 260, "protein": 24, "carbs": 6,  "fat": 15},
    "fish fry":             {"cal": 300, "protein": 26, "carbs": 8,  "fat": 18},
    "mutton curry":         {"cal": 380, "protein": 26, "carbs": 7,  "fat": 28},
    "egg curry":            {"cal": 220, "protein": 14, "carbs": 5,  "fat": 16},
    "boiled egg":           {"cal": 78,  "protein": 6,  "carbs": 1,  "fat": 5},
    "omelette":             {"cal": 150, "protein": 10, "carbs": 2,  "fat": 11},

    # =========================
    # SOUTH INDIAN
    # =========================
    "idli":                 {"cal": 58,  "protein": 2,  "carbs": 12, "fat": 0},
    "dosa":                 {"cal": 170, "protein": 4,  "carbs": 30, "fat": 4},
    "masala dosa":          {"cal": 320, "protein": 8,  "carbs": 48, "fat": 10},
    "rava dosa":            {"cal": 250, "protein": 5,  "carbs": 38, "fat": 8},
    "set dosa":             {"cal": 220, "protein": 5,  "carbs": 36, "fat": 6},
    "upma":                 {"cal": 180, "protein": 4,  "carbs": 28, "fat": 6},
    "pongal":               {"cal": 250, "protein": 7,  "carbs": 40, "fat": 7},
    "vada":                 {"cal": 180, "protein": 6,  "carbs": 18, "fat": 10},
    "medu vada":            {"cal": 190, "protein": 6,  "carbs": 20, "fat": 10},
    "sambar":               {"cal": 80,  "protein": 4,  "carbs": 12, "fat": 2},
    "rasam":                {"cal": 50,  "protein": 2,  "carbs": 8,  "fat": 1},
    "appam":                {"cal": 120, "protein": 2,  "carbs": 24, "fat": 2},
    "puttu":                {"cal": 220, "protein": 5,  "carbs": 42, "fat": 3},
    "avial":                {"cal": 160, "protein": 4,  "carbs": 14, "fat": 9},

    # =========================
    # MAHARASHTRIAN
    # =========================
    "poha":                 {"cal": 180, "protein": 4,  "carbs": 30, "fat": 5},
    "misal pav":            {"cal": 430, "protein": 12, "carbs": 52, "fat": 18},
    "pav bhaji":            {"cal": 400, "protein": 9,  "carbs": 50, "fat": 18},
    "sabudana khichdi":     {"cal": 350, "protein": 5,  "carbs": 58, "fat": 12},
    "thalipeeth":           {"cal": 220, "protein": 7,  "carbs": 30, "fat": 8},
    "modak":                {"cal": 160, "protein": 3,  "carbs": 28, "fat": 4},
    "bharli vangi":         {"cal": 190, "protein": 4,  "carbs": 14, "fat": 12},

    # =========================
    # GUJARATI
    # =========================
    "dhokla":               {"cal": 160, "protein": 6,  "carbs": 24, "fat": 4},
    "khandvi":              {"cal": 140, "protein": 5,  "carbs": 18, "fat": 5},
    "thepla":               {"cal": 130, "protein": 4,  "carbs": 18, "fat": 4},
    "undhiyu":              {"cal": 260, "protein": 8,  "carbs": 22, "fat": 15},
    "fafda":                {"cal": 290, "protein": 7,  "carbs": 24, "fat": 18},
    "handvo":               {"cal": 210, "protein": 8,  "carbs": 28, "fat": 7},

    # =========================
    # PUNJABI
    # =========================
    "chole bhature":        {"cal": 520, "protein": 14, "carbs": 58, "fat": 25},
    "sarson ka saag":       {"cal": 170, "protein": 5,  "carbs": 12, "fat": 10},
    "makki di roti":        {"cal": 150, "protein": 4,  "carbs": 28, "fat": 3},
    "lassi":                {"cal": 150, "protein": 7,  "carbs": 20, "fat": 4},

    # =========================
    # BENGALI
    # =========================
    "macher jhol":          {"cal": 240, "protein": 22, "carbs": 8,  "fat": 12},
    "shorshe ilish":        {"cal": 320, "protein": 24, "carbs": 5,  "fat": 22},
    "aloo posto":           {"cal": 210, "protein": 4,  "carbs": 20, "fat": 12},
    "rasgulla":             {"cal": 125, "protein": 3,  "carbs": 22, "fat": 3},
    "sandesh":              {"cal": 140, "protein": 5,  "carbs": 18, "fat": 5},

    # =========================
    # RAJASTHANI
    # =========================
    "dal baati":            {"cal": 420, "protein": 12, "carbs": 50, "fat": 18},
    "gatte ki sabzi":       {"cal": 260, "protein": 8,  "carbs": 18, "fat": 16},
    "ker sangri":           {"cal": 180, "protein": 5,  "carbs": 14, "fat": 10},

    # =========================
    # BIHARI
    # =========================
    "litti chokha":         {"cal": 380, "protein": 10, "carbs": 48, "fat": 15},
    "sattu paratha":        {"cal": 270, "protein": 11, "carbs": 34, "fat": 9},

    # =========================
    # KASHMIRI
    # =========================
    "rogan josh":           {"cal": 390, "protein": 28, "carbs": 6,  "fat": 28},
    "yakhni":               {"cal": 300, "protein": 24, "carbs": 5,  "fat": 20},

    # =========================
    # STREET FOOD
    # =========================
    "samosa":               {"cal": 260, "protein": 5,  "carbs": 32, "fat": 13},
    "pakora":               {"cal": 200, "protein": 4,  "carbs": 22, "fat": 11},
    "vada pav":             {"cal": 300, "protein": 8,  "carbs": 38, "fat": 13},
    "panipuri":             {"cal": 180, "protein": 4,  "carbs": 30, "fat": 5},
    "bhel puri":            {"cal": 220, "protein": 5,  "carbs": 40, "fat": 4},
    "sev puri":             {"cal": 270, "protein": 5,  "carbs": 34, "fat": 12},
    "dahi puri":            {"cal": 260, "protein": 6,  "carbs": 30, "fat": 11},
    "kachori":              {"cal": 280, "protein": 6,  "carbs": 32, "fat": 14},

    # =========================
    # DESSERTS
    # =========================
    "gulab jamun":          {"cal": 175, "protein": 3,  "carbs": 28, "fat": 6},
    "jalebi":               {"cal": 150, "protein": 1,  "carbs": 30, "fat": 4},
    "kheer":                {"cal": 220, "protein": 6,  "carbs": 32, "fat": 7},
    "halwa":                {"cal": 300, "protein": 4,  "carbs": 42, "fat": 12},
    "payasam":              {"cal": 240, "protein": 5,  "carbs": 34, "fat": 9},

    # =========================
    # DRINKS
    # =========================
    "chai":                 {"cal": 50,  "protein": 2,  "carbs": 6,  "fat": 2},
    "filter coffee":        {"cal": 80,  "protein": 3,  "carbs": 10, "fat": 3},
    "buttermilk":           {"cal": 40,  "protein": 2,  "carbs": 5,  "fat": 1},
    "masala chai":          {"cal": 70,  "protein": 2,  "carbs": 8,  "fat": 3},
    "badam milk":           {"cal": 180, "protein": 7,  "carbs": 18, "fat": 9},
}



def find_nutrition(food_name: str):
    """
    Try to find nutrition for a food by name.
    First tries exact match, then partial match.
    Returns dict or None if not found.
    """
    name = food_name.lower().strip()
    # Exact match
    if name in NUTRITION_DB:
        return NUTRITION_DB[name]
    # Partial match — "paneer masala" matches "paneer butter masala"
    for key, val in NUTRITION_DB.items():
        if key in name or name in key:
            return val
    return None