import { Exercise, CorrectionResult, Topic, Difficulty } from '../types';

const EXERCISE_GENERATION_PROMPT = `Eres un generador de ejercicios de JavaScript. Genera un ejercicio de programacion con los siguientes requisitos:

TEMA: {topic}
DIFICULTAD: {difficulty}

Requisitos:
1. La salida DEBE ser solo JSON valido, sin markdown, sin texto extra.
2. El ejercicio debe ser sobre {topic}.
3. La dificultad debe ser {difficulty}.
4. El ejercicio debe ser resoluble en una funcion y ejecutable en JavaScript puro.
5. Evita librerias externas - usa solo JavaScript nativo.
6. El ejercicio debe tener requisitos y ejemplos claros.

Esquema JSON:
{
  "title": "string - titulo corto descriptivo",
  "topic": "string - nombre del tema",
  "difficulty": "easy"|"medium"|"hard",
  "statement": "string - descripcion detallada del problema",
  "requirements": ["string - lista de requisitos"],
  "examples": [{"input": "string", "output": "string", "explanation": "string"}],
  "starterCode": "string - plantilla de codigo inicial",
  "tests": [{"name": "string", "input": "string", "expected": "string"}]
}

Genera el ejercicio ahora. Responde solo con JSON valido.`;

const CORRECTION_PROMPT = `Eres un revisor de codigo JavaScript. Analiza la solucion del usuario y proporciona retroalimentacion detallada.

ENUNCIADO DEL EJERCICIO:
{statement}

SOLUCION DEL USUARIO:
{userCode}

Requisitos del ejercicio:
{requirements}

Ejemplos:
{examples}

Instrucciones:
1. La salida DEBE ser solo JSON valido, sin markdown, sin texto extra.
2. Evalua el codigo del usuario cuidadosamente.
3. Proporciona una puntuacion de 0-100.
4. Identifica todos los errores (sintaxis, logica, casos extremos, estilo).
5. Proporciona el codigo corregido que resuelve el ejercicio.
6. Da retroalimentacion constructiva y sugerencias de mejora.

Esquema JSON:
{
  "score": number,
  "summary": "string - resumen general de la evaluacion",
  "mistakes": [{"type": "syntax"|"logic"|"edge_case"|"style", "message": "string", "lineHint": "string"}],
  "correctedCode": "string - solucion completa y funcional",
  "explanation": "string - explicacion detallada de la solucion",
  "improvements": ["string - lista de sugerencias de mejora"]
}

Proporciona tu analisis ahora. Responde solo con JSON valido.`;

export async function generateExercise(
  apiKey: string,
  topic: Topic,
  difficulty: Difficulty
): Promise<Exercise> {
  const prompt = EXERCISE_GENERATION_PROMPT
    .replace('{topic}', topic)
    .replace('{difficulty}', difficulty)
    .replace('{topic}', topic)
    .replace('{difficulty}', difficulty);

  const response = await callGemini(apiKey, prompt);
  const parsed = parseJsonResponse<Exercise>(response);
  
  if (!parsed) {
    throw new Error('Failed to generate valid exercise. Please try again.');
  }

  return parsed;
}

export async function correctSolution(
  apiKey: string,
  exercise: Exercise,
  userCode: string
): Promise<CorrectionResult> {
  const prompt = CORRECTION_PROMPT
    .replace('{statement}', exercise.statement)
    .replace('{userCode}', userCode)
    .replace('{requirements}', exercise.requirements.join('\n'))
    .replace('{examples}', exercise.examples.map(e => 
      `Input: ${e.input}, Output: ${e.output}, Explanation: ${e.explanation}`
    ).join('\n'));

  const response = await callGemini(apiKey, prompt);
  const parsed = parseJsonResponse<CorrectionResult>(response);
  
  if (!parsed) {
    throw new Error('Failed to get correction. Please try again.');
  }

  return parsed;
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  const text = data.candidates[0].content.parts[0].text;
  return text;
}

function parseJsonResponse<T>(text: string): T | null {
  const cleaned = cleanJsonString(text);
  
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

function cleanJsonString(text: string): string {
  let cleaned = text.trim();
  
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  
  return cleaned.trim();
}
