import { Topic, TOPICS } from '../types';

interface SidebarProps {
  selectedTopic: Topic;
  onTopicSelect: (topic: Topic) => void;
  onOpenSettings: () => void;
}

export function Sidebar({ selectedTopic, onTopicSelect, onOpenSettings }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>JS Ejercicios AI</h1>
      </div>
      <nav className="topic-list">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            className={`topic-item ${selectedTopic === topic ? 'active' : ''}`}
            onClick={() => onTopicSelect(topic)}
          >
            {topic}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="settings-btn" onClick={onOpenSettings}>
          Configuracion API
        </button>
      </div>
    </aside>
  );
}
