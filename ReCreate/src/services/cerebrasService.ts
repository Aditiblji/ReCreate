import { ProjectIdea, WasteAnalysis } from '../types';
import { getUserPreferences, buildPreferencePromptAddition } from './preferenceService';

const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';

interface CerebrasMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callCerebras(messages: CerebrasMessage[]): Promise<string> {
  const response = await fetch(CEREBRAS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3.1-8b',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cerebras API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function analyzeImageWithCerebras(imageBase64: string): Promise<string> {
  const prompt = `You are an expert at identifying waste items and materials.
Analyze this image and describe what waste items you see. Be specific about:
- The type of material (plastic, wood, metal, textile, glass, paper, etc.)
- The condition (broken, damaged, good condition)
- Approximate quantity and size
- Any identifying features

Provide a concise description in 2-3 sentences.`;

  const messages: CerebrasMessage[] = [
    { role: 'system', content: 'You are an expert waste identification assistant.' },
    { role: 'user', content: `${prompt}\n\nImage data: ${imageBase64.substring(0, 100)}...` }
  ];

  return await callCerebras(messages);
}

export async function generateIdeasWithCerebras(
  description: string,
  includeExtra: boolean
): Promise<ProjectIdea[]> {
  const preferences = await getUserPreferences();
  const preferenceAddition = buildPreferencePromptAddition(preferences);

  const prompt = `You are a creative upcycling expert. Based on this waste description: "${description}"

Generate exactly 3-5 creative DIY upcycling project ideas. For each idea, provide:

1. Project title (creative and appealing)
2. Visual description (what it looks like when finished)
3. List of required materials (include the waste item)
${includeExtra ? '4. Optional extra materials for enhancement' : ''}
5. Estimated time (e.g., "30 mins", "2 hours")
6. Estimated cost (e.g., "$5", "$15")
7. Skill level (Beginner, Intermediate, or Expert)
8. CO2 saved in kg (realistic estimate)
9. Waste diverted in kg (realistic estimate)
10. Water saved in liters (if applicable, especially for textiles)
${preferenceAddition}

Format your response as a JSON array with this exact structure:
[
  {
    "title": "Project Name",
    "visualDescription": "Description of finished look",
    "materials": ["item 1", "item 2"],
    "extraMaterials": ["optional 1", "optional 2"],
    "estimatedTime": "1 hour",
    "estimatedCost": "$10",
    "skillLevel": "Beginner",
    "co2Saved": 0.5,
    "wasteDiverted": 1.0,
    "waterSaved": 0
  }
]

Return ONLY valid JSON, no other text.`;

  const messages: CerebrasMessage[] = [
    { role: 'system', content: 'You are a creative upcycling expert who responds only in valid JSON format.' },
    { role: 'user', content: prompt }
  ];

  const response = await callCerebras(messages);

  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }

  const ideas = JSON.parse(jsonText);

  return ideas.map((idea: any, index: number) => ({
    id: String(index + 1),
    title: idea.title,
    visualDescription: idea.visualDescription,
    materials: idea.materials,
    extraMaterials: includeExtra ? idea.extraMaterials : undefined,
    estimatedTime: idea.estimatedTime,
    estimatedCost: idea.estimatedCost,
    skillLevel: idea.skillLevel,
    videoUrl: undefined,
    sustainabilityScore: {
      co2Saved: idea.co2Saved,
      wasteDiverted: idea.wasteDiverted,
      waterSaved: idea.waterSaved || 0,
      friendlyNote: generateFriendlyNote(idea.co2Saved, idea.wasteDiverted, idea.waterSaved || 0)
    }
  }));
}

export async function generateStepsWithCerebras(idea: ProjectIdea): Promise<any[]> {
  const prompt = `Create detailed step-by-step instructions for this upcycling project:

Title: ${idea.title}
Description: ${idea.visualDescription}
Materials: ${idea.materials.join(', ')}
${idea.extraMaterials ? `Extra Materials: ${idea.extraMaterials.join(', ')}` : ''}

Generate 5-8 clear, detailed steps. For each step, provide:
1. The instruction (what to do)
2. Optional tips (helpful hints)
3. Optional safety notes (if the step involves cutting, gluing, or other hazards)

Format as JSON array:
[
  {
    "stepNumber": 1,
    "instruction": "Clear instruction",
    "tips": "Helpful tip (optional)",
    "safetyNotes": "Safety warning (optional)"
  }
]

Return ONLY valid JSON, no other text.`;

  const messages: CerebrasMessage[] = [
    { role: 'system', content: 'You are an expert DIY instructor who responds only in valid JSON format.' },
    { role: 'user', content: prompt }
  ];

  const response = await callCerebras(messages);

  let jsonText = response.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }

  return JSON.parse(jsonText);
}

function generateFriendlyNote(co2: number, waste: number, water: number): string {
  if (water > 1000) {
    return `Amazing! You've saved ${water} liters of water - that's like taking ${Math.round(water / 100)} baths!`;
  } else if (co2 > 10) {
    return `Incredible impact! You've saved ${co2}kg of CO₂ - equivalent to driving ${Math.round(co2 * 3)} km in a car!`;
  } else if (waste > 5) {
    return `Great work! You've diverted ${waste}kg from landfills - that's like saving ${Math.round(waste)} plastic bottles!`;
  } else {
    return `Every bit counts! By reusing this item, you're helping create a more sustainable future.`;
  }
}
