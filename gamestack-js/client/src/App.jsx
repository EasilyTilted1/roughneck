import React, { useState } from 'react';
import ChapterInput from './components/ChapterInput.jsx';
import GameScreen from './components/GameScreen.jsx';
import DebugOverlay from './components/DebugOverlay.jsx';
import { analyzeChapter } from './lib/api.js';

const PHASE = {
  INPUT: 'input',
  LOADING: 'loading',
  GAME: 'game',
};

export default function App() {
  const [phase, setPhase] = useState(PHASE.INPUT);
  const [narrative, setNarrative] = useState(null);
  const [chapterText, setChapterText] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(text) {
    setChapterText(text);
    setError(null);
    setPhase(PHASE.LOADING);
    try {
      const data = await analyzeChapter(text);
      setNarrative(data);
      setPhase(PHASE.GAME);
    } catch (err) {
      setError(err.message);
      setPhase(PHASE.INPUT);
    }
  }

  if (phase === PHASE.LOADING) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Extracting narrative structure…</p>
      </div>
    );
  }

  if (phase === PHASE.GAME && narrative) {
    return (
      <>
        <GameScreen narrative={narrative} chapterText={chapterText} />
        <DebugOverlay data={narrative} />
      </>
    );
  }

  return (
    <ChapterInput
      onSubmit={handleSubmit}
      isLoading={phase === PHASE.LOADING}
      error={error}
    />
  );
}
