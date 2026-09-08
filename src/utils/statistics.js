import { getReasonLabel } from "./reasons";

export function getTodayEntries(history = {}, todayKey) {
  return history[todayKey] || [];
}

export function getCigarettes(entries = []) {
  return entries.filter(
    (entry) => entry.type === "cigarette"
  );
}

export function getEnergy(entries = []) {
  return entries.filter(
    (entry) => entry.type === "energy"
  );
}

export function getEnergyMl(entries = []) {
  return getEnergy(entries).reduce(
    (total, entry) => total + (Number(entry.amount) || 0),
    0
  );
}

export function getAverageCigaretteInterval(entries = []) {
  const intervals = getCigarettes(entries)
    .map((entry) => Number(entry.interval))
    .filter((value) => value > 0);

  if (intervals.length === 0) {
    return 0;
  }

  return Math.round(
    intervals.reduce((sum, value) => sum + value, 0) /
      intervals.length
  );
}

export function getReasonStats(entries = []) {
  const cigarettes = getCigarettes(entries);

  const stats = {};

  cigarettes.forEach((entry) => {
    const reason = entry.reason || "other";

    stats[reason] = (stats[reason] || 0) + 1;
  });

  return Object.entries(stats)
    .map(([reason, count]) => ({
      reason,
      label: getReasonLabel(reason),
      count,
      percentage:
        cigarettes.length > 0
          ? Math.round(
              (count / cigarettes.length) * 100
            )
          : 0,
    }))
    .sort((a, b) => b.count - a.count);
}