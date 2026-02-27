import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Playground } from './components/Playground';
import { CorrectionPanel } from './components/CorrectionPanel';
import { SettingsModal } from './components/SettingsModal';
import { Chatbot } from './components/Chatbot';
import { generateExercise, correctSolution } from './lib/gemini';
import { Topic, Difficulty, Exercise, CorrectionResult } from './types';

const STORAGE_KEY = 'gemini_api_key';
const ENV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export default function App() {
  const [apiKey, setApiKey] = useState(ENV_API_KEY);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic>('Arrays');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userCode, setUserCode] = useState('');
  const [correctionResult, setCorrectionResult] = useState<CorrectionResult | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [loadingCorrection, setLoadingCorrection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ENV_API_KEY) {
      setApiKey(ENV_API_KEY);
      localStorage.setItem(STORAGE_KEY, ENV_API_KEY);
      setSettingsOpen(false);
    } else {
      const storedKey = localStorage.getItem(STORAGE_KEY);
      if (storedKey) {
        setApiKey(storedKey);
        setSettingsOpen(false);
      } else {
        setSettingsOpen(true);
      }
    }
  }, []);

  const generateNewExercise = useCallback(async () => {
    if (!apiKey) {
      setSettingsOpen(true);
      return;
    }

    setLoadingExercise(true);
    setError(null);
    setCorrectionResult(null);

    try {
      const exercise = await generateExercise(apiKey, selectedTopic, difficulty);
      setCurrentExercise(exercise);
      setUserCode(exercise.starterCode || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate exercise');
    } finally {
      setLoadingExercise(false);
    }
  }, [apiKey, selectedTopic, difficulty]);

  useEffect(() => {
    if (apiKey) {
      generateNewExercise();
    }
  }, [selectedTopic, difficulty]);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCorrectionResult(null);
  };

  const handleCheckSolution = async () => {
    if (!apiKey || !currentExercise) return;

    setLoadingCorrection(true);
    setError(null);

    try {
      const result = await correctSolution(apiKey, currentExercise, userCode);
      setCorrectionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get correction');
    } finally {
      setLoadingCorrection(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setSettingsOpen(true);
  };

  return (
    <div className="app">
      <Sidebar
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      
      <Playground
        exercise={currentExercise}
        userCode={userCode}
        difficulty={difficulty}
        loading={loadingExercise}
        error={error}
        onDifficultyChange={setDifficulty}
        onCodeChange={setUserCode}
        onNewExercise={generateNewExercise}
        onCheckSolution={handleCheckSolution}
      />
      
      <CorrectionPanel
        correction={correctionResult}
        loading={loadingCorrection}
      />

      <SettingsModal
        isOpen={settingsOpen}
        apiKey={apiKey}
        onSave={handleSaveApiKey}
        onClear={handleClearApiKey}
        onClose={() => setSettingsOpen(false)}
      />

      <Chatbot />
    </div>
  );
}
