import React, { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="app">
      <h1>Мой контроль</h1>

      <div className="content">
        <h2>Главная</h2>
        <p>Приложение работает.</p>
      </div>

      <nav className="bottom-nav">
        <button onClick={() => setActiveTab("home")}>
          🏠 Главная
        </button>

        <button onClick={() => setActiveTab("history")}>
          📋 История
        </button>

        <button onClick={() => setActiveTab("stats")}>
          📊 Статистика
        </button>

        <button onClick={() => setActiveTab("settings")}>
          ⚙️ Настройки
        </button>
      </nav>
    </div>
  );
}