import { Topic, TOPICS } from '../types';

interface SidebarProps {
  selectedTopic: Topic;
  onTopicSelect: (topic: Topic) => void;
  onOpenSettings: () => void;
}

export function Sidebar({ selectedTopic, onTopicSelect, onOpenSettings }: SidebarProps) {
  return (
    <aside className="sidebar" role="complementary" aria-label="Menu de temas">
      <header className="sidebar-header">
        <h1>JS Ejercicios AI</h1>
      </header>
      <nav className="topic-list" role="navigation" aria-label="Temas de JavaScript">
        <ul>
          {TOPICS.map((topic) => (
            <li key={topic}>
              <button
                className={`topic-item ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => onTopicSelect(topic)}
                aria-pressed={selectedTopic === topic}
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <footer className="sidebar-footer">
        <button className="settings-btn" onClick={onOpenSettings} aria-label="Abrir configuracion de API">
          Configuracion API
        </button>
      </footer>
    </aside>
  );
}
