import { useState, useRef, useEffect } from 'react';
import { Exercise, Difficulty } from '../types';

interface PlaygroundProps {
  exercise: Exercise | null;
  userCode: string;
  difficulty: Difficulty;
  loading: boolean;
  error: string | null;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onCodeChange: (code: string) => void;
  onNewExercise: () => void;
  onCheckSolution: () => void;
}

export function Playground({
  exercise,
  userCode,
  difficulty,
  loading,
  error,
  onDifficultyChange,
  onCodeChange,
  onNewExercise,
  onCheckSolution,
}: PlaygroundProps) {
  const [editorHeight, setEditorHeight] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const delta = startYRef.current - e.clientY;
      const newHeight = Math.max(250, Math.min(600, startHeightRef.current + delta));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <main className="playground">
      <div className="playground-header">
        <div className="difficulty-selector">
          <span>Dificultad:</span>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
              onClick={() => onDifficultyChange(d)}
            >
              {d === 'easy' ? 'Facil' : d === 'medium' ? 'Medio' : 'Dificil'}
            </button>
          ))}
        </div>
        <div className="header-actions">
          <button className="new-exercise-btn" onClick={onNewExercise} disabled={loading}>
            Nuevo Ejercicio
          </button>
          <button 
            className="check-btn" 
            onClick={onCheckSolution}
            disabled={loading || !userCode.trim()}
          >
            {loading ? 'Verificando...' : 'Resolver'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && !exercise && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Generando ejercicio...</p>
        </div>
      )}

      {exercise && (
        <div className="playground-content">
          <div className="exercise-content">
            <h2>{exercise.title}</h2>
            <div className="statement">
              <h3>Enunciado del Problema</h3>
              <p>{exercise.statement}</p>
            </div>
            
            <div className="requirements">
              <h3>Requisitos</h3>
              <ul>
                {exercise.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="examples">
              <h3>Ejemplos</h3>
              {exercise.examples.map((ex, i) => (
                <div key={i} className="example">
                  <div><strong>Entrada:</strong> <code>{ex.input}</code></div>
                  <div><strong>Salida:</strong> <code>{ex.output}</code></div>
                  <div><strong>Explicacion:</strong> {ex.explanation}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="resize-handle" onMouseDown={handleMouseDown} />

          <div className="editor-section" style={{ height: editorHeight }}>
            <h3>Tu Solucion</h3>
            <textarea
              className="code-editor"
              value={userCode}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="Escribe tu solucion en JavaScript aqui..."
              spellCheck={false}
              style={{ height: editorHeight - 40 }}
            />
          </div>
        </div>
      )}

      {!exercise && !loading && !error && (
        <div className="empty-state">
          <p>Selecciona un tema del menu lateral para generar un ejercicio.</p>
        </div>
      )}
    </main>
  );
}
