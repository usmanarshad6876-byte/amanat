// app.jsx — Main App. Ties shells + screens + tools + companion + tweaks.
// Vite React module.

import React from 'react';
import { createRoot } from 'react-dom/client';

const { useState: useStateA, useEffect: useEffectA, useCallback: useCallbackA, useMemo: useMemoA, useRef: useRefA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "shell": "tabbar",
  "density": "regular",
  "persistLocal": false,
  "showPanic": true,
  "showResearch": false,
  "userRole": "survivor",
  "sharedDeviceMode": false,
  "lowTextMode": false,
  "tapOnlyMode": false,
  "readAloud": false,
  "safetyLanguage": "english",
  "showClinicalTerms": false,
  "disguiseMode": false,
  "accent": "#2f6f73",
  "fontScale": 1
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  '#2f6f73': { '--forest': '#2f6f73', '--forest-hover': '#225459', '--forest-tint': '#c9e4e4', '--forest-wash': '#e8f3f2' },
  '#425f9c': { '--forest': '#425f9c', '--forest-hover': '#304775', '--forest-tint': '#d8e0f4', '--forest-wash': '#eef2fb' },
  '#8a4662': { '--forest': '#8a4662', '--forest-hover': '#693348', '--forest-tint': '#ecd3dd', '--forest-wash': '#f7edf1' },
  '#3b7357': { '--forest': '#3b7357', '--forest-hover': '#2c5942', '--forest-tint': '#cfe5d8', '--forest-wash': '#edf6f1' },
};

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const persistLocal = !!tweaks.persistLocal;
  const store = window.useAppStore(persistLocal);
  const t = window.useI18n();
  const displayT = useCallbackA((path) => {
    if ((tweaks.disguiseMode || tweaks.sharedDeviceMode) && path === 'brandName') return 'Notes';
    if ((tweaks.disguiseMode || tweaks.sharedDeviceMode) && path === 'brandTagline') return 'private notebook';
    return t(path);
  }, [t, tweaks.disguiseMode, tweaks.sharedDeviceMode]);

  const sameRoute = useCallbackA((a, b) => (
    a?.name === b?.name && JSON.stringify(a?.params || {}) === JSON.stringify(b?.params || {})
  ), []);
  const [navState, setNavState] = useStateA({
    entries: [{ name: 'home', params: {} }],
    index: 0,
  });
  const route = navState.entries[navState.index] || { name: 'home', params: {} };
  const navigate = useCallbackA((name, params = {}) => {
    const next = { name, params };
    setNavState(state => {
      const current = state.entries[state.index];
      if (sameRoute(current, next)) return state;
      const entries = [...state.entries.slice(0, state.index + 1), next];
      return { entries, index: entries.length - 1 };
    });
  }, [sameRoute]);
  const goBack = useCallbackA(() => {
    setNavState(state => ({ ...state, index: Math.max(0, state.index - 1) }));
  }, []);
  const goForward = useCallbackA(() => {
    setNavState(state => ({ ...state, index: Math.min(state.entries.length - 1, state.index + 1) }));
  }, []);

  // Active modal
  const [modal, setModal] = useStateA(null); // 'breathing' | 'grounding' | 'public' | 'danger' | 'checkin' | 'panic'
  const openTool = (kind) => setModal(kind);
  const closeTool = () => setModal(null);
  const quickExit = useCallbackA(() => {
    try { store.wipeAll(); } catch (e) {}
    try { window.sessionStorage.clear(); } catch (e) {}
    window.location.replace('https://www.google.com/');
  }, [store]);

  const [toast, showToast] = window.useToast();
  useEffectA(() => {
    const h = (e) => showToast(e.detail);
    window.addEventListener('amanat:toast', h);
    return () => window.removeEventListener('amanat:toast', h);
  }, [showToast]);

  // Apply accent + font scale
  useEffectA(() => {
    const root = document.documentElement;
    const preset = ACCENT_PRESETS[tweaks.accent] || ACCENT_PRESETS['#2f6f73'];
    Object.entries(preset).forEach(([k, v]) => root.style.setProperty(k, v));
    root.style.setProperty('font-size', (16 * (tweaks.fontScale || 1)) + 'px');
    root.setAttribute('dir', 'ltr');
    document.title = (tweaks.disguiseMode || tweaks.sharedDeviceMode) ? 'Notes' : 'Amanat — a private companion';
    // Density
    const dens = tweaks.density === 'compact' ? 0.85 : tweaks.density === 'comfy' ? 1.15 : 1;
    root.style.setProperty('--density', dens);
  }, [tweaks.accent, tweaks.fontScale, tweaks.density, tweaks.disguiseMode, tweaks.sharedDeviceMode]);

  // Mood with message
  const onLogMood = (mood) => {
    store.logMood(mood);
    showToast(`${mood.label}. ${window.AMANAT_CONTENT.moodMessages[mood.key]}`, 3200);
  };

  const onSaveReframe = (i, o) => store.logReframe(i, o);
  const effectiveShowResearch = !!tweaks.showResearch || tweaks.userRole === 'researcher';

  // Onboarding nudge: if zero moods and zero entries, surface a hint once
  const isHubHome = tweaks.shell === 'hub' && route.name === 'home';

  const homeProps = {
    t, store,
    onNavigate: navigate,
    onStartCheckIn: () => setModal('checkin'),
    onLogMood,
    onOpenTool: openTool,
    onOpenAffirm: () => navigate('tools', { sub: 'affirm' }),
    onOpenPanic: () => setModal('danger'),
  };

  let screen = null;
  if (route.name === 'home') {
    screen = tweaks.shell === 'hub'
      ? <window.Screens.HomeHub {...homeProps} />
      : <window.Screens.HomeStandard {...homeProps} />;
  } else if (route.name === 'tools') {
    screen = <window.Screens.ToolsScreen
      t={t} store={store}
      onLogMood={onLogMood} onOpenTool={openTool} onSaveReframe={onSaveReframe}
      onOpenCompanion={() => navigate('companion')}
      sub={route.params.tool || route.params.sub}
      showResearch={effectiveShowResearch}
      lowTextMode={!!tweaks.lowTextMode}
      tapOnlyMode={!!tweaks.tapOnlyMode}
      readAloud={!!tweaks.readAloud}
      safetyLanguage={tweaks.safetyLanguage || 'english'}
      userRole={tweaks.userRole || 'survivor'}
      showClinicalTerms={!!tweaks.showClinicalTerms}
    />;
  } else if (route.name === 'journal') {
    screen = <window.Screens.JournalScreen t={t} store={store} persistLocal={persistLocal} onOpenTool={openTool} safetyLanguage={tweaks.safetyLanguage || 'english'} />;
  } else if (route.name === 'companion') {
    screen = <window.Screens.CompanionScreen t={t} store={store} persistLocal={persistLocal} onOpenTool={openTool} />;
  } else if (route.name === 'help') {
    screen = <window.Screens.HelpScreen t={t} store={store} sub={route.params.sub} />;
  }

  return (
    <>
      <window.Shell
        kind={tweaks.shell}
        t={displayT}
        current={route.name}
        onNavigate={(id) => navigate(id)}
        canGoBack={navState.index > 0}
        canGoForward={navState.index < navState.entries.length - 1}
        onBack={goBack}
        onForward={goForward}
        onOpenSettings={() => window.postMessage({ type: '__activate_edit_mode' }, '*')}
      >
        {screen}
      </window.Shell>

      {tweaks.showPanic && (
        <button className="panic-btn" onClick={() => setModal('danger')} title="I am not safe" aria-label="I am not safe">
          <window.Icon name="crisis" />
        </button>
      )}
      <button className="quick-exit-btn" onClick={quickExit} title="Quick exit and clear local data" aria-label="Quick exit and clear local data">
        Exit
      </button>

      {modal === 'breathing' && <window.Tools.BoxBreathing onClose={closeTool} />}
      {modal === 'grounding' && <window.Tools.Grounding onClose={closeTool} />}
      {modal === 'public'    && <window.Tools.PublicGrounding onClose={closeTool} />}
      {modal === 'danger'    && <window.Tools.DangerNow onClose={closeTool} onOpenPublic={() => { closeTool(); setTimeout(() => setModal('public'), 50); }} onOpenCompanion={() => { closeTool(); navigate('companion'); }} />}
      {modal === 'checkin'   && <window.Tools.CheckIn onClose={closeTool} onLogMood={(m) => onLogMood(m)} onNavigate={(id) => { if (['breathing','grounding','public','danger','reframe','journal','affirm'].includes(id)) { if (id === 'reframe') navigate('tools', { tool: 'reframe' }); else if (id === 'affirm') navigate('tools', { sub: 'affirm' }); else if (id === 'journal') navigate('journal'); else openTool(id); } else { navigate(id); } }} />}
      {modal === 'panic'     && <window.Tools.Panic onClose={closeTool}
          onOpenBreathing={() => { closeTool(); setTimeout(() => setModal('breathing'), 50); }}
          onOpenGrounding={() => { closeTool(); setTimeout(() => setModal('grounding'), 50); }}
          onOpenCompanion={() => { closeTool(); navigate('companion'); }}
      />}

      {toast && <div className="toast">{toast}</div>}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Shell" />
        <window.TweakRadio  label="Layout" value={tweaks.shell}
          options={[
            { value: 'tabbar', label: 'Tab bar' },
            { value: 'siderail', label: 'Side rail' },
            { value: 'hub', label: 'Hub' },
          ]}
          onChange={v => setTweak('shell', v)} />

        <window.TweakSection label="Comfort" />
        <window.TweakRadio label="Role" value={tweaks.userRole || 'survivor'}
          options={[
            { value: 'survivor', label: 'Survivor' },
            { value: 'partner', label: 'Partner' },
            { value: 'clinician', label: 'Clinician' },
            { value: 'researcher', label: 'Researcher' },
          ]}
          onChange={v => setTweak('userRole', v)} />
        <window.TweakRadio label="Density" value={tweaks.density}
          options={['compact','regular','comfy']}
          onChange={v => setTweak('density', v)} />
        <window.TweakSlider label="Text size" value={tweaks.fontScale} min={0.85} max={1.3} step={0.05} unit="\u00d7"
          onChange={v => setTweak('fontScale', v)} />

        <window.TweakSection label="Mood" />
        <window.TweakColor label="Accent" value={tweaks.accent}
          options={['#2f6f73','#425f9c','#8a4662','#3b7357']}
          onChange={v => setTweak('accent', v)} />

        <window.TweakSection label="Privacy" />
        <window.TweakToggle
          label="Keep my data on this device"
          value={persistLocal}
          description="Nothing is saved unless you choose this. Choosing it stores data in your browser only — it never leaves your device."
          onChange={v => setTweak('persistLocal', v)} />
        <window.TweakToggle label="Show panic button" value={tweaks.showPanic}
          onChange={v => setTweak('showPanic', v)} />
        <window.TweakToggle label="Research mode" value={!!tweaks.showResearch}
          onChange={v => setTweak('showResearch', v)} />
        <window.TweakToggle label="Shared device mode" value={!!tweaks.sharedDeviceMode}
          onChange={v => setTweak('sharedDeviceMode', v)} />
        <window.TweakToggle label="Low-text mode" value={!!tweaks.lowTextMode}
          onChange={v => setTweak('lowTextMode', v)} />
        <window.TweakToggle label="Tap-only mode" value={!!tweaks.tapOnlyMode}
          onChange={v => setTweak('tapOnlyMode', v)} />
        <window.TweakToggle label="Read aloud buttons" value={!!tweaks.readAloud}
          onChange={v => setTweak('readAloud', v)} />
        <window.TweakToggle
          label="Show clinical terms"
          value={!!tweaks.showClinicalTerms}
          description="Uses workbook and clinical module names instead of plain-language titles."
          onChange={v => setTweak('showClinicalTerms', v)} />
        <window.TweakToggle label="Disguise as Notes" value={tweaks.disguiseMode}
          onChange={v => setTweak('disguiseMode', v)} />
        <window.TweakButton label="Quick exit now" onClick={quickExit} />
        <window.TweakButton label="Erase everything" onClick={() => {
          if (confirm('Erase local moods, journal entries, saved scripts, and local chat history from this browser? This cannot erase any text already processed by an AI service.')) store.wipeAll();
        }} />
      </window.TweaksPanel>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
