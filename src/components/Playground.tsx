import { useState, useRef, useEffect } from 'react';
import { Exercise, Difficulty } from '../types';
import { CodeEditor } from './CodeEditor';

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
    <main className="playground" role="main" aria-label="Area de ejercicios">
      <header className="playground-header">
        <section className="difficulty-selector" aria-label="Selector de dificultad">
          <span id="difficulty-label">Dificultad:</span>
          <div role="group" aria-labelledby="difficulty-label">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
                onClick={() => onDifficultyChange(d)}
                aria-pressed={difficulty === d}
              >
                {d === 'easy' ? 'Facil' : d === 'medium' ? 'Medio' : 'Dificil'}
              </button>
            ))}
          </div>
        </section>
        <div className="header-actions">
          <button className="new-exercise-btn" onClick={onNewExercise} disabled={loading} aria-label="Generar nuevo ejercicio">
            Nuevo Ejercicio
          </button>
          <button 
            className="check-btn" 
            onClick={onCheckSolution}
            disabled={loading || !userCode.trim()}
            aria-label="Enviar solucion para verificar"
          >
            {loading ? 'Verificando...' : 'Resolver'}
          </button>
        </div>
      </header>

      {error && <div className="error-message" role="alert">{error}</div>}

      {loading && !exercise && (
        <div className="loading-state" aria-live="polite">
          <div className="spinner"></div>
          <p>Generando ejercicio...</p>
        </div>
      )}

      {exercise && (
        <div className="playground-content">
          <article className="exercise-content" aria-label="Ejercicio actual">
            <h2>{exercise.title}</h2>
            <section className="statement">
              <h3>Enunciado del Problema</h3>
              <p>{exercise.statement}</p>
            </section>
            
            <section className="requirements">
              <h3>Requisitos</h3>
              <ul>
                {exercise.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>

            <section className="examples" aria-label="Ejemplos del ejercicio">
              <h3>Ejemplos</h3>
              {exercise.examples.map((ex, i) => (
                <figure key={i} className="example">
                  <figcaption>Ejemplo {i + 1}</figcaption>
                  <div><strong>Entrada:</strong> <code>{ex.input}</code></div>
                  <div><strong>Salida:</strong> <code>{ex.output}</code></div>
                  <div><strong>Explicacion:</strong> {ex.explanation}</div>
                </figure>
              ))}
            </section>
          </article>

          <div className="resize-handle" onMouseDown={handleMouseDown} />

          <section className="editor-section" style={{ height: editorHeight }} aria-label="Editor de codigo">
            <h3>Tu Solucion</h3>
            <CodeEditor
              value={userCode}
              onChange={onCodeChange}
              placeholder="Escribe tu solucion en JavaScript aqui..."
              height={editorHeight - 40}
            />
          </section>
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
