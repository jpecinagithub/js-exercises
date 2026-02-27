import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  apiKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function SettingsModal({ isOpen, apiKey, onSave, onClear, onClose }: SettingsModalProps) {
  const [inputKey, setInputKey] = useState(apiKey);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    onClear();
    setInputKey('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configuracion API</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="warning-banner">
            <span className="warning-icon">!</span>
            <p>Tu clave API se almacena localmente en tu navegador. No la compartas.</p>
          </div>

          <div className="form-group">
            <label htmlFor="apiKey">Clave API de Gemini</label>
            <input
              id="apiKey"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Ingresa tu clave API de Gemini"
            />
            <p className="help-text">
              Obtén tu clave API de{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
          </div>

          {apiKey && (
            <div className="key-status">
              <span className="key-saved">Clave API guardada</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {apiKey && (
            <button className="clear-btn" onClick={handleClear}>
              Eliminar Clave
            </button>
          )}
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={!inputKey.trim()}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
