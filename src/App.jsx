import React, { useMemo, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Popup from "./components/Popup";
import ReasonModal from "./components/ReasonModal";
import UrgeTimer from "./components/UrgeTimer";

import Home from "./pages/Home";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

import { loadData, saveData } from "./utils/storage";

import {
  getTodayKey,
  getMinutesBetween,
} from "./utils/dates";

import {
  getTodayEntries,
  getCigarettes,
  getEnergy,
  getEnergyMl,
} from "./utils/statistics";

import { getWarning } from "./utils/warnings";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [data, setData] = useState(() => loadData());

  const [popup, setPopup] = useState(null);

  const [showReasonModal, setShowReasonModal] =
    useState(false);

  const [showUrgeTimer, setShowUrgeTimer] =
    useState(false);

  const todayKey = getTodayKey();

  const todayEntries = useMemo(
    () =>
      getTodayEntries(
        data.history,
        todayKey
      ),
    [data.history, todayKey]
  );

  const cigaretteEntries = useMemo(
    () => getCigarettes(todayEntries),
    [todayEntries]
  );

  const energyEntries = useMemo(
    () => getEnergy(todayEntries),
    [todayEntries]
  );

  const energyMl = useMemo(
    () => getEnergyMl(todayEntries),
    [todayEntries]
  );

  const cigaretteCount =
    cigaretteEntries.length;

  const energyCount =
    energyEntries.length;

  const { settings } = data;
const setupNotification = async () => {
  try {
    const permission =
      await LocalNotifications.requestPermissions();

    if (permission.display !== "granted") {
      return;
    }

    await LocalNotifications.createChannel({
      id: "habit-control",
      name: "Сиги и энергосы",
      description: "Быстрое добавление сигарет и энергетиков",
      importance: 4,
      visibility: 1,
    });

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1001,
          title: "Сиги и энергосы",
          body: "Быстро добавить употребление",
          channelId: "habit-control",
          ongoing: true,
          autoCancel: false,
        },
      ],
    });
  } catch (error) {
    console.error(
      "Ошибка уведомления:",
      error
    );
  }
};

  const save = (newData) => {
    setData(newData);
    saveData(newData);
  };

  const addCigarette = (reason = "want") => {
    const now = new Date();
    const timestamp = now.toISOString();

    const previous =
      cigaretteEntries[
        cigaretteEntries.length - 1
      ];

    const interval = previous
      ? getMinutesBetween(
          previous.timestamp,
          timestamp
        )
      : 0;

    const entry = {
      id: `${timestamp}-cigarette`,
      type: "cigarette",
      timestamp,
      reason,
      interval,
    };

    const newHistory = {
      ...data.history,
      [todayKey]: [
        ...(data.history[todayKey] || []),
        entry,
      ],
    };

    const newData = {
      ...data,
      history: newHistory,
    };

    save(newData);

    const newCount =
      cigaretteCount + 1;

    const warning = getWarning(
      "cigarette",
      newCount,
      settings.cigaretteLimit
    );

    if (warning) {
      setPopup(warning);
    }
  };

  const addEnergy = (amount) => {
    const now = new Date();
    const timestamp = now.toISOString();

    const entry = {
      id: `${timestamp}-energy`,
      type: "energy",
      timestamp,
      amount,
    };

    const newHistory = {
      ...data.history,
      [todayKey]: [
        ...(data.history[todayKey] || []),
        entry,
      ],
    };

    const newData = {
      ...data,
      history: newHistory,
    };

    save(newData);

    const newCount =
      energyCount + 1;

    const warning = getWarning(
      "energy",
      newCount,
      settings.energyLimit
    );

    if (warning) {
      setPopup(warning);
    }
  };

  const handleCigaretteClick = () => {
    setShowReasonModal(true);
  };

  const handleReasonSelect = (reason) => {
    setShowReasonModal(false);
    addCigarette(reason);
  };

  const setSettings = (update) => {
    setData((prev) => {
      const newSettings =
        typeof update === "function"
          ? update(prev.settings)
          : update;

      const newData = {
        ...prev,
        settings: newSettings,
      };

      saveData(newData);

      return newData;
    });
  };

  const renderPage = () => {
    switch (activeTab) {
      case "history":
        return (
          <History
            history={data.history}
          />
        );

      case "stats":
        return (
          <Stats
            history={data.history}
          />
        );

      case "settings":
        return (
          <Settings
            settings={settings}
            setSettings={setSettings}
          />
        );

      case "home":
      default:
        return (
          <Home
            cigaretteCount={cigaretteCount}
            energyCount={energyCount}
            energyMl={energyMl}
            cigaretteLimit={
              settings.cigaretteLimit
            }
            energyLimit={
              settings.energyLimit
            }
            onAddCigarette={
              handleCigaretteClick
            }
            onAddEnergy={addEnergy}
            onUrge={() =>
              setShowUrgeTimer(true)
            }
          />
        );
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

      <ReasonModal
        isOpen={showReasonModal}
        onSelect={handleReasonSelect}
        onClose={() =>
          setShowReasonModal(false)
        }
      />

      {showUrgeTimer && (
        <UrgeTimer
          onClose={() =>
            setShowUrgeTimer(false)
          }
        />
      )}
    </div>
  );
}