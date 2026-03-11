// Push Notification System for FluentGe
// Handles browser notification permissions, SRS review reminders, and streak reminders

import { getTotalDueCards } from './srs-engine';

const NOTIF_SETTINGS_KEY = 'fluentge-notification-settings';
const NOTIF_LAST_CHECK_KEY = 'fluentge-notification-last-check';

export interface NotificationSettings {
  enabled: boolean;
  srsReminders: boolean;
  streakReminders: boolean;
  /** Hours between SRS reminders (default: 4) */
  srsIntervalHours: number;
  /** Hour of day to send streak reminder (0-23, default: 20 = 8PM) */
  streakReminderHour: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  srsReminders: true,
  streakReminders: true,
  srsIntervalHours: 4,
  streakReminderHour: 20,
};

export function getNotificationSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem(NOTIF_SETTINGS_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function sendNotification(title: string, body: string, icon?: string, tag?: string, onClick?: () => void): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;
  try {
    const notif = new Notification(title, {
      body,
      icon: icon || '/flashcards/icon-192.png',
      badge: '/flashcards/icon-192.png',
      tag: tag || 'fluentge-' + Date.now(),
      silent: false,
    });
    if (onClick) {
      notif.onclick = () => {
        window.focus();
        onClick();
        notif.close();
      };
    }
    // Auto-close after 10s
    setTimeout(() => notif.close(), 10000);
  } catch {}
}

// Check if SRS review reminder should fire
export function checkSRSReminder(): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.srsReminders) return;
  if (Notification.permission !== 'granted') return;

  const now = Date.now();
  const lastCheck = parseInt(localStorage.getItem(NOTIF_LAST_CHECK_KEY + '-srs') || '0');
  const intervalMs = settings.srsIntervalHours * 60 * 60 * 1000;

  if (now - lastCheck < intervalMs) return;

  // Count due cards
  try {
    const dueCount = getTotalDueCards();
    if (dueCount > 0) {
      sendNotification(
        '🧠 გადასახედი ბარათები!',
        `${dueCount} ბარათი გელოდება გადასახედად. არ დაკარგო პროგრესი!`,
        undefined,
        'fluentge-srs-reminder',
        () => { window.location.hash = ''; window.location.href = '/flashcards/'; }
      );
      localStorage.setItem(NOTIF_LAST_CHECK_KEY + '-srs', now.toString());
    }
  } catch {}
}

// Check if streak reminder should fire
export function checkStreakReminder(): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.streakReminders) return;
  if (Notification.permission !== 'granted') return;

  const now = new Date();
  const hour = now.getHours();

  // Only fire at the configured hour
  if (hour !== settings.streakReminderHour) return;

  const lastCheck = parseInt(localStorage.getItem(NOTIF_LAST_CHECK_KEY + '-streak') || '0');
  const hourAgo = Date.now() - 60 * 60 * 1000;
  if (lastCheck > hourAgo) return; // Already fired this hour

  // Check if user practiced today
  try {
    const lastPractice = localStorage.getItem('fluentge-last-practice');
    if (lastPractice) {
      const today = now.toISOString().slice(0, 10);
      if (lastPractice === today) return; // Already practiced today
    }

    const streakStr = localStorage.getItem('fluentge-streak');
    const streak = streakStr ? parseInt(streakStr) : 0;

    if (streak > 0) {
      sendNotification(
        `🔥 შენი სტრიქი: ${streak} დღე!`,
        'არ დაკარგო სტრიქი! შედი და ისწავლე დღეს.',
        undefined,
        'fluentge-streak-reminder',
        () => { window.location.href = '/flashcards/'; }
      );
    } else {
      sendNotification(
        '📚 დრო სწავლისაა!',
        'დაიწყე ახალი სტრიქი დღეს — თუნდაც 5 წუთი!',
        undefined,
        'fluentge-streak-reminder',
        () => { window.location.href = '/flashcards/'; }
      );
    }
    localStorage.setItem(NOTIF_LAST_CHECK_KEY + '-streak', Date.now().toString());
  } catch {}
}

// Initialize notification checks — call once on app load
let checkInterval: ReturnType<typeof setInterval> | null = null;

export function initNotifications(): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || !isNotificationSupported()) return;

  // Check immediately
  checkSRSReminder();
  checkStreakReminder();

  // Check every 30 minutes
  if (checkInterval) clearInterval(checkInterval);
  checkInterval = setInterval(() => {
    checkSRSReminder();
    checkStreakReminder();
  }, 30 * 60 * 1000);
}

export function stopNotifications(): void {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}
