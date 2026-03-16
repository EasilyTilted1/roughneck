import React, { useState, useRef } from 'react';

export default function ChapterInput({ onSubmit, isLoading, error }) {
  const [text, setText] = useState('');
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setText(ev.target.result);
    reader.readAsText(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (text.trim().length >= 50) onSubmit(text);
  }

  return (
    <div className="input-screen">
      <h1>Narrative Game Pipeline</h1>
      <p>Paste a book chapter below (or upload a .txt file) to transform it into a playable scene.</p>

      <form className="input-box" onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste your chapter text here…"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isLoading}
        />

        <div className="file-row">
          <label htmlFor="file-upload">Upload .txt</label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,text/plain"
            ref={fileRef}
            onChange={handleFile}
            disabled={isLoading}
          />
          {text.length > 0 && (
            <span>{text.length.toLocaleString()} characters</span>
          )}
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || text.trim().length < 50}
        >
          {isLoading ? 'Extracting…' : 'Extract & Play →'}
        </button>
      </form>
    </div>
  );
}
