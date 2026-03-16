import React, { useState } from 'react';

export default function DebugOverlay({ data }) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button className="debug-toggle-btn" onClick={() => setVisible(true)}>
        [DEBUG]
      </button>
    );
  }

  return (
    <div className="debug-overlay">
      <div className="debug-header">
        <span>Debug — Extracted JSON</span>
        <button onClick={() => setVisible(false)}>hide</button>
      </div>
      <div className="debug-body">
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  );
}
