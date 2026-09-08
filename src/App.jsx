import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Popup from "./components/Popup";

import Home from "./pages/Home";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

import { loadData, saveData } from "./utils/storage";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [data, setData] = useState(() => loadData());

  const { history, settings } = data;

  const [popup, setPopup] = useState(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const setSettings = (update) => {
    setData((prev) => ({
      ...prev,
      settings:
        typeof update === "function"
          ? update(prev.settings)
          : update,
    }));
  };

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

     