export const emotions = [
  { emotion: "alone", lastReviewed: "2026-02-16" },
  { emotion: "empty", lastReviewed: "2026-02-16" },
  { emotion: "lost", lastReviewed: "2026-02-16" },
  { emotion: "broken", lastReviewed: "2026-02-16" },
  { emotion: "numb", lastReviewed: "2026-02-16" },
  { emotion: "anxious", lastReviewed: "2026-02-16" },
  { emotion: "worthless", lastReviewed: "2026-02-16" },
  { emotion: "disconnected", lastReviewed: "2026-02-16" },
  { emotion: "invisible", lastReviewed: "2026-02-16" },
  { emotion: "overwhelmed", lastReviewed: "2026-02-16" }
] as const;

export type Emotion = (typeof emotions)[number]["emotion"];
