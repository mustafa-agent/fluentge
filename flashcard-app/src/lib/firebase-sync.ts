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

function mergeArr(a: any[], b: any[]): any[] {
  const s = new Set();
  const r: any[] = [];
  for (const i of [...(b || []), ...(a || [])]) {
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
}

function getUid(): string | null {
  try {
    const user = jp(localStorage.getItem('fluentge-user'), null);
    return user?.uid || null;
  } catch { return null; }
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
