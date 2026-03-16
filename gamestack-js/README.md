# gamestack-js — Narrative-to-Game Pipeline

Transform a book chapter into a turn-based narrative game using Gemini AI and Three.js.

## Setup

```bash
# 1. Copy env file and add your Gemini API key
cp .env.example server/.env
# Edit server/.env and set GEMINI_API_KEY

# 2. Install dependencies
npm install

# 3. Start both server and client in dev mode
npm run dev
```

- Frontend: http://localhost:5173
- API server: http://localhost:3001

## Architecture

```
gamestack-js/
├── server/          Express API server (Gemini calls stay here)
│   └── src/
│       ├── index.js          Entry point
│       ├── gemini.js         Gemini SDK wrapper
│       └── routes/
│           └── narrative.js  POST /narrative/analyze, /narrative/consequence
└── client/          React + Vite frontend
    └── src/
        ├── App.jsx                Root state machine (input → loading → game)
        ├── lib/api.js             Fetch wrappers for narrative endpoints
        └── components/
            ├── ChapterInput.jsx   Paste/upload screen (Task 3)
            ├── DebugOverlay.jsx   Raw JSON debug panel (dev only)
            ├── GameScreen.jsx     Split-panel game UI (Task 4)
            └── ThreeScene.jsx     Adaptive Three.js environment (Task 5)
```

## Setting Types

Five distinct Three.js environments: `forest`, `urban`, `interior`, `ocean`, `void`

Each has unique geometry, lighting, fog density, background color, and particle effects.
