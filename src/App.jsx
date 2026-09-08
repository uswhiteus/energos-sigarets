import React, { useState } from "react";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Popup from "./components/Popup";

import Home from "./pages/Home";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [history, setHistory] = useState({});

  const [settings, setSettings] = useState({
    cigaretteLimit: 10,
    energyLimit: 2,
    cigarettePrice: 250,
    energyPrice: 100,
    reductionEnabled: false,
    reductionStep: 1,
    reductionDays: 7,
  });

  const [popup, setPopup] = useState(null);

  const renderPage = () => {
    switch (activeTab) {
      case "history":
        return <History history={history} />;

      case "stats":
        return <Stats history={history} />;

      case "settings":
        return (
          <Settings
            settings={settings}
            setSettings={setSettings}
          />
        );

      case "home":
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Header />

      <div className="app-content">
        {renderPage()}
      </div>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Popup
        message={popup}
        onClose={() => setPopup(null)}
      />
    </div>
  );
}