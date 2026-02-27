import { CorrectionResult } from '../types';

interface CorrectionPanelProps {
  correction: CorrectionResult | null;
  loading: boolean;
}

export function CorrectionPanel({ correction, loading }: CorrectionPanelProps) {
  return (
    <aside className="correction-panel">
      <h2>Correccion AI</h2>

      {loading && (
        <div className="loading-state">
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
          <div className="score-section">
            <div className="score-label">Puntuacion</div>
            <div className="score-value">{correction.score}/100</div>
          </div>

          <div className="summary-section">
            <h3>Resumen</h3>
            <p>{correction.summary}</p>
          </div>

          {correction.mistakes.length > 0 && (
            <div className="mistakes-section">
              <h3>Errores</h3>
              {correction.mistakes.map((mistake, i) => (
                <div key={i} className={`mistake-item ${mistake.type}`}>
                  <span className="mistake-type">{mistake.type === 'syntax' ? 'sintaxis' : mistake.type === 'logic' ? 'logica' : mistake.type === 'edge_case' ? 'caso extremo' : 'estilo'}</span>
                  <p>{mistake.message}</p>
                  {mistake.lineHint && <code>{mistake.lineHint}</code>}
                </div>
              ))}
            </div>
          )}

          <div className="explanation-section">
            <h3>Explicacion</h3>
            <p>{correction.explanation}</p>
          </div>

          {correction.improvements.length > 0 && (
            <div className="improvements-section">
              <h3>Sugerencias</h3>
              <ul>
                {correction.improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="corrected-code-section">
            <h3>Solucion Corregida</h3>
            <pre className="corrected-code">{correction.correctedCode}</pre>
          </div>
        </div>
      )}
    </aside>
  );
}
