import React from "react";

export default function BottomNav({ activeTab, setActiveTab }) {
  const items = [
    { id: "home", icon: "🏠", label: "Главная" },
    { id: "history", icon: "📋", label: "История" },
    { id: "stats", icon: "📊", label: "Статистика" },
    { id: "settings", icon: "⚙️", label: "Настройки" },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={activeTab === item.id ? "active" : ""}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}