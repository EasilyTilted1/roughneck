import { Router } from 'express';
import { getModel } from '../gemini.js';

const router = Router();

// POST /narrative/analyze
// Extracts structured narrative data from a chapter of text
router.post('/analyze', async (req, res) => {
  const { chapterText } = req.body;

  if (!chapterText || typeof chapterText !== 'string' || chapterText.trim().length < 50) {
    return res.status(400).json({ error: 'chapterText must be a non-empty string of at least 50 characters' });
  }

  const prompt = `You are a narrative analysis engine. Analyze the following book chapter and extract structured story data.

Return ONLY valid JSON with this exact schema — no markdown, no explanation:
{
  "setting": {
    "description": "A 2-3 sentence description of the setting",
    "type": "one of: forest | urban | interior | ocean | void"
  },
  "characters": [
    {
      "name": "Character name",
      "role": "protagonist | antagonist | supporting",
      "description": "1-2 sentence description"
    }
  ],
  "conflict": "A single sentence describing the central conflict",
  "decisionPoints": [
    {
      "id": "dp1",
      "description": "A key moment in the chapter where a choice could be made",
      "options": ["Option A text", "Option B text", "Option C text"]
    }
  ]
}

Rules:
- Extract at most 3 characters
- Extract at most 5 decision points, each with 2-3 options
- Setting type must be exactly one of: forest, urban, interior, ocean, void — choose the closest match
- Base everything on what is explicitly present in the chapter text
- Do not invent details not found in the text

Chapter text:
---
${chapterText.slice(0, 8000)}
---`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const data = JSON.parse(jsonText);

    // Validate required keys
    if (!data.setting || !data.characters || !data.conflict || !data.decisionPoints) {
      throw new Error('Gemini response missing required fields');
    }

    return res.json(data);
  } catch (err) {
    console.error('Analyze error:', err);
    return res.status(500).json({ error: err.message || 'Failed to analyze chapter' });
  }
});

// POST /narrative/consequence
// Given a chapter, current scene, and chosen option, generate next scene + new choices
router.post('/consequence', async (req, res) => {
  const { chapterText, currentScene, chosenOption, characters, conflict } = req.body;

  if (!chapterText || !currentScene || !chosenOption) {
    return res.status(400).json({ error: 'chapterText, currentScene, and chosenOption are required' });
  }

  const characterList = Array.isArray(characters)
    ? characters.map(c => `- ${c.name} (${c.role}): ${c.description}`).join('\n')
    : '';

  const prompt = `You are a narrative game engine. A player is experiencing a story derived from the following chapter.

CHAPTER SOURCE (ground truth — stay faithful to this):
---
${chapterText.slice(0, 6000)}
---

ESTABLISHED CHARACTERS:
${characterList}

CENTRAL CONFLICT: ${conflict || 'Unknown'}

CURRENT SCENE:
${currentScene}

THE PLAYER CHOSE: "${chosenOption}"

Your task: Generate the consequence of this choice and provide the next scene.

CRITICAL INSTRUCTION: Generate consequences that are faithful to the chapter's established narrative logic. Do not invent new characters or contradict established facts from the chapter. Stay within the world the author built.

Return ONLY valid JSON with this exact schema — no markdown, no explanation:
{
  "sceneDescription": "2-4 sentences describing what happens next as a result of the choice",
  "choices": [
    { "id": "c1", "text": "Choice option text (under 15 words)" },
    { "id": "c2", "text": "Choice option text (under 15 words)" },
    { "id": "c3", "text": "Choice option text (under 15 words)" }
  ]
}

Rules:
- Provide exactly 2 or 3 choices
- All choices must be plausible within the chapter's established world
- Keep scene description grounded in the chapter's tone and facts`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const data = JSON.parse(jsonText);

    if (!data.sceneDescription || !Array.isArray(data.choices)) {
      throw new Error('Gemini response missing required fields');
    }

    return res.json(data);
  } catch (err) {
    console.error('Consequence error:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate consequence' });
  }
});

export default router;
