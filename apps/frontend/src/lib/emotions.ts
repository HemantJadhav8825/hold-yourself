export const emotions = [
  "alone",
  "empty",
  "lost",
  "broken",
  "numb",
  "anxious",
  "worthless",
  "disconnected",
  "invisible",
  "overwhelmed"
] as const;

export type Emotion = (typeof emotions)[number];
