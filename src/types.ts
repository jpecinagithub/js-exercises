export type Difficulty = 'easy' | 'medium' | 'hard';

export type Topic = 
  | 'Basicos'
  | 'Condicionales'
  | 'Bucles'
  | 'Funciones'
  | 'Arrays'
  | 'Objetos'
  | 'Strings'
  | 'DOM y Eventos'
  | 'Async'
  | 'ES6+';

export const TOPICS: Topic[] = [
  'Basicos',
  'Condicionales',
  'Bucles',
  'Funciones',
  'Arrays',
  'Objetos',
  'Strings',
  'DOM y Eventos',
  'Async',
  'ES6+'
];

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface Test {
  name: string;
  input: string;
  expected: string;
}

export interface Exercise {
  title: string;
  topic: Topic;
  difficulty: Difficulty;
  statement: string;
  requirements: string[];
  examples: Example[];
  starterCode: string;
  tests: Test[];
}

export interface Mistake {
  type: 'syntax' | 'logic' | 'edge_case' | 'style';
  message: string;
  lineHint: string;
}

export interface CorrectionResult {
  score: number;
  summary: string;
  mistakes: Mistake[];
  correctedCode: string;
  explanation: string;
  improvements: string[];
}

export interface AppState {
  apiKey: string;
  selectedTopic: Topic;
  difficulty: Difficulty;
  currentExercise: Exercise | null;
  userCode: string;
  correctionResult: CorrectionResult | null;
  loadingExercise: boolean;
  loadingCorrection: boolean;
  error: string | null;
}
