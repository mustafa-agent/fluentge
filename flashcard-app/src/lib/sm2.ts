export interface CardProgress {
  cardId: string;
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReview: number; // timestamp
  lastReview: number;
}

export function initCardProgress(cardId: string): CardProgress {
  return {
    cardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: 0,
  };
}

// quality: 0-5 (0=complete fail, 5=perfect)
export function sm2(card: CardProgress, quality: number): CardProgress {
  const q = Math.max(0, Math.min(5, quality));
  let { easeFactor, interval, repetitions } = card;

  if (q < 3) {
    repetitions = 0;
    interval = 0;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
    lastReview: Date.now(),
  };
}
