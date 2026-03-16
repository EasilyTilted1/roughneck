import React, { useState } from 'react';
import ThreeScene from './ThreeScene.jsx';
import { getConsequence } from '../lib/api.js';

export default function GameScreen({ narrative, chapterText }) {
  const { setting, characters, conflict, decisionPoints } = narrative;

  const initialScene = `${setting.description} ${decisionPoints[0]?.description ?? ''}`.trim();
  const initialChoices = (decisionPoints[0]?.options ?? []).map((text, i) => ({
    id: `c${i}`,
    text,
  }));

  const [sceneText, setSceneText] = useState(initialScene);
  const [choices, setChoices] = useState(initialChoices);
  const [turn, setTurn] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleChoice(choiceText) {
    setLoading(true);
    setError(null);
    try {
      const result = await getConsequence({
        chapterText,
        currentScene: sceneText,
        chosenOption: choiceText,
        characters,
        conflict,
      });
      setSceneText(result.sceneDescription);
      setChoices(result.choices);
      setTurn(t => t + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Stable prop — derived only from extracted narrative, not mutated by game loop
  const settingType = setting.type ?? 'void';

  return (
    <div className="game-screen">
      <div className="game-main">
        {/* Left panel */}
        <div className="game-left">
          <div className="panel-section">
            <h3>Scene</h3>
            <span className="turn-badge">Turn {turn}</span>
            <p className="scene-text">{sceneText}</p>
          </div>

          <div className="panel-section">
            <h3>Characters</h3>
            {characters.map((char, i) => (
              <div className="character-card" key={i}>
                <span className="char-name">{char.name}</span>
                <span className="char-role">{char.role}</span>
                <span className="char-desc">{char.description}</span>
              </div>
            ))}
          </div>

          <div className="panel-section">
            <h3>Conflict</h3>
            <p className="conflict-text">{conflict}</p>
          </div>
        </div>

        {/* Right panel — Three.js */}
        <div className="game-right">
          <ThreeScene settingType={settingType} />
          <span className="setting-label">{settingType}</span>
        </div>
      </div>

      {/* Choices bar */}
      <div className="choices-bar">
        {loading ? (
          <div className="choices-loading">
            <div className="spinner" />
            Generating consequence…
          </div>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : (
          <>
            <h4>What do you do?</h4>
            <div className="choices-list">
              {choices.map(choice => (
                <button
                  key={choice.id}
                  className="choice-btn"
                  onClick={() => handleChoice(choice.text)}
                  disabled={loading}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
