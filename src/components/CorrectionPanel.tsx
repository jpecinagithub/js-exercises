import { CorrectionResult } from '../types';

interface CorrectionPanelProps {
  correction: CorrectionResult | null;
  loading: boolean;
}

export function CorrectionPanel({ correction, loading }: CorrectionPanelProps) {
  return (
    <aside className="correction-panel" role="complementary" aria-label="Panel de correccion">
      <header>
        <h2>Correccion AI</h2>
      </header>

      {loading && (
        <div className="loading-state" aria-live="polite">
          <div className="spinner"></div>
          <p>Analizando tu solucion...</p>
        </div>
      )}

      {!correction && !loading && (
        <div className="empty-state">
          <p>Escribe tu solucion y haz clic en "Resolver" para obtener retroalimentacion.</p>
        </div>
      )}

      {correction && (
        <div className="correction-content">
          <section className="score-section" aria-label="Puntuacion">
            <div className="score-label">Puntuacion</div>
            <div className="score-value" aria-label={`Puntuacion: ${correction.score} sobre 100`}>{correction.score}/100</div>
          </section>

          <section className="summary-section">
            <h3>Resumen</h3>
            <p>{correction.summary}</p>
          </section>

          {correction.mistakes.length > 0 && (
            <section className="mistakes-section" aria-label="Errores encontrados">
              <h3>Errores</h3>
              {correction.mistakes.map((mistake, i) => (
                <article key={i} className={`mistake-item ${mistake.type}`} aria-label={`Error ${i + 1}`}>
                  <span className="mistake-type">{mistake.type === 'syntax' ? 'sintaxis' : mistake.type === 'logic' ? 'logica' : mistake.type === 'edge_case' ? 'caso extremo' : 'estilo'}</span>
                  <p>{mistake.message}</p>
                  {mistake.lineHint && <code>{mistake.lineHint}</code>}
                </article>
              ))}
            </section>
          )}

          <section className="explanation-section">
            <h3>Explicacion</h3>
            <p>{correction.explanation}</p>
          </section>

          {correction.improvements.length > 0 && (
            <section className="improvements-section">
              <h3>Sugerencias</h3>
              <ul>
                {correction.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="corrected-code-section" aria-label="Solucion corregida">
            <h3>Solucion Corregida</h3>
            <pre className="corrected-code"><code>{correction.correctedCode}</code></pre>
          </section>
        </div>
      )}
    </aside>
  );
}
