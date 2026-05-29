// store.jsx — central app state (mood log, journal, settings) + persistence toggle.
// Vite React module. Exposes window.useAppStore.

import React from 'react';

const { useState, useEffect, useCallback, useMemo, useRef } = React;

const STORAGE_KEY = 'amanat.v1';

function loadFromStorage(useLocal) {
  const store = useLocal ? window.localStorage : window.sessionStorage;
  try {
    const raw = store.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function saveToStorage(useLocal, data) {
  const store = useLocal ? window.localStorage : window.sessionStorage;
  try { store.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

// We only write to the active store; never clear the other automatically — that
// way toggling persistLocal doesn't wipe data the user might want back.

const DEFAULT_STATE = {
  moodLog: [],
  journalEntries: [],
  reframeLog: [],
  savedScripts: [],
  chatThread: [],
  affirmIdx: 0,
  dayStatus: 'amber',
  hasOnboarded: false,
};

function isLegacyCompanionError(msg) {
  const text = String(msg?.text || '').toLowerCase();
  return text.includes('something interrupted the reply')
    || text.includes('interrupted the reply')
    || (text.includes('the related card') && text.includes('may be one doorway'));
}

function cleanLoadedState(state) {
  if (!state) return state;
  const chatThread = Array.isArray(state.chatThread)
    ? state.chatThread.filter(msg => !isLegacyCompanionError(msg))
    : [];
  return { ...state, chatThread };
}

window.useAppStore = function useAppStore(persistLocal) {
  const [state, setStateRaw] = useState(() => {
    // Read from local if user has previously enabled it
    const initial = cleanLoadedState(loadFromStorage(true) || loadFromStorage(false)) || DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...initial };
  });

  useEffect(() => {
    saveToStorage(persistLocal, state);
  }, [state, persistLocal]);

  const setState = useCallback((updater) => {
    setStateRaw(prev => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
  }, []);

  const logMood = useCallback((mood) => {
    const entry = { ...mood, at: Date.now() };
    setStateRaw(prev => ({ ...prev, moodLog: [...prev.moodLog, entry] }));
    return entry;
  }, []);

  const addJournal = useCallback((text, promptKey) => {
    if (!text || !text.trim()) return;
    const entry = { id: 'j' + Date.now(), text: text.trim(), promptKey, at: Date.now() };
    setStateRaw(prev => ({ ...prev, journalEntries: [entry, ...prev.journalEntries] }));
    return entry;
  }, []);

  const removeJournal = useCallback((id) => {
    setStateRaw(prev => ({ ...prev, journalEntries: prev.journalEntries.filter(j => j.id !== id) }));
  }, []);

  const logReframe = useCallback((inText, outText) => {
    const entry = { in: inText, out: outText, at: Date.now() };
    setStateRaw(prev => ({ ...prev, reframeLog: [entry, ...prev.reframeLog] }));
    return entry;
  }, []);

  const toggleSavedScript = useCallback((scriptId) => {
    setStateRaw(prev => {
      const set = new Set(prev.savedScripts);
      if (set.has(scriptId)) set.delete(scriptId); else set.add(scriptId);
      return { ...prev, savedScripts: [...set] };
    });
  }, []);

  const addChatMsg = useCallback((msg) => {
    setStateRaw(prev => ({ ...prev, chatThread: [...prev.chatThread, msg] }));
  }, []);

  const clearChat = useCallback(() => {
    setStateRaw(prev => ({ ...prev, chatThread: [] }));
  }, []);

  const wipeAll = useCallback(() => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    try { window.sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setStateRaw(DEFAULT_STATE);
  }, []);

  return {
    state,
    setState,
    logMood,
    addJournal,
    removeJournal,
    logReframe,
    toggleSavedScript,
    addChatMsg,
    clearChat,
    wipeAll,
  };
};

// Small helpers -----------------------------------------------------------
window.formatRelativeTime = function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const d = Math.floor(hr / 24);
  if (d === 1) return 'yesterday';
  if (d < 7) return `${d} days ago`;
  const dt = new Date(ts);
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

window.useToast = function useToast() {
  const [toast, setToast] = useState(null);
  const tRef = useRef();
  const show = useCallback((msg, ms = 2200) => {
    setToast(msg);
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToast(null), ms);
  }, []);
  return [toast, show];
};

window.copyToClipboard = async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      return true;
    } catch (e2) { return false; }
  }
};

window.getMoodInsight = function getMoodInsight(moodLog) {
  if (moodLog.length < 3) {
    return {
      headline: 'You\u2019ve logged a few moods. Patterns appear after about a week.',
      detail: 'There is no right shape to feel.',
    };
  }
  const last7 = moodLog.slice(-14);
  const order = ['low','flat','mixed','ok','calm','safe'];
  const score = last7.reduce((s, m) => s + order.indexOf(m.key), 0) / last7.length;
  const trend = last7.length >= 4
    ? (order.indexOf(last7[last7.length - 1].key) - order.indexOf(last7[0].key))
    : 0;
  let headline = 'You\u2019ve been steady this week.';
  if (score < 1.5) headline = 'It\u2019s been a heavy stretch.';
  else if (score < 3) headline = 'Mixed days. That tracks.';
  else if (score < 4.5) headline = 'A gentler week than some.';
  else headline = 'A spacious week so far.';

  let detail = 'You showed up and noticed. That is the practice.';
  if (trend >= 2)  detail = 'You\u2019ve been moving toward more ease across these entries.';
  if (trend <= -2) detail = 'You\u2019ve been moving toward harder ground. This is a moment for kindness, not analysis.';
  return { headline, detail, score, trend, sampleSize: last7.length };
};
