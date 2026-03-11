// Firebase Firestore Sync for FluentGe Flashcard App
// Uses dynamic imports to load Firebase from CDN

let db: any = null;
let auth: any = null;

async function initFirebase() {
  if (db) return;
  try {
    const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js" as any);
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js" as any);
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js" as any);
    
    const cfg = {
      apiKey: "AIzaSyBYJ6xzlp6tP7oIQoz9UzfYbjrVgR3JrwQ",
      authDomain: "fluentge.firebaseapp.com",
      projectId: "fluentge",
      storageBucket: "fluentge.firebasestorage.app",
      messagingSenderId: "140225085227",
      appId: "1:140225085227:web:d10b8efd8c08a131574f6e"
    };
    const app = getApps().length ? getApps()[0] : initializeApp(cfg);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.warn('[FluentGe Sync] Firebase init failed:', e);
  }
}

function jp(val: string | null, fallback: any): any {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
}

function toArr(v: any): any[] {
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') return Object.values(v);
  return [];
}

function mergeArr(a: any, b: any): any[] {
  const s = new Set();
  const r: any[] = [];
  for (const i of [...toArr(b), ...toArr(a)]) {
    const k = typeof i === 'object' ? JSON.stringify(i) : i;
    if (!s.has(k)) { s.add(k); r.push(i); }
  }
  return r;
}

function mergeObj(a: any, b: any): any {
  return { ...(a || {}), ...(b || {}) };
}

function gather() {
  const d: any = {};
  d.knownCards = jp(localStorage.getItem('knownCards'), []);
  d.learnedPhrases = jp(localStorage.getItem('fluentge-learned-phrases'), []);
  d.learnedGrammar = jp(localStorage.getItem('fluentge-learned-grammar'), []);
  d.learnedPodcasts = jp(localStorage.getItem('fluentge-learned-podcasts'), []);
  d.gameRecords = jp(localStorage.getItem('fluentge-game-records'), {});
  d.premium = localStorage.getItem('fluentge-premium') === 'true';
  d.srsData = {};
  d.cardProgress = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith('fluentge-srs-')) d.srsData[k.slice(13)] = jp(localStorage.getItem(k), {});
    if (k?.startsWith('card_progress_')) d.cardProgress[k] = jp(localStorage.getItem(k), {});
  }
  d.flashcardProgress = jp(localStorage.getItem('fluentge_progress'), {});
  d.flashcardStats = jp(localStorage.getItem('fluentge_stats'), {});

  // Gamification data
  d.totalXP = parseInt(localStorage.getItem('totalXP') || '0', 10);
  d.currentStreak = parseInt(localStorage.getItem('currentStreak') || '0', 10);
  d.lastPracticeDate = localStorage.getItem('lastPracticeDate') || '';
  d.streakLastDate = localStorage.getItem('streakLastDate') || '';
  d.dailyGoalMinutes = parseInt(localStorage.getItem('dailyGoalMinutes') || '10', 10);
  d.dailyCardGoal = parseInt(localStorage.getItem('dailyCardGoal') || '50', 10);
  d.dailyStudyTime = jp(localStorage.getItem('dailyStudyTime'), {});
  d.dailyCardsReviewed = jp(localStorage.getItem('dailyCardsReviewed'), {});
  d.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed') || '0', 10);
  d.dailyHistory = jp(localStorage.getItem('fluentge-daily-history'), {});
  d.achievements = jp(localStorage.getItem('fluentge-achievements'), []);
  d.grammarCompleted = jp(localStorage.getItem('fluentge-grammar-completed'), {});
  d.difficultWords = jp(localStorage.getItem('fluentge-difficult-words'), {});
  d.onboarded = localStorage.getItem('fluentge-onboarded') === 'true';
  d.path = localStorage.getItem('fluentge-path') || '';

  // New SRS v2 system
  d.srsV2 = jp(localStorage.getItem('fluentge_srs_v2'), {});
  d.studyDecks = jp(localStorage.getItem('fluentge_study_decks'), []);
  d.dailyLimit = parseInt(localStorage.getItem('fluentge_daily_limit') || '20', 10);
  d.dailyNew = jp(localStorage.getItem('fluentge_daily_new'), {});

  return d;
}

function apply(local: any, cloud: any) {
  localStorage.setItem('knownCards', JSON.stringify(mergeArr(local.knownCards, cloud.knownCards)));
  localStorage.setItem('fluentge-learned-phrases', JSON.stringify(mergeArr(local.learnedPhrases, cloud.learnedPhrases)));
  localStorage.setItem('fluentge-learned-grammar', JSON.stringify(mergeArr(local.learnedGrammar, cloud.learnedGrammar)));
  localStorage.setItem('fluentge-learned-podcasts', JSON.stringify(mergeArr(local.learnedPodcasts, cloud.learnedPodcasts)));
  localStorage.setItem('fluentge-game-records', JSON.stringify(mergeObj(local.gameRecords, cloud.gameRecords)));
  if (cloud.premium !== undefined) localStorage.setItem('fluentge-premium', cloud.premium ? 'true' : 'false');
  for (const id of new Set([...Object.keys(local.srsData || {}), ...Object.keys(cloud.srsData || {})])) {
    localStorage.setItem('fluentge-srs-' + id, JSON.stringify(mergeObj(local.srsData?.[id], cloud.srsData?.[id])));
  }
  localStorage.setItem('fluentge_progress', JSON.stringify(mergeObj(local.flashcardProgress, cloud.flashcardProgress)));
  localStorage.setItem('fluentge_stats', JSON.stringify(mergeObj(local.flashcardStats, cloud.flashcardStats)));
  for (const k of new Set([...Object.keys(local.cardProgress || {}), ...Object.keys(cloud.cardProgress || {})])) {
    localStorage.setItem(k, JSON.stringify(mergeObj(local.cardProgress?.[k], cloud.cardProgress?.[k])));
  }

  // XP: keep higher
  const mergedXP = Math.max(local.totalXP || 0, cloud.totalXP || 0);
  if (mergedXP > 0) localStorage.setItem('totalXP', mergedXP.toString());
  // Streak: keep higher
  const mergedStreak = Math.max(local.currentStreak || 0, cloud.currentStreak || 0);
  if (mergedStreak > 0) localStorage.setItem('currentStreak', mergedStreak.toString());
  // Games played: keep higher
  const mergedGames = Math.max(local.gamesPlayed || 0, cloud.gamesPlayed || 0);
  if (mergedGames > 0) localStorage.setItem('gamesPlayed', mergedGames.toString());
  // Daily goal: keep cloud if set
  if (cloud.dailyGoalMinutes) localStorage.setItem('dailyGoalMinutes', cloud.dailyGoalMinutes.toString());
  if (cloud.dailyCardGoal) localStorage.setItem('dailyCardGoal', cloud.dailyCardGoal.toString());
  // Daily cards reviewed: merge by keeping max per date
  {
    const localCards = local.dailyCardsReviewed || {};
    const cloudCards = cloud.dailyCardsReviewed || {};
    const merged: Record<string, number> = { ...localCards, ...cloudCards };
    for (const date of Object.keys(merged)) {
      merged[date] = Math.max(localCards[date] || 0, cloudCards[date] || 0);
    }
    localStorage.setItem('dailyCardsReviewed', JSON.stringify(merged));
  }
  // Daily study time: merge
  if (cloud.dailyStudyTime) {
    localStorage.setItem('dailyStudyTime', JSON.stringify(mergeObj(local.dailyStudyTime, cloud.dailyStudyTime)));
  }
  // Last practice date: keep more recent
  const lpLocal = local.lastPracticeDate || '';
  const lpCloud = cloud.lastPracticeDate || '';
  const newer = lpLocal && lpCloud ? (new Date(lpLocal) > new Date(lpCloud) ? lpLocal : lpCloud) : lpLocal || lpCloud;
  if (newer) {
    localStorage.setItem('lastPracticeDate', newer);
    localStorage.setItem('streakLastDate', newer);
  }
  // Daily history: merge objects
  localStorage.setItem('fluentge-daily-history', JSON.stringify(mergeObj(local.dailyHistory, cloud.dailyHistory)));
  // Achievements: merge arrays
  localStorage.setItem('fluentge-achievements', JSON.stringify(mergeArr(local.achievements || [], cloud.achievements || [])));
  // Grammar completed: merge arrays
  // grammarCompleted is object {slug: true} — merge as object
  {
    const localGC = local.grammarCompleted || {};
    const cloudGC = cloud.grammarCompleted || {};
    // Handle old array format from cloud
    const toObj = (v: any) => {
      if (Array.isArray(v)) { const o: any = {}; v.forEach((s: string) => { if (typeof s === 'string') o[s] = true; }); return o; }
      return (v && typeof v === 'object') ? v : {};
    };
    const merged = { ...toObj(localGC), ...toObj(cloudGC) };
    localStorage.setItem('fluentge-grammar-completed', JSON.stringify(merged));
  }
  // Difficult words: merge by word key, keep higher wrongCount per word
  if (local.difficultWords || cloud.difficultWords) {
    const localDW = local.difficultWords || {};
    const cloudDW = cloud.difficultWords || {};
    const merged: Record<string, any> = {};
    for (const key of new Set([...Object.keys(localDW), ...Object.keys(cloudDW)])) {
      const l = localDW[key];
      const c = cloudDW[key];
      if (l && c) {
        // Keep the one with more wrong answers, merge counts
        merged[key] = {
          ...l,
          ...c,
          wrongCount: Math.max(l.wrongCount || 0, c.wrongCount || 0),
          rightCount: Math.max(l.rightCount || 0, c.rightCount || 0),
          lastWrong: Math.max(l.lastWrong || 0, c.lastWrong || 0),
          lastRight: Math.max(l.lastRight || 0, c.lastRight || 0),
        };
      } else {
        merged[key] = l || c;
      }
    }
    localStorage.setItem('fluentge-difficult-words', JSON.stringify(merged));
  }
  // Onboarding
  if (cloud.onboarded) localStorage.setItem('fluentge-onboarded', 'true');
  if (cloud.path) localStorage.setItem('fluentge-path', cloud.path);

  // New SRS v2: merge card-by-card, keep the one with more repetitions or later lastReview
  if (local.srsV2 || cloud.srsV2) {
    const localSRS = local.srsV2 || {};
    const cloudSRS = cloud.srsV2 || {};
    const merged: Record<string, any> = {};
    for (const key of new Set([...Object.keys(localSRS), ...Object.keys(cloudSRS)])) {
      const l = localSRS[key];
      const c = cloudSRS[key];
      if (l && c) {
        // Keep the one with later lastReview
        merged[key] = (l.lastReview || 0) >= (c.lastReview || 0) ? l : c;
      } else {
        merged[key] = l || c;
      }
    }
    localStorage.setItem('fluentge_srs_v2', JSON.stringify(merged));
  }
  // Study decks: merge by deckId+mode
  if (local.studyDecks || cloud.studyDecks) {
    const localD = local.studyDecks || [];
    const cloudD = cloud.studyDecks || [];
    const seen = new Set<string>();
    const merged: any[] = [];
    for (const d of [...localD, ...cloudD]) {
      const k = `${d.deckId}_${d.mode}`;
      if (!seen.has(k)) { seen.add(k); merged.push(d); }
    }
    localStorage.setItem('fluentge_study_decks', JSON.stringify(merged));
  }
  // Daily limit: keep cloud
  if (cloud.dailyLimit) localStorage.setItem('fluentge_daily_limit', cloud.dailyLimit.toString());
  // Daily new: merge
  if (cloud.dailyNew) localStorage.setItem('fluentge_daily_new', JSON.stringify(mergeObj(local.dailyNew, cloud.dailyNew)));
}

