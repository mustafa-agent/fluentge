import { useState, useEffect } from 'react';
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
  initNotifications,
  stopNotifications,
  type NotificationSettings as NotifSettings,
} from '../lib/notifications';

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotifSettings>(getNotificationSettings());
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const updateSettings = (patch: Partial<NotifSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveNotificationSettings(next);
    if (next.enabled) initNotifications();
    else stopNotifications();
  };

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    setPermission(getNotificationPermission());
    if (granted) {
      updateSettings({ enabled: true });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (!isNotificationSupported()) {
    return (
      <div className="notif-panel rounded-2xl bg-[#242426] border border-white/5 p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔔</span>
          <h3 className="text-sm font-bold text-white/80">შეტყობინებები</h3>
        </div>
        <p className="text-xs text-white/50">შენი ბრაუზერი არ უჭერს მხარს შეტყობინებებს.</p>
      </div>
    );
  }

  return (
    <div className="notif-panel rounded-2xl bg-[#242426] border border-white/5 p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔔</span>
          <h3 className="text-sm font-bold text-white/80">შეტყობინებები</h3>
        </div>
        {permission === 'denied' && (
          <span className="text-[10px] text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">დაბლოკილია</span>
        )}
      </div>

      {permission === 'denied' ? (
        <p className="text-xs text-white/50">
          შეტყობინებები დაბლოკილია. გთხოვთ, ბრაუზერის პარამეტრებში ჩართოთ.
        </p>
      ) : !settings.enabled ? (
        <div>
          <p className="text-xs text-white/60 mb-3">
            ჩართე შეტყობინებები, რომ არ გამოტოვო ბარათების გადახედვა და სტრიქი!
          </p>
          <button
            onClick={handleEnable}
            className="w-full py-2.5 rounded-xl bg-green-500 border-b-4 border-green-600 text-white text-sm font-bold active:border-b-0 active:mt-1 transition-all"
          >
            🔔 ჩართვა
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {showSuccess && (
            <div className="text-xs text-green-400 bg-green-500/20 rounded-xl px-3 py-2 text-center animate-pulse">
              ✅ შეტყობინებები ჩართულია!
            </div>
          )}

          {/* SRS Reminders Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/80">🧠 გადახედვის შეხსენება</p>
              <p className="text-[10px] text-white/40">როცა ბარათები გადასახედია</p>
            </div>
            <button
              onClick={() => updateSettings({ srsReminders: !settings.srsReminders })}
              className={`w-10 h-5 rounded-full transition-colors relative ${settings.srsReminders ? 'bg-green-500' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.srsReminders ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* SRS Interval */}
          {settings.srsReminders && (
            <div className="flex items-center justify-between pl-4">
              <p className="text-[10px] text-white/50">ინტერვალი</p>
              <div className="flex gap-1">
                {[2, 4, 6, 8].map(h => (
                  <button
                    key={h}
                    onClick={() => updateSettings({ srsIntervalHours: h })}
                    className={`text-[10px] px-2 py-1 rounded-lg transition-colors ${
                      settings.srsIntervalHours === h
                        ? 'bg-indigo-500 text-white font-bold'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {h}სთ
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Streak Reminders Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white/80">🔥 სტრიქის შეხსენება</p>
              <p className="text-[10px] text-white/40">საღამოს, თუ დღეს არ ისწავლე</p>
            </div>
            <button
              onClick={() => updateSettings({ streakReminders: !settings.streakReminders })}
              className={`w-10 h-5 rounded-full transition-colors relative ${settings.streakReminders ? 'bg-green-500' : 'bg-white/20'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.streakReminders ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Streak Reminder Hour */}
          {settings.streakReminders && (
            <div className="flex items-center justify-between pl-4">
              <p className="text-[10px] text-white/50">საათი</p>
              <div className="flex gap-1">
                {[18, 19, 20, 21].map(h => (
                  <button
                    key={h}
                    onClick={() => updateSettings({ streakReminderHour: h })}
                    className={`text-[10px] px-2 py-1 rounded-lg transition-colors ${
                      settings.streakReminderHour === h
                        ? 'bg-amber-500 text-white font-bold'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {h}:00
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disable button */}
          <button
            onClick={() => updateSettings({ enabled: false })}
            className="w-full text-[10px] text-white/30 hover:text-red-400 transition-colors py-1"
          >
            გამორთვა
          </button>
        </div>
      )}
    </div>
  );
}
