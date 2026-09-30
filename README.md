# 🏢 PropertyIQ | Real Estate Investment Portal

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Genkit](https://img.shields.io/badge/Firebase-Genkit_%2B_Gemini-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0%2B-38BDF8?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**PropertyIQ** is a sophisticated, AI-powered real estate investment analysis platform built to help investors make data-driven decisions with absolute precision.

---

## ✨ Key Features

* **AI Investment Analysis:** Leverage Firebase Genkit-powered AI to analyze property listings, identify hidden opportunities, and comprehensively assess risks.
* **Portfolio Dashboard:** Visualize portfolio performance, rental yields, and growth trends with dynamic, interactive charts.
* **Financial Simulators:** 
  * **ROI Calculator:** Estimate cash-on-cash returns and annual cash flow based on detailed purchase inputs.
  * **Mortgage Simulator:** Model principal and interest payments with adjustable loan terms and parameters.
* **Market Intelligence:** Generate AI-driven market trend reports tailored to specific regions and property classes.
* **Property Directory:** Browse curated investment listings featuring high-yield potential.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **AI Engine:** Firebase Genkit with Google Gemini
* **Backend, Database & Auth:** Firebase
* **UI Components:** Shadcn UI & Lucide React Icons
* **Styling:** Tailwind CSS
* **Data Visualization:** Recharts

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone github repo
cd property-iq
```

### 2. Install Dependencies

```Bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a .env.local file in the root directory and add your Firebase and Genkit configuration keys:   

```Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
GEMINI_API_KEY=your_gemini_api_key
```

4. Run Development Server

```Bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open http://localhost:3000 in your browser to explore the PropertyIQ portal.
