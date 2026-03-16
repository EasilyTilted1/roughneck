const BASE = '/narrative';

export async function analyzeChapter(chapterText) {
  const res = await fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterText }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}

export async function getConsequence({ chapterText, currentScene, chosenOption, characters, conflict }) {
  const res = await fetch(`${BASE}/consequence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterText, currentScene, chosenOption, characters, conflict }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Consequence generation failed');
  return data;
}
