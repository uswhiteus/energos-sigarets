export function getTodayKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatTime(timestamp) {
  if (!timestamp) {
    return "--:--";
  }

  return new Date(timestamp).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(dateKey) {
  if (!dateKey) {
    return "";
  }

  const [year, month, day] = dateKey.split("-");

  return `${day}.${month}.${year}`;
}

export function getMinutesBetween(firstTimestamp, secondTimestamp) {
  if (!firstTimestamp || !secondTimestamp) {
    return 0;
  }

  const difference =
    new Date(secondTimestamp).getTime() -
    new Date(firstTimestamp).getTime();

  return Math.max(
    0,
    Math.round(difference / 60000)
  );
}

export function formatInterval(minutes) {
  if (!minutes) {
    return "";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} мин`;
  }

  if (mins === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${mins} мин`;
}