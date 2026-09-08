export const REASONS = [
  {
    id: "want",
    label: "Просто захотелось",
    icon: "😏",
  },
  {
    id: "stress",
    label: "Стресс",
    icon: "😤",
  },
  {
    id: "tired",
    label: "Усталость",
    icon: "😴",
  },
  {
    id: "food",
    label: "После еды",
    icon: "🍽️",
  },
  {
    id: "company",
    label: "За компанию",
    icon: "👥",
  },
  {
    id: "habit",
    label: "По привычке",
    icon: "🔄",
  },
  {
    id: "alcohol",
    label: "После алкоголя",
    icon: "🍺",
  },
  {
    id: "other",
    label: "Другое",
    icon: "❓",
  },
];

export function getReasonLabel(reasonId) {
  const reason = REASONS.find(
    (item) => item.id === reasonId
  );

  return reason ? reason.label : "Другое";
}

export function getReasonIcon(reasonId) {
  const reason = REASONS.find(
    (item) => item.id === reasonId
  );

  return reason ? reason.icon : "❓";
}