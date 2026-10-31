🔍 SHERLOX — The AI Detective Bureau

<p align="center">
<b>Turn complex history, corporate rivalries, and global mysteries into cinematic 3-minute classified case files.</b>
</p>

<p align="center">
<a href="https://sherlox-black.vercel.app">🔴 Live Demo</a> •
<a href="https://github.com/nk21-dev/SHERLOX">GitHub Repository</a>
</p>

<p align="center">
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss)
![AI](https://img.shields.io/badge/AI-Gemini%20%2B%20Groq-purple)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)
</p>

🕵️ About

SHERLOX is an AI-powered investigative storytelling platform that transforms any topic into an interactive, FBI-inspired classified case file.

Enter a mystery and get:

🎭 Suspect Lineup — Key people, organizations, and their roles.
🧵 Red-String Timeline — Three chronological milestones.
🚨 Smoking Gun — The critical event that changed everything.
🧠 Detective's Deduction — A sharp two-sentence conclusion.

From historical wars to corporate controversies, SHERLOX makes complex stories engaging and easy to understand.

⚡ Key Features
🎬 Cinematic video hero with forensic spotlight and ambient particles.
🤖 Dual AI engine with Gemini primary and Groq fallback.
📸 Real historical images fetched through Wikimedia Commons API.
📌 Interactive Polaroid-style evidence board with 3D red pins.
🃏 Animated three-card paradox deck.
🔴 Forensic bento grid with traveling red laser pulse.
🎞️ Horizontal scrolling evidence cards powered by Framer Motion.
💬 Follow-up investigation chat.
💾 Session persistence across page refreshes.
🏗️ Technical Architecture
1. Overall System Flow
mermaid
flowchart TD
    A["User Enters Mystery"] --> B["Next.js Frontend"]
    B --> C["/api/investigate"]
    C --> D["AI Investigation Engine"]
    D --> E["Structured JSON Response"]
    E --> F["Wikimedia Image API"]
    F --> G["Case File Assembly"]
    G --> H["Cinematic UI Rendering"]
    H --> I["Follow-up Chat"]
    I --> C

    style A fill:#222,stroke:#dc2626,color:#fff
    style H fill:#450a0a,stroke:#dc2626,color:#fff

2. Dual AI Engine — Automatic Failover

Gemini handles the primary investigation. Groq acts as the backup when the primary provider encounters an error or rate limit.

mermaid
flowchart TD
    A["Investigation Request"] --> B{"Gemini 2.0 Flash"}
    B -->|Success| D["Generate Case JSON"]
    B -->|Failure / 429| C["Groq Llama 3.3 70B"]
    C -->|Success| D
    C -->|Failure| E["Diagnostic Error"]
    D --> F["Wikimedia Image Retrieval"]
    F --> G["Render Case File"]

    style B fill:#1e3a8a,color:#fff
    style C fill:#164e63,color:#fff
    style G fill:#450a0a,stroke:#dc2626,color:#fff

3. Investigation Data Pipeline
mermaid
flowchart LR
    A["User Query"] --> B["AI Analysis"]
    B --> C["Case Title & Brief"]
    B --> D["Suspect Information"]
    B --> E["3 Timeline Events"]
    B --> F["Smoking Gun & Verdict"]
    B --> G["Image Search Queries"]
    G --> H["Wikimedia API"]
    C --> I["Final Case File"]
    D --> I
    E --> I
    F --> I
    H --> I
    I --> J["Frontend Display"]

🛠️ Tech Stack
Technology	Purpose
Next.js 15	Frontend & API routes
TypeScript	Type-safe development
Tailwind CSS	Styling
Framer Motion	Animations & transitions
Lucide React	Icons
Gemini 2.0 Flash	Primary AI engine
Groq – Llama 3.3 70B	Backup AI engine
Wikimedia Commons API	Historical images
Vercel	Deployment
📂 Project Structure
text
SHERLOX/
├── app/
│   ├── api/investigate/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── HeroSection.tsx
│   ├── MarqueeBanner.tsx
│   ├── ParadoxSection.tsx
│   ├── UVForensicScanner.tsx
│   ├── HorizontalFeatures.tsx
│   ├── CaseVault.tsx
│   ├── PreFooterCTA.tsx
│   ├── Footer.tsx
│   ├── CaseNote.tsx
│   ├── MultiPinnedPhotos.tsx
│   └── InvestigationView.tsx
├── lib/
│   └── wikimedia.ts
├── public/
│   ├── media/
│   └── media-features/
├── .env.local
└── package.json

🚀 Getting Started
1. Clone the repository
bash
git clone https://github.com/nk21-dev/SHERLOX.git
cd SHERLOX

2. Install dependencies
bash
npm install

3. Configure environment variables

Create a .env.local file:

env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key


Get your API keys:

Gemini: https://aistudio.google.com/
Groq: https://console.groq.com/
4. Run the development server
bash
npm run dev


Open http://localhost:3000 in your browser.

👨‍💻 Creator

Nithish Kumar Chirukuripati

GitHub: @nk21-dev
Email: nithishkumarchirukuripati21@gmail.com
⭐ Support

If you like SHERLOX, consider giving the repository a ⭐ on GitHub!

<p align="center">
<b>🔴 THE TRUTH IS BURIED. THE EVIDENCE IS WAITING.</b>
<br/>
<b>SHERLOX — CASE CLOSED. UNTIL THE NEXT MYSTERY.</b>
</p>
