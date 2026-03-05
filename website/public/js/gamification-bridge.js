/**
 * FluentGe Gamification Bridge
 * Standalone JS for non-React pages (grammar, etc.)
 * Reads/writes SAME localStorage keys as React flashcard app
 */
(function() {
  'use strict';

  // --- XP ---
  function getTotalXP() {
    return parseInt(localStorage.getItem('totalXP') || '0', 10);
  }

  function calculateLevel(xp) {
    return Math.floor(xp / 200) + 1;
  }

  function addXP(amount) {
    var currentXP = getTotalXP();
    var currentLevel = calculateLevel(currentXP);
    var newTotal = currentXP + amount;
    var newLevel = calculateLevel(newTotal);
    localStorage.setItem('totalXP', newTotal.toString());
    recordDailyActivity(amount, 0);

    // Update weekly XP for leaderboard
    var now = new Date();
    var day = now.getDay();
    var diff = now.getDate() - day + (day === 0 ? -6 : 1);
    var weekStart = new Date(now.setDate(diff)).toDateString();
    var weekKey = 'fluentge-weekly-xp-' + weekStart;
    var weeklyXP = parseInt(localStorage.getItem(weekKey) || '0', 10);
    localStorage.setItem(weekKey, (weeklyXP + amount).toString());

    return { newTotal: newTotal, levelUp: newLevel > currentLevel, newLevel: newLevel };
  }

  // --- Streak ---
  function getCurrentStreak() {
    return parseInt(localStorage.getItem('currentStreak') || '0', 10);
  }

  function updateStreak() {
    var today = new Date().toDateString();
    var lastDate = localStorage.getItem('lastPracticeDate');
    var currentStreak = getCurrentStreak();

    if (lastDate === today) return currentStreak;

    var yesterday = new Date(Date.now() - 86400000).toDateString();
    var newStreak;
    if (lastDate === yesterday || !lastDate) {
      newStreak = currentStreak + 1;
    } else {
      newStreak = 1;
    }
    localStorage.setItem('currentStreak', newStreak.toString());
    localStorage.setItem('lastPracticeDate', today);
    localStorage.setItem('streakLastDate', today);
    return newStreak;
  }

  // --- Study Time ---
  function getTodayStudyTime() {
    var today = new Date().toDateString();
    var stored = localStorage.getItem('dailyStudyTime');
    if (!stored) return 0;
    try {
      var data = JSON.parse(stored);
      return data.date === today ? data.minutes : 0;
    } catch(e) { return 0; }
  }

  function addStudyTime(minutes) {
    var today = new Date().toDateString();
    var currentTime = getTodayStudyTime();
    var newTime = currentTime + minutes;
    localStorage.setItem('dailyStudyTime', JSON.stringify({ date: today, minutes: newTime }));
    recordDailyActivity(0, 0);
    return newTime;
  }

  // --- Daily Activity ---
  function recordDailyActivity(xpEarned, cardsReviewed) {
    var today = new Date().toDateString();
    var stored = localStorage.getItem('fluentge-daily-history');
    var history = {};
    try { history = stored ? JSON.parse(stored) : {}; } catch(e) { history = {}; }

    var entry = history[today] || { date: today, xp: 0, minutes: 0, cards: 0 };
    entry.xp += xpEarned;
    entry.cards += cardsReviewed;
    entry.minutes = getTodayStudyTime();
    history[today] = entry;

    // Keep 30 days
    var keys = Object.keys(history);
    if (keys.length > 30) {
      keys.sort(function(a, b) { return new Date(a).getTime() - new Date(b).getTime(); });
      for (var i = 0; i < keys.length - 30; i++) delete history[keys[i]];
    }
    localStorage.setItem('fluentge-daily-history', JSON.stringify(history));
  }

  // --- Grammar Completion ---
  function markGrammarComplete(slug) {
    var completed = [];
    try { completed = JSON.parse(localStorage.getItem('fluentge-grammar-completed') || '[]'); } catch(e) {}
    if (completed.indexOf(slug) === -1) {
      completed.push(slug);
      localStorage.setItem('fluentge-grammar-completed', JSON.stringify(completed));
    }
  }

  function isGrammarComplete(slug) {
    try {
      var completed = JSON.parse(localStorage.getItem('fluentge-grammar-completed') || '[]');
      return completed.indexOf(slug) !== -1;
    } catch(e) { return false; }
  }

  // --- Floating XP Animation ---
  function showXPFloat(element, amount) {
    var float = document.createElement('div');
    float.textContent = '+' + amount + ' XP';
    float.className = 'grammar-xp-float';
    float.style.cssText = 'position:absolute;pointer-events:none;font-weight:700;font-size:1.1rem;color:#facc15;z-index:9999;';

    var rect = element.getBoundingClientRect();
    float.style.left = (rect.left + rect.width / 2 - 30) + 'px';
    float.style.top = (rect.top + window.scrollY - 10) + 'px';

    document.body.appendChild(float);
    setTimeout(function() { float.remove(); }, 1200);
  }

  // --- Level Up Popup ---
  function showLevelUp(level) {
    var popup = document.createElement('div');
    popup.innerHTML = '<div style="font-size:2.5rem;margin-bottom:8px">🎉</div>' +
      '<div style="font-size:1.2rem;font-weight:700;margin-bottom:4px">Level ' + level + '!</div>' +
      '<div style="font-size:0.85rem;opacity:0.8">ახალ დონეზე გადახვედი!</div>';
    popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
      'background:linear-gradient(135deg,#7c3aed,#6366f1);color:white;padding:32px 48px;' +
      'border-radius:20px;text-align:center;z-index:10000;box-shadow:0 20px 60px rgba(124,58,237,0.5);' +
      'animation:fadeIn 0.3s ease;';
    document.body.appendChild(popup);
    setTimeout(function() {
      popup.style.opacity = '0';
      popup.style.transition = 'opacity 0.5s';
      setTimeout(function() { popup.remove(); }, 500);
    }, 2000);
  }

  // --- XP Counter Pill ---
  function createXPCounter() {
    var existing = document.getElementById('grammar-xp-counter');
    if (existing) return existing;

    var counter = document.createElement('div');
    counter.id = 'grammar-xp-counter';
    counter.className = 'grammar-xp-counter';
    counter.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9998;' +
      'background:linear-gradient(135deg,#f59e0b,#eab308);color:#1a1a1a;' +
      'padding:8px 16px;border-radius:50px;font-weight:700;font-size:0.9rem;' +
      'box-shadow:0 4px 12px rgba(245,158,11,0.3);display:flex;align-items:center;gap:6px;' +
      'transition:transform 0.2s;';
    counter.innerHTML = '⭐ <span id="grammar-xp-value">0</span> XP';
    document.body.appendChild(counter);
    return counter;
  }

  function updateXPCounter(total) {
    var val = document.getElementById('grammar-xp-value');
    if (val) {
      val.textContent = total >= 1000 ? (total / 1000).toFixed(1) + 'k' : total;
      var counter = document.getElementById('grammar-xp-counter');
      if (counter) {
        counter.style.transform = 'scale(1.15)';
        setTimeout(function() { counter.style.transform = 'scale(1)'; }, 200);
      }
    }
  }

  // --- Stats ---
  function getStats() {
    var totalXP = getTotalXP();
    return {
      totalXP: totalXP,
      currentStreak: getCurrentStreak(),
      level: calculateLevel(totalXP),
      dailyMinutes: getTodayStudyTime(),
      dailyGoal: parseInt(localStorage.getItem('dailyGoalMinutes') || '10', 10)
    };
  }

  // --- Track exercise start time ---
  var exerciseStartTime = null;

  function startTimer() {
    exerciseStartTime = Date.now();
  }

  function stopTimer() {
    if (!exerciseStartTime) return 0;
    var minutes = Math.max(1, Math.round((Date.now() - exerciseStartTime) / 60000));
    exerciseStartTime = null;
    return minutes;
  }

  // --- Public API ---
  window.FluentGe = {
    addXP: addXP,
    getTotalXP: getTotalXP,
    calculateLevel: calculateLevel,
    updateStreak: updateStreak,
    getCurrentStreak: getCurrentStreak,
    addStudyTime: addStudyTime,
    markGrammarComplete: markGrammarComplete,
    isGrammarComplete: isGrammarComplete,
    showXPFloat: showXPFloat,
    showLevelUp: showLevelUp,
    createXPCounter: createXPCounter,
    updateXPCounter: updateXPCounter,
    getStats: getStats,
    startTimer: startTimer,
    stopTimer: stopTimer
  };
})();
