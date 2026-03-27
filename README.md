# SmartChef Fridge Scanner 🥘

**Turning leftovers into complete meals.**

SmartChef is a modern, AI-powered web dashboard that helps you discover what's in your fridge and what to cook with it. Using **Gemini 3 Flash Preview**, it identifies food items from photos and suggests creative, easy-to-follow recipes.

---

## ✨ Features

- **📸 AI Fridge Scanning**: High-resolution image analysis to detect fruits, vegetables, and pantry staples.
- **🪄 Instant Recipes**: AI-generated meal ideas based on detected ingredients.
- **📦 Inventory Sync**: Automatic storage of scanned items in a **Supabase** database.
- **⚡ Premium UI**: Features a custom scanning animation, dark mode support, and a sleek, responsive layout.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI**: [Google Generative AI](https://ai.google.dev/) (Gemini 3 Flash Preview)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Smart_Chef_Bebo
```

### 2. Environment Setup
Create a `.env.local` file in the root directory and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Open [**http://localhost:3000**](http://localhost:3000) to see the dashboard.

---

## 📂 Project Structure

```text
Smart_Chef_Bebo/
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions
│   │   │   ├── chef.ts       # Fridge vision logic
│   │   │   └── recipe.ts     # AI recipe generation
│   │   ├── page.tsx          # Main dashboard UI
│   │   └── globals.css       # Custom animations (scanner-line)
│   ├── lib/
│   │   └── supabase.ts       # DB Client initialization
│   └── components/
└── public/                   # Static assets
```

---

## 💡 Important Notes

- **Model ID**: This project currently uses `gemini-3-flash-preview` for optimal results in the current environment.
- **Supabase**: Ensure your database has an `inventory` table with a `name` column (text) to store scanned items.

---

## 📜 License
MIT License. Feel free to use and modify for your own fridge-scanning adventures!
