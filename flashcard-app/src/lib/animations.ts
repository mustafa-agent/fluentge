// Animation utilities for FluentGe V2
// Note: canvas-confetti will be imported dynamically to handle potential loading issues

export interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: ('square' | 'circle')[];
  scalar?: number;
}

// Dynamic import for canvas-confetti
async function getConfetti() {
  try {
    const confettiModule = await import('canvas-confetti');
    return confettiModule.default;
  } catch (error) {
    console.warn('Canvas-confetti not available:', error);
    return null;
  }
}

// Confetti animations
export async function triggerCorrectAnswerConfetti() {
  const confetti = await getConfetti();
  if (!confetti) return;

  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#34C759', '#32D74B', '#30E44E']
  });
}

export async function triggerLevelUpConfetti() {
  const confetti = await getConfetti();
  if (!confetti) return;

  // Multiple bursts for level up
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF9500', '#FFCC02', '#FFD60A']
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 120,
      origin: { y: 0.7 },
      colors: ['#007AFF', '#5AC8FA', '#32D74B']
    });
  }, 300);
}

export async function triggerDailyGoalConfetti() {
  const confetti = await getConfetti();
  if (!confetti) return;

  // Celebration burst from multiple angles
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#FF2D92', '#FF375F', '#FF453A', '#FF9500', '#FFCC02']
  };

  function fire(particleRatio: number, opts: ConfettiOptions) {
    if (confetti) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio)
      });
    }
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export async function triggerStreakConfetti(streakCount: number) {
  const confetti = await getConfetti();
  if (!confetti) return;

  // Special animation for milestone streaks
  if (streakCount % 7 === 0) {
    // Weekly streak milestone
    triggerDailyGoalConfetti();
  } else {
    // Regular streak
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#FF6B00', '#FF8500', '#FF9F00'],
      shapes: ['circle']
    });
  }
}

// CSS animation utilities
export function addShakeAnimation(element: HTMLElement) {
  element.classList.add('shake');
  element.addEventListener('animationend', () => {
    element.classList.remove('shake');
  }, { once: true });
}

export function addGlowAnimation(element: HTMLElement, color: 'green' | 'red') {
  const glowClass = color === 'green' ? 'glow-green' : 'glow-red';
  element.classList.add(glowClass);
  setTimeout(() => {
    element.classList.remove(glowClass);
  }, 1000);
}

export function addBounceAnimation(element: HTMLElement) {
  element.classList.add('bounce');
  element.addEventListener('animationend', () => {
    element.classList.remove('bounce');
  }, { once: true });
}

// XP gain animation
export function createXPGainElement(amount: number, targetElement: HTMLElement): void {
  const xpElement = document.createElement('div');
  xpElement.innerHTML = `+${amount} XP`;
  xpElement.className = 'xp-gain-animation';
  
  // Position relative to target
  const rect = targetElement.getBoundingClientRect();
  xpElement.style.position = 'fixed';
  xpElement.style.left = `${rect.left + rect.width / 2}px`;
  xpElement.style.top = `${rect.top}px`;
  xpElement.style.pointerEvents = 'none';
  xpElement.style.zIndex = '9999';
  xpElement.style.color = '#FF9500';
  xpElement.style.fontWeight = 'bold';
  xpElement.style.fontSize = '16px';
  xpElement.style.transform = 'translateX(-50%)';
  
  document.body.appendChild(xpElement);
  
  // Animate up and fade out
  xpElement.animate([
    { transform: 'translateX(-50%) translateY(0px)', opacity: 1 },
    { transform: 'translateX(-50%) translateY(-50px)', opacity: 0 }
  ], {
    duration: 1500,
    easing: 'ease-out'
  }).addEventListener('finish', () => {
    document.body.removeChild(xpElement);
  });
}

// Card flip animation (enhance existing flips)
export function enhanceCardFlip(element: HTMLElement): void {
  element.style.transform = 'rotateY(180deg)';
  element.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
}