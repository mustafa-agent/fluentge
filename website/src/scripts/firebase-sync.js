// Firebase Firestore Sync for FluentGe (website)
// Runs on every page via Layout.astro — syncs localStorage data to/from Firestore

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYJ6xzlp6tP7oIQoz9UzfYbjrVgR3JrwQ",
  authDomain: "fluentge.firebaseapp.com",
  projectId: "fluentge",
  storageBucket: "fluentge.firebasestorage.app",
  messagingSenderId: "140225085227",
  appId: "1:140225085227:web:d10b8efd8c08a131574f6e"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
let db;
try {
  db = getFirestore(app);
} catch (e) {
  console.warn('[FluentGe Sync] Firestore init failed:', e);
}

let syncInterval = null;
let currentUid = null;

// --- Helpers ---

function jsonParse(val, fallback) {
  try { return JSON.parse(val); } catch { return fallback; }
}

function mergeArrays(local, cloud) {
  if (!Array.isArray(local)) local = [];
  if (!Array.isArray(cloud)) cloud = [];
  const seen = new Set();
  const merged = [];
  for (const item of [...cloud, ...local]) {
    const key = typeof item === 'object' ? JSON.stringify(item) : item;
    if (!seen.has(key)) { seen.add(key); merged.push(item); }
  }
  return merged;
}

function mergeObjects(local, cloud) {
  if (!local || typeof local !== 'object') local = {};
  if (!cloud || typeof cloud !== 'object') cloud = {};
  return { ...local, ...cloud };
}

// --- Gather localStorage data ---

function gatherLocalData() {
  const data = {};
  // knownCards
  data.knownCards = jsonParse(localStorage.getItem('knownCards'), []);
  // learned
  data.learnedPhrases = jsonParse(localStorage.getItem('fluentge-learned-phrases'), []);
  data.learnedGrammar = jsonParse(localStorage.getItem('fluentge-learned-grammar'), []);
  data.learnedPodcasts = jsonParse(localStorage.getItem('fluentge-learned-podcasts'), []);
  // game records
  data.gameRecords = jsonParse(localStorage.getItem('fluentge-game-records'), {});
  // premium
  data.premium = localStorage.getItem('fluentge-premium') === 'true';
  // SRS data (multiple keys)
  data.srsData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('fluentge-srs-')) {
      const deckId = key.replace('fluentge-srs-', '');
      data.srsData[deckId] = jsonParse(localStorage.getItem(key), {});
    }
  }
  // Flashcard app progress + stats
  data.flashcardProgress = jsonParse(localStorage.getItem('fluentge_progress'), {});
  data.flashcardStats = jsonParse(localStorage.getItem('fluentge_stats'), {});
  // card_progress_ keys (spaced repetition per card)
  data.cardProgress = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('card_progress_')) {
      data.cardProgress[key] = jsonParse(localStorage.getItem(key), {});
    }
  }
  return data;
}

// --- Apply cloud data to localStorage ---

function applyMergedData(local, cloud) {
  // Arrays: merge without duplicates (cloud wins on conflicts)
  const knownCards = mergeArrays(local.knownCards, cloud.knownCards || []);
  localStorage.setItem('knownCards', JSON.stringify(knownCards));

  const learnedPhrases = mergeArrays(local.learnedPhrases, cloud.learnedPhrases || []);
  localStorage.setItem('fluentge-learned-phrases', JSON.stringify(learnedPhrases));

  const learnedGrammar = mergeArrays(local.learnedGrammar, cloud.learnedGrammar || []);
  localStorage.setItem('fluentge-learned-grammar', JSON.stringify(learnedGrammar));

  const learnedPodcasts = mergeArrays(local.learnedPodcasts, cloud.learnedPodcasts || []);
  localStorage.setItem('fluentge-learned-podcasts', JSON.stringify(learnedPodcasts));

  // Objects: cloud overrides
  const gameRecords = mergeObjects(local.gameRecords, cloud.gameRecords || {});
  localStorage.setItem('fluentge-game-records', JSON.stringify(gameRecords));

  // Premium: cloud wins
  if (cloud.premium !== undefined) {
    localStorage.setItem('fluentge-premium', cloud.premium ? 'true' : 'false');
  }

  // SRS data: merge per deck (cloud wins per-key)
  const allDecks = new Set([...Object.keys(local.srsData || {}), ...Object.keys(cloud.srsData || {})]);
  for (const deckId of allDecks) {
    const merged = mergeObjects(local.srsData?.[deckId], cloud.srsData?.[deckId]);
    localStorage.setItem('fluentge-srs-' + deckId, JSON.stringify(merged));
  }

  // Flashcard progress & stats
  const flashcardProgress = mergeObjects(local.flashcardProgress, cloud.flashcardProgress || {});
  localStorage.setItem('fluentge_progress', JSON.stringify(flashcardProgress));

  const flashcardStats = mergeObjects(local.flashcardStats, cloud.flashcardStats || {});
  localStorage.setItem('fluentge_stats', JSON.stringify(flashcardStats));

  // Card progress keys
  const allCardKeys = new Set([...Object.keys(local.cardProgress || {}), ...Object.keys(cloud.cardProgress || {})]);
  for (const key of allCardKeys) {
    const merged = mergeObjects(local.cardProgress?.[key], cloud.cardProgress?.[key]);
    localStorage.setItem(key, JSON.stringify(merged));
  }
}