function getUid(): string | null {
  try {
    const user = jp(localStorage.getItem('fluentge-user'), null);
    return user?.uid || null;
  } catch { return null; }
}

export function isLoggedIn(): boolean {
  return getUid() !== null;
}

export async function loadFromCloud(): Promise<void> {
  const uid = getUid();
  if (!uid) return;
  await initFirebase();
  if (!db) return;
  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js" as any);
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      apply(gather(), snap.data().progress || {});
      console.log('[FluentGe Sync] Loaded from cloud');
    }
  } catch (e: any) {
    console.warn('[FluentGe Sync] Load failed:', e.message);
  }
}

// Debounced convenience: call after any important action (batches within 500ms)
let _syncTimer: ReturnType<typeof setTimeout> | null = null;
export function syncNow(): void {
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(() => { syncToCloud().catch(() => {}); }, 500);
}

export async function syncToCloud(): Promise<void> {
  const uid = getUid();
  if (!uid) return;
  await initFirebase();
  if (!db) return;
  try {
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js" as any);
    const d = gather();
    d.lastSync = new Date().toISOString();
    await setDoc(doc(db, 'users', uid), { progress: d }, { merge: true });
    console.log('[FluentGe Sync] Saved to cloud');
  } catch (e: any) {
    console.warn('[FluentGe Sync] Save failed:', e.message);
  }
}