// --- Firestore operations ---

async function loadFromCloud(uid) {
  if (!db) return;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const cloud = snap.data().progress || {};
      const local = gatherLocalData();
      applyMergedData(local, cloud);
      console.log('[FluentGe Sync] Loaded & merged from cloud');
    } else {
      console.log('[FluentGe Sync] No cloud data yet, will create on next save');
    }
  } catch (e) {
    console.warn('[FluentGe Sync] Load failed (offline?):', e.message);
  }
}

let lastSavedHash = '';
async function saveToCloud(uid) {
  if (!db) return;
  try {
    const data = gatherLocalData();
    const hash = JSON.stringify(data);
    if (hash === lastSavedHash) return; // Skip if nothing changed
    data.lastSync = new Date().toISOString();
    lastSavedHash = hash;
    // Also save leaderboard-visible data at top level
    const totalXP = parseInt(localStorage.getItem('totalXP') || '0', 10);
    const userName = (() => { try { const u = JSON.parse(localStorage.getItem('fluentge-user') || '{}'); return u.name || 'მომხმარებელი'; } catch { return 'მომხმარებელი'; } })();
    const avatar = localStorage.getItem('fluentge-avatar') || '😊';
    await setDoc(doc(db, 'users', uid), { progress: data, displayName: userName, avatar: avatar, totalXP: totalXP }, { merge: true });
    console.log('[FluentGe Sync] Saved to cloud');
  } catch (e) {
    console.warn('[FluentGe Sync] Save failed (offline?):', e.message);
  }
}

// --- Auth listener ---

let onBeforeUnload = null;
onAuthStateChanged(auth, async (user) => {
  if (syncInterval) { clearInterval(syncInterval); syncInterval = null; }
  if (onBeforeUnload) { window.removeEventListener('beforeunload', onBeforeUnload); onBeforeUnload = null; }

  if (user) {
    currentUid = user.uid;
    // Load from cloud on login
    await loadFromCloud(user.uid);
    // Periodic save every 60s (with hash dedup to avoid unnecessary writes)
    syncInterval = setInterval(() => saveToCloud(user.uid), 60000);
    // Save on page unload
    onBeforeUnload = () => saveToCloud(user.uid);
    window.addEventListener('beforeunload', onBeforeUnload);
  } else {
    currentUid = null;
  }
});

// Fetch top users for leaderboard
async function getLeaderboard(topN = 10) {
  if (!db) return [];
  try {
    const q = query(collection(db, 'users'), orderBy('totalXP', 'desc'), limit(topN));
    const snap = await getDocs(q);
    const results = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.totalXP > 0) {
        results.push({ uid: d.id, name: data.displayName || 'მომხმარებელი', avatar: data.avatar || '😊', xp: data.totalXP || 0 });
      }
    });
    return results;
  } catch (e) {
    console.warn('[FluentGe Sync] Leaderboard fetch failed:', e.message);
    return [];
  }
}

// Expose for manual use
window.__fluentgeSync = {
  save: () => currentUid && saveToCloud(currentUid),
  load: () => currentUid && loadFromCloud(currentUid),
  getLeaderboard: getLeaderboard,
  getCurrentUid: () => currentUid,
};
