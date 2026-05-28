// screens.jsx — Home, Tools, Journal, Help, Partners, Language guide.
// Vite React module. Exposes window.Screens.

import React from 'react';

const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS, useRef: useRefS } = React;

function greeting(t) {
  const h = new Date().getHours();
  if (h < 5)  return t('home.greetingNight');
  if (h < 12) return t('home.greetingMorning');
  if (h < 17) return t('home.greetingAfternoon');
  if (h < 22) return t('home.greetingEvening');
  return t('home.greetingNight');
}

const DAY_STATUS = {
  green: {
    label: 'Steady',
    eyebrow: 'I feel steady enough',
    title: 'A good moment to notice one pattern gently.',
    body: 'You do not need to dig. If you have room, read one card slowly or choose one small act of care.',
    action: 'Read a card',
    tone: 'safe',
  },
  amber: {
    label: 'Activated',
    eyebrow: 'My body is activated',
    title: 'The body may need a smaller day.',
    body: 'Reduce demand. Pick one essential thing, one body step, and one boundary you do not have to explain.',
    action: 'Open rough-day plan',
    tone: 'amber',
  },
  red: {
    label: 'Overwhelmed',
    eyebrow: 'I feel overwhelmed',
    title: 'No major decisions right now.',
    body: 'First: feet, room, water, contact. Do not analyse trauma or send hard messages while flooded.',
    action: 'Start guided protocol',
    tone: 'crisis',
  },
};

const HOME_NEEDS = [
  {
    title: 'I need help now',
    desc: 'Danger, self-harm risk, coercion, or nowhere safe to be.',
    icon: 'crisis',
    tone: 'crisis',
    action: ({ onOpenPanic }) => onOpenPanic(),
  },
  {
    title: 'I feel triggered',
    desc: 'Help me through this moment before I explain it.',
    icon: 'grounding',
    action: ({ onNavigate }) => onNavigate('tools', { sub: 'guide' }),
  },
  {
    title: "I don't know what I need",
    desc: 'Start with three gentle choices. No right answer needed.',
    icon: 'checkin',
    action: ({ onNavigate }) => onNavigate('tools', { sub: 'guide' }),
  },
  {
    title: 'I need to calm my body',
    desc: 'Something I can try now: grounding, breath, or discreet reset.',
    icon: 'breathing',
    action: ({ onOpenTool }) => onOpenTool('grounding'),
  },
  {
    title: 'I need words to say',
    desc: 'Boundary lines, repair words, and scripts I can copy.',
    icon: 'language',
    action: ({ onNavigate }) => onNavigate('tools', { sub: 'boundaries' }),
  },
  {
    title: 'I need a plan for tonight',
    desc: 'Night-time loneliness, sleep fear, nightmares, or after-dark panic.',
    icon: 'moon',
    action: ({ onNavigate }) => onNavigate('tools', { sub: 'night' }),
  },
];

function SafetyOpening({ onOpenPanic }) {
  return (
    <div className="safety-opening reveal">
      <div>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Safety first</p>
        <p>
          Amanat is a private self-support companion. It is not emergency care.
          If you are in immediate danger, contact local emergency support or a trusted person.
        </p>
      </div>
      <button className="btn btn-crisis" onClick={onOpenPanic}>
        <window.Icon name="crisis" size={16} /> I need help now
      </button>
    </div>
  );
}

function HomeNeedsPanel({ onNavigate, onOpenTool, onOpenPanic }) {
  const handlers = { onNavigate, onOpenTool, onOpenPanic };
  return (
    <section className="home-needs reveal">
      <div className="section-header home-section-header">
        <div>
          <p className="section-eyebrow">I need support</p>
          <h2 className="section-title">What do you need right now?</h2>
        </div>
      </div>
      <div className="home-need-grid">
        {HOME_NEEDS.map(item => (
          <button key={item.title} className={"home-need-card" + (item.tone === 'crisis' ? ' home-need-card-crisis' : '')} onClick={() => item.action(handlers)}>
            <span className="home-need-icon"><window.Icon name={item.icon} size={22} /></span>
            <span className="home-need-copy">
              <strong>{item.title}</strong>
              <small>{item.desc}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function DayStatusPanel({ status = 'amber', onChange, onNavigate, onOpenTool }) {
  const active = DAY_STATUS[status] || DAY_STATUS.amber;
  const go = () => {
    if (status === 'green') onNavigate('tools', { sub: 'cards' });
    else onNavigate('tools', { sub: 'roughday' });
  };
  return (
    <div className={"day-window-card day-window-" + active.tone}>
      <div className="day-window-meter" aria-hidden="true">
        <span className={"day-window-needle day-window-needle-" + status} />
      </div>
      <div className="day-window-copy">
        <div className="cluster" style={{ gap: 8 }}>
          <span className="eyebrow">{active.eyebrow}</span>
          <span className="chip">Today: {active.label}</span>
        </div>
        <h2 className="display" style={{ fontSize: 26, marginTop: 8 }}>{active.title}</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{active.body}</p>
        <div className="cluster" style={{ marginTop: 14 }}>
          {Object.entries(DAY_STATUS).map(([key, value]) => (
            <button key={key} className={"status-chip " + (status === key ? 'status-chip-active' : '')} onClick={() => onChange(key)}>
              <span className={"status-dot status-dot-" + key} />
              {value.label}
            </button>
          ))}
        </div>
        <div className="cluster" style={{ marginTop: 14 }}>
          <button className={status === 'red' ? 'btn btn-crisis' : 'btn btn-forest'} onClick={go}>
            {active.action} <window.Icon name="arrowRight" size={16} />
          </button>
          <button className="btn btn-ghost" onClick={() => onOpenTool(status === 'red' ? 'grounding' : 'public')}>
            {status === 'red' ? 'Ground first' : '30-second reset'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HOME — adapts to shell variant
// ────────────────────────────────────────────────────────────────────────────
function HomeStandard({ t, lang, store, onNavigate, onStartCheckIn, onLogMood, onOpenTool, onOpenAffirm, onOpenPanic }) {
  const { state } = store;
  const affirm = window.AMANAT_CONTENT.affirmations[state.affirmIdx % window.AMANAT_CONTENT.affirmations.length];
  const recent = state.moodLog.slice(-5).reverse();
  const dayStatus = state.dayStatus || 'amber';
  const setDayStatus = (next) => {
    store.setState(prev => ({ ...prev, dayStatus: next }));
    window.dispatchEvent(new CustomEvent('amanat:toast', { detail: `Today marked as ${DAY_STATUS[next].label}.` }));
  };

  return (
    <div className="page">
      <div className="reveal">
        <p className="eyebrow">{greeting(t)}</p>
        <h1 className="page-title">{t('home.subtitle')}</h1>
        <p className="page-lede">Help me through this moment. Choose one door, or choose “I don’t know what I need.”</p>
      </div>

      <SafetyOpening onOpenPanic={onOpenPanic} />

      <HomeNeedsPanel onNavigate={onNavigate} onOpenTool={onOpenTool} onOpenPanic={onOpenPanic} />

      <div className="reveal" style={{ marginTop: 18 }}>
        <DayStatusPanel status={dayStatus} onChange={setDayStatus} onNavigate={onNavigate} onOpenTool={onOpenTool} />
      </div>

      {/* Quick mood */}
      <div className="card reveal" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="eyebrow">Mood check</p>
            <h3 className="display" style={{ fontSize: 22, marginTop: 4 }}>How do you feel right now?</h3>
          </div>
          {recent.length > 0 && (
            <button className="btn btn-ghost btn-tiny" onClick={() => onNavigate('tools', { sub: 'mood' })}>See mood history <window.Icon name="chevronRight" size={14} /></button>
          )}
        </div>
        <div className="cluster" style={{ gap: 10, marginTop: 16 }}>
          {window.AMANAT_CONTENT.moodVocab.map(m => (
            <button key={m.key} className="mood-dot" onClick={() => onLogMood(m)} title={m.label}>
              <span className="mood-glyph" style={{ background: m.wash }}>{m.glyph}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>
        {recent.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>{t('home.recentMood')}</p>
            <div className="cluster" style={{ gap: 6 }}>
              {recent.map((m, i) => (
                <span key={i} className="chip" title={new Date(m.at).toLocaleString()}>
                  <span style={{ fontSize: 14 }}>{m.glyph || ''}</span> {m.label} · {window.formatRelativeTime(m.at)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid-2 reveal" style={{ marginTop: 18 }}>
        <div className="card-tactile quote-card">
          <p className="eyebrow">{t('home.quickAffirm')}</p>
          <p className="display-italic" style={{ fontSize: 22, lineHeight: 1.4, marginTop: 10 }}>
            "{affirm}"
          </p>
          <div className="cluster" style={{ marginTop: 16 }}>
            <button className="btn btn-soft btn-tiny" onClick={onOpenAffirm}>More affirmations</button>
            <button className="btn btn-ghost btn-tiny" onClick={async () => { await window.copyToClipboard(affirm); alert('Copied.'); }}>
              <window.Icon name="copy" size={14} /> Copy
            </button>
          </div>
        </div>
        <div className="card-tactile card-action">
          <p className="eyebrow" style={{ color: 'var(--forest)' }}>2 minutes</p>
          <h2 className="display" style={{ fontSize: 28, marginTop: 6 }}>Start a check-in</h2>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
            Three soft questions. Then one possible next step. You can skip any step.
          </p>
          <div className="cluster" style={{ marginTop: 18 }}>
            <button className="btn btn-forest" onClick={onStartCheckIn}>{t('home.startCheckIn')} <window.Icon name="arrowRight" size={16} /></button>
            <button className="btn btn-ghost" onClick={() => onNavigate('tools')}>{t('home.browseTools')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolTile({ label, desc, icon, onClick, tone }) {
  const tileTone = tone || (icon === 'crisis' ? 'crisis' : 'default');
  return (
    <button className={"tool-tile tool-tile-" + tileTone} onClick={onClick}>
      <span className="tool-tile-icon">
        <window.Icon name={icon} size={20} />
      </span>
      <span className="tool-tile-copy">
        <span className="tool-tile-title">{label}</span>
        <span className="tool-tile-desc">{desc}</span>
      </span>
    </button>
  );
}

function ToolSection({ title, intro, children }) {
  return (
    <section className="tool-section">
      <div>
        <h2 className="tool-section-title">{title}</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 4 }}>{intro}</p>
      </div>
      <div className="grid-3">
        {children}
      </div>
    </section>
  );
}

// HUB version of home — radial nodes
function HomeHub({ t, lang, store, onNavigate, onStartCheckIn, onLogMood, onOpenTool, onOpenAffirm, onOpenPanic }) {
  const affirm = window.AMANAT_CONTENT.affirmations[store.state.affirmIdx % window.AMANAT_CONTENT.affirmations.length];
  const nodes = [
    { id: 'breathing', icon: 'breathing', label: t('tools.breathing'), angle: -90 },
    { id: 'grounding', icon: 'grounding', label: t('tools.grounding'), angle: -40 },
    { id: 'journal',   icon: 'journal',   label: t('nav.journal'),    angle: 10,  nav: true },
    { id: 'companion', icon: 'companion', label: t('nav.companion'),  angle: 60,  nav: true },
    { id: 'reframe',   icon: 'reframe',   label: t('tools.reframe'),  angle: 120 },
    { id: 'help',      icon: 'help',      label: t('nav.help'),       angle: 170, nav: true },
    { id: 'tools',     icon: 'tools',     label: t('nav.tools'),      angle: 220, nav: true },
    { id: 'crisis',    icon: 'crisis',    label: 'Help now', angle: 270, crisis: true },
  ];

  return (
    <div className="hub-stage">
      <div className="hub-greeting reveal">
        <p className="eyebrow">{greeting(t)}</p>
        <h1>{t('home.subtitle')}</h1>
        <p>"{affirm}"</p>
      </div>
      <div className="hub-ring">
        <div className="hub-center">
          <button className="hub-center-inner" onClick={onStartCheckIn}>
            <span className="eyebrow">2 minutes</span>
            <span className="display">Begin a check-in</span>
            <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>or pick a node</span>
          </button>
        </div>
        {nodes.map(n => {
          const rad = (n.angle * Math.PI) / 180;
          const r = 40; // percent
          const left = 50 + r * Math.cos(rad) - 11;
          const top  = 50 + r * Math.sin(rad) - 11;
          return (
            <button key={n.id}
              className={"hub-node" + (n.crisis ? ' crisis' : '')}
              style={{ left: left + '%', top: top + '%' }}
              onClick={() => {
                if (n.crisis) onOpenPanic();
                else if (n.nav) onNavigate(n.id);
                else onOpenTool(n.id);
              }}
            >
              <window.Icon name={n.icon} />
              <span>{n.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TOOLS screen — full surface for breathing/grounding/reframe + mood + affirmations
// ────────────────────────────────────────────────────────────────────────────
function ToolsScreen({ t, store, onLogMood, onOpenTool, onSaveReframe, sub, showResearch = false, lowTextMode = false, tapOnlyMode = false, readAloud = false, safetyLanguage = 'english', userRole = 'survivor' }) {
  const [tab, setTab] = useStateS(sub || 'overview');
  const showBrowseLists = userRole !== 'survivor';
  useEffectS(() => { if (sub) setTab(sub); }, [sub]);
  useEffectS(() => {
    if (!showResearch && tab === 'research') setTab('overview');
  }, [showResearch, tab]);

  const toolGroups = [
    {
      id: 'now',
      label: 'Help now',
      desc: 'Safety, calming, and one next step.',
      tabs: [
        { id: 'overview',  label: 'Start here' },
        { id: 'guide',     label: "I don't know" },
        { id: 'unsafe',    label: 'I am not safe' },
        { id: 'coercion',  label: 'Being controlled' },
        { id: 'dv',        label: 'Quiet safety plan' },
        { id: 'csa',       label: 'Past abuse' },
        { id: 'medical',   label: 'Body danger signs' },
        { id: 'privacy',   label: 'Shared phone safety' },
        { id: 'modes',     label: 'Support modes' },
        { id: 'mood',      label: 'Mood check' },
        { id: 'reframe',   label: t('tools.reframe') },
        { id: 'affirm',    label: 'Safe sentences' },
      ],
    },
    {
      id: 'patterns',
      label: 'I feel triggered',
      desc: 'Shame, triggers, body alarm, and old stories.',
      tabs: [
        { id: 'cards',     label: 'Survivor cards' },
        { id: 'shame',     label: 'Shame spiral map' },
        { id: 'profiles',  label: 'Body responses' },
        { id: 'triggers',  label: 'Trigger library' },
        { id: 'language',  label: 'Safer words' },
        { id: 'loops',     label: 'Thought loops' },
      ],
    },
    {
      id: 'repair',
      label: 'I need words to say',
      desc: 'Scripts and plans for hard or tender moments.',
      tabs: [
        { id: 'boundaries', label: 'Boundary scripts' },
        { id: 'anger',     label: 'Anger and grief' },
        { id: 'roughday',  label: 'Rough-day plan' },
        { id: 'night',     label: 'Night plan' },
        { id: 'goodday',   label: 'Good-day safety' },
      ],
    },
    {
      id: 'contexts',
      label: 'What this is about',
      desc: 'Family, faith, work, relationships, and night.',
      tabs: [
        { id: 'environment', label: 'Place safety' },
        { id: 'culture',   label: 'Family and faith' },
        { id: 'relationships', label: 'Relationships' },
        { id: 'intimacy',  label: 'Safe intimacy' },
        { id: 'workplace', label: 'Work pressure' },
      ],
    },
    ...(showResearch ? [{
      id: 'research',
      label: 'Research',
      desc: 'Codebooks and capture references.',
      tabs: [{ id: 'research', label: 'Research dashboard' }],
    }] : []),
  ];
  const activeGroup = toolGroups.find(group => group.tabs.some(x => x.id === tab)) || toolGroups[0];

  return (
    <div className="page">
      <div className="reveal">
        <p className="eyebrow">Tools</p>
        <h1 className="page-title">Help me through this moment</h1>
        <p className="page-lede">{tapOnlyMode ? 'Tap one button. No typing needed.' : lowTextMode ? 'Pick one door. You can stop anytime.' : userRole === 'survivor' ? 'Start with safety, then one body step, one script, or one context. The larger libraries stay tucked away unless you open them.' : 'Start with safety, then choose the body, words, pattern, or life context that fits. Use any. Skip any.'}</p>
      </div>
      <div className="tool-nav reveal">
        <div className="tool-group-nav" aria-label="Tool groups">
          {toolGroups.map(group => (
            <button key={group.id} className={"tool-group-pill" + (activeGroup.id === group.id ? ' tool-group-pill-active' : '')} onClick={() => setTab(group.tabs[0].id)}>
              <span>{group.label}</span>
              <small>{group.desc}</small>
            </button>
          ))}
        </div>
        <div className="cluster" style={{ gap: 6 }} aria-label={`${activeGroup.label} tools`}>
          {activeGroup.tabs.map(x => (
            <button key={x.id} className={"chip" + (tab === x.id ? ' chip-active' : '')} onClick={() => setTab(x.id)}>{x.label}</button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <div className="stack reveal">
          <ToolSection title="I need help now" intro="For moments when you need one step, not a whole library.">
            <ToolTile label="I don't know what I need" desc="Answer one safety question, then get one next step." icon="checkin" onClick={() => setTab('guide')} />
            <ToolTile label="I am not safe" desc="Use this for immediate danger, self-harm risk, being trapped, or severe dissociation." icon="crisis" onClick={() => setTab('unsafe')} />
            <ToolTile label="Someone is controlling me" desc="For monitoring, threats, forced choices, blocked exits, or fear of saying no." icon="shield" onClick={() => setTab('coercion')} />
            <ToolTile label="I need a quiet safety plan" desc="Make a private safety plan without confrontation or disclosure." icon="shield" onClick={() => setTab('dv')} />
            <ToolTile label="A past abuse memory came up" desc="Go slowly if childhood sexual abuse was named, remembered, or disclosed." icon="crisis" onClick={() => setTab('csa')} />
            <ToolTile label="My body may need medical help" desc="Check danger signs when symptoms may need urgent care, not only grounding." icon="phone" onClick={() => setTab('medical')} />
          </ToolSection>

          <ToolSection title="I need to calm my body" intro="Short tools for grounding before reflection.">
            <ToolTile label={t('tools.breathing')} desc={t('tools.breathingDesc')} icon="breathing" onClick={() => onOpenTool('breathing')} />
            <ToolTile label={t('tools.publicMode')} desc={t('tools.publicModeDesc')} icon="shield" onClick={() => onOpenTool('public')} />
            <ToolTile label={t('tools.grounding')} desc={t('tools.groundingDesc')} icon="grounding" onClick={() => onOpenTool('grounding')} />
            <ToolTile label={t('tools.checkIn')} desc={t('tools.checkInDesc')} icon="checkin" onClick={() => onOpenTool('checkin')} />
          </ToolSection>

          <ToolSection title="I feel triggered" intro="Use these after the body has a little more room.">
            <ToolTile label="Reframe a thought" desc="Write one trauma thought and receive a gentler safety-based reframe." icon="reframe" onClick={() => setTab('reframe')} />
            <ToolTile label="Survivor cards" desc="Draw one card for what may be happening now and what to try next." icon="journal" onClick={() => setTab('cards')} />
            <ToolTile label="What my body may be doing" desc="Understand fight, flight, freeze, fawn, fix, collapse, or feeling far away." icon="mood" onClick={() => setTab('profiles')} />
            <ToolTile label="Shame spiral" desc="Name the old shame story and find one repair step." icon="language" onClick={() => setTab('shame')} />
          </ToolSection>

          <ToolSection title="I need words to say" intro="Scripts and plans for boundaries, rough days, night, anger, grief, and good days.">
            <ToolTile label="Boundary scripts" desc="Copy a sentence for saying no, asking for space, or naming a need." icon="shield" onClick={() => setTab('boundaries')} />
            <ToolTile label="Rough-day plan" desc="Move through safe-enough, flooded, and urgent steps for a hard day." icon="crisis" onClick={() => setTab('roughday')} />
            <ToolTile label="Night safety plan" desc="Use before-bed, during-night, or after-nightmare support." icon="breathing" onClick={() => setTab('night')} />
            <ToolTile label="Anger and grief" desc="Validate anger and grief without turning them into harm." icon="leaf" onClick={() => setTab('anger')} />
            <ToolTile label="Good-day safety" desc="Practice receiving calm, praise, love, or success slowly." icon="leaf" onClick={() => setTab('goodday')} />
            <ToolTile label="Safe sentences" desc="Read short lines when you need steadiness without analysis." icon="leaf" onClick={() => setTab('affirm')} />
          </ToolSection>

          <ToolSection title="What this is connected to" intro="Culturally grounded pathways for the places and pressures that can make trauma louder.">
            <ToolTile label="Place safety" desc="Check privacy, exits, sensory triggers, crowding, and safer adjustments." icon="grounding" onClick={() => setTab('environment')} />
            <ToolTile label="Family pressure" desc="For honour, obedience, emotional blackmail, and safer family scripts." icon="partners" onClick={() => setTab('culture')} />
            <ToolTile label="Religious guilt or spiritual comfort" desc="Find faith-sensitive words without preaching, blame, or forced patience." icon="leaf" onClick={() => setTab('culture')} />
            <ToolTile label="Marriage or relationship pressure" desc="For rishta pressure, in-laws, abandonment fear, conflict, needs, and repair." icon="companion" onClick={() => setTab('relationships')} />
            <ToolTile label="Workplace humiliation" desc="For feedback, hierarchy, public correction, deadlines, and discreet grounding." icon="journal" onClick={() => setTab('workplace')} />
            <ToolTile label="Night-time loneliness" desc="Use night support when fear, loneliness, or memories get louder after dark." icon="moon" onClick={() => setTab('night')} />
            <ToolTile label="Safe intimacy" desc="Support consent, pacing, pause signals, choice, and aftercare." icon="shield" onClick={() => setTab('intimacy')} />
          </ToolSection>

          {showResearch && (
            <ToolSection title="Research mode" intro="Reference material for codebooks and capture fields.">
              <ToolTile label="Research dashboard" desc="Codebook, capture fields, and baseline summaries." icon="tools" onClick={() => setTab('research')} />
            </ToolSection>
          )}
        </div>
      )}

      {tab === 'guide' && <WhatNowPanel onSelectTab={setTab} onOpenTool={onOpenTool} />}
      {tab === 'unsafe' && <NotSafePanel onOpenTool={onOpenTool} safetyLanguage={safetyLanguage} lowTextMode={lowTextMode} />}
      {tab === 'coercion' && <CoercionPanel onOpenTool={onOpenTool} safetyLanguage={safetyLanguage} lowTextMode={lowTextMode} />}
      {tab === 'dv' && <DomesticViolencePlanPanel onOpenTool={onOpenTool} safetyLanguage={safetyLanguage} lowTextMode={lowTextMode} />}
      {tab === 'csa' && <CsaDisclosurePanel onOpenTool={onOpenTool} />}
      {tab === 'medical' && <MedicalRedFlagsPanel onOpenTool={onOpenTool} />}
      {tab === 'privacy' && <SharedDevicePanel lowTextMode={lowTextMode} />}
      {tab === 'modes' && <ModesPanel onOpenTool={onOpenTool} />}
      {tab === 'mood' && <MoodPanel store={store} onLogMood={onLogMood} />}
      {tab === 'reframe' && <window.Tools.Reframe lastReframes={store.state.reframeLog} onSave={(i, o) => onSaveReframe(i, o)} />}
      {tab === 'cards' && <SurvivorCardsPanel showBrowseLists={showBrowseLists} tapOnlyMode={tapOnlyMode} readAloud={readAloud} />}
      {tab === 'shame' && <ShameSpiralPanel showBrowseLists={showBrowseLists} tapOnlyMode={tapOnlyMode} readAloud={readAloud} />}
      {tab === 'profiles' && <ResponseProfilesPanel showBrowseLists={showBrowseLists} tapOnlyMode={tapOnlyMode} readAloud={readAloud} />}
      {tab === 'boundaries' && <BoundaryScriptsPanel showBrowseLists={showBrowseLists} tapOnlyMode={tapOnlyMode} readAloud={readAloud} />}
      {tab === 'anger' && <ModuleLibraryPanel moduleKey="angerGrief" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'roughday' && <RoughDayGuidedPanel onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'roughday' && <div style={{ marginTop: 18 }}><ModuleLibraryPanel moduleKey="roughDay" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} /></div>}
      {tab === 'night' && <ModuleLibraryPanel moduleKey="night" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'goodday' && <ModuleLibraryPanel moduleKey="goodDay" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'environment' && <ModuleLibraryPanel moduleKey="environmentSafety" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'culture' && <ModuleLibraryPanel moduleKey="culture" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'relationships' && <ModuleLibraryPanel moduleKey="relationships" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'intimacy' && <ModuleLibraryPanel moduleKey="intimacy" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {tab === 'workplace' && <ModuleLibraryPanel moduleKey="workplace" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists={showBrowseLists} onOpenTool={onOpenTool} onUnsafe={() => setTab('unsafe')} />}
      {showResearch && tab === 'research' && <ResearchWorkspacePanel lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} />}
      {tab === 'triggers' && <TriggerLibraryPanel showBrowseLists={showBrowseLists} tapOnlyMode={tapOnlyMode} readAloud={readAloud} />}
      {tab === 'language' && <LanguagePanel data={window.AMANAT_CONTENT.languageGuide} eyebrowText="Old alarm says" eyebrowSafe="Steadiness says" intro="These shifts are not corrections to force on anyone. They are gentler alternatives, when the nervous system is ready for one." />}
      {tab === 'loops' && <LanguagePanel data={window.AMANAT_CONTENT.mindLoops} eyebrowText="Loop says" eyebrowSafe="Grounding says" intro="These patterns are about what the mind has learned to believe about thinking, remembering, scanning, feeling, and healing." />}
      {tab === 'affirm' && <AffirmPanel store={store} />}
    </div>
  );
}

function HiddenResultsCard({ count, label, onShow }) {
  return (
    <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
      <p className="eyebrow" style={{ color: 'var(--forest)' }}>Library list hidden</p>
      <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
        {count} {label} are available. Survivor mode keeps the large list closed so this screen stays calmer.
      </p>
      <div className="cluster" style={{ marginTop: 12 }}>
        <button className="btn btn-soft btn-tiny" onClick={onShow}>
          <window.Icon name="tools" size={14} /> Show list
        </button>
      </div>
    </div>
  );
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    window.dispatchEvent(new CustomEvent('amanat:toast', { detail: 'Read aloud is not available in this browser.' }));
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(text || '').replace(/\s+/g, ' ').trim().slice(0, 900));
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function ReadAloudButton({ enabled, text }) {
  if (!enabled) return null;
  return (
    <button className="btn btn-soft btn-tiny" onClick={() => speakText(text)}>
      <window.Icon name="play" size={14} /> Read aloud
    </button>
  );
}

const ROUGH_DAY_STEPS = [
  {
    kicker: '01 / Stop',
    title: 'Nothing more is required of you right now.',
    body: 'No apologies, no hard texts, no life decisions while flooded. The first task is to lower immediate demand.',
    action: 'I can stop',
  },
  {
    kicker: '02 / Feet',
    title: 'Put both feet on the floor.',
    body: 'Press down through both soles. Feel the weight in your legs. Let the room be ordinary for one breath.',
    action: 'Feet are down',
    tool: 'grounding',
  },
  {
    kicker: '03 / Room',
    title: 'Name today and name the room.',
    body: 'Say the date, the room, and one visible object. Do this without explaining the past.',
    action: 'I named the room',
  },
  {
    kicker: '04 / Water',
    title: 'Drink water or touch something cool.',
    body: 'Small body care counts. Water, a cold wrist rinse, a blanket, or a quieter corner is enough.',
    action: 'I did one body care step',
  },
  {
    kicker: '05 / Contact',
    title: 'Choose one real person if risk is rising.',
    body: 'If you might hurt yourself, be hurt, or cannot stay oriented, contact a real person or urgent support now.',
    action: 'Show safety options',
    unsafe: true,
  },
  {
    kicker: '06 / Wait',
    title: 'Wait before answering anything difficult.',
    body: 'If it can wait until morning or until your body is steadier, let it wait. The night is not for verdicts.',
    action: 'I can wait',
  },
  {
    kicker: '07 / Rest',
    title: 'You returned once. That is enough for now.',
    body: 'You do not have to turn this into insight. Rest, neutral sound, low light, and one safe next thing.',
    action: 'Restart protocol',
    restart: true,
  },
];

function RoughDayGuidedPanel({ onOpenTool, onUnsafe }) {
  const [step, setStep] = useStateS(0);
  const current = ROUGH_DAY_STEPS[step];
  const next = () => setStep(i => Math.min(ROUGH_DAY_STEPS.length - 1, i + 1));
  const act = () => {
    if (current.tool) onOpenTool(current.tool);
    if (current.unsafe) onUnsafe();
    if (current.restart) setStep(0);
    else next();
  };

  return (
    <div className="guided-protocol reveal">
      <div className="guided-progress" aria-label={`Rough-day step ${step + 1} of ${ROUGH_DAY_STEPS.length}`}>
        {ROUGH_DAY_STEPS.map((_, i) => (
          <button key={i} className={"guided-progress-step" + (i <= step ? ' guided-progress-step-active' : '')} onClick={() => setStep(i)} aria-label={`Go to step ${i + 1}`} />
        ))}
      </div>
      <div className="card-tactile guided-protocol-card">
        <p className="eyebrow" style={{ color: step >= 4 ? 'var(--crisis)' : 'var(--forest)' }}>{current.kicker}</p>
        <h2 className="display" style={{ fontSize: 32, marginTop: 8 }}>{current.title}</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 10 }}>{current.body}</p>
        <div className="card-sunk" style={{ background: 'var(--amber-wash)', marginTop: 14 }}>
          <p className="eyebrow" style={{ color: 'var(--amber)' }}>Rough-day rule</p>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>No major relationship, family, work, or self-worth decisions while flooded.</p>
        </div>
        <div className="cluster" style={{ marginTop: 16 }}>
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => setStep(i => Math.max(0, i - 1))}>
              <window.Icon name="chevronLeft" size={16} /> Back
            </button>
          )}
          <button className={current.unsafe ? 'btn btn-crisis' : 'btn btn-forest'} onClick={act}>
            {current.action} {!current.restart && <window.Icon name="chevronRight" size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function TapOnlyNote() {
  return (
    <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
      <p className="eyebrow" style={{ color: 'var(--forest)' }}>Tap-only mode</p>
      <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>Search and filters are hidden. Use draw, safety choices, and shown buttons only.</p>
    </div>
  );
}

function WhatNowPanel({ onSelectTab, onOpenTool }) {
  const [safety, setSafety] = useStateS(null);
  const [need, setNeed] = useStateS(null);
  const [showMoreChoices, setShowMoreChoices] = useStateS(false);
  const urgent = safety === 'red';
  const choices = [
    ['danger', 'I am in danger', 'Shouting, threats, self-harm risk, blocked exit, or nowhere safe.', 'unsafe'],
    ['control', 'Someone is controlling me', 'Monitoring, pressure, threats, forced choices, or fear of saying no.', 'coercion'],
    ['body', 'My body is activated', 'Tight chest, shaking, panic, numbness, floating, or flashback.', 'grounding'],
    ['family', 'Family pressure', 'Honour, obedience, emotional blackmail, or fear of speaking.', 'culture'],
    ['shame', 'Shame spiral', 'I feel wrong, guilty, too much, dirty, selfish, or impossible.', 'shame'],
    ['faith', 'Religious guilt or spiritual comfort', 'I need faith-sensitive words without blame or preaching.', 'culture'],
    ['words', 'I need words to say', 'A boundary, a repair line, or a script I can copy.', 'boundaries'],
    ['public', 'I am in public / at work', 'I need something discreet and quiet on screen.', 'public'],
    ['work', 'Workplace humiliation', 'Feedback, hierarchy, public correction, deadlines, or office politics.', 'workplace'],
    ['relationship', 'Marriage or relationship pressure', 'Rishta pressure, in-laws, abandonment fear, conflict, or control.', 'relationships'],
    ['night', 'Night-time loneliness', 'Night panic, loneliness, nightmares, or after-dark fear.', 'night'],
  ];
  const nonUrgentChoices = choices.filter(([id]) => id !== 'danger');
  const visibleChoices = showMoreChoices ? nonUrgentChoices : nonUrgentChoices.slice(0, 6);

  const go = (target) => {
    if (target === 'public' || target === 'grounding') onOpenTool(target);
    else onSelectTab(target);
  };

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>I don't know what I need</p>
        <h2 className="display" style={{ fontSize: 30, marginTop: 6 }}>Choose the closest door. You can change it.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>No explanation needed. Start with safety, then one small step.</p>
      </div>

      <div className="grid-3">
        <button className={"card" + (safety === 'red' ? ' chip-rose' : '')} style={{ textAlign: 'left' }} onClick={() => setSafety('red')}>
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Urgent</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>I am not safe.</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>I need a person, exit, call, or urgent safety plan now.</p>
        </button>
        <button className={"card" + (safety === 'amber' ? ' chip-amber' : '')} style={{ textAlign: 'left' }} onClick={() => setSafety('amber')}>
          <p className="eyebrow" style={{ color: 'var(--amber)' }}>Flooded</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>I am flooded but not in immediate danger.</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>I need grounding before any thinking or decisions.</p>
        </button>
        <button className={"card" + (safety === 'green' ? ' chip-forest' : '')} style={{ textAlign: 'left' }} onClick={() => setSafety('green')}>
          <p className="eyebrow" style={{ color: 'var(--forest)' }}>Safe enough</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>I am safe enough to reflect.</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>I can pick a card, script, or context map.</p>
        </button>
      </div>

      {urgent && (
        <div className="card-sunk" style={{ background: 'var(--rose-wash)' }}>
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Safety first</p>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>Do not analyse this yet. Move toward contact, distance, light, and a real human.</p>
          <div className="cluster" style={{ marginTop: 12 }}>
            <button className="btn btn-crisis" onClick={() => onSelectTab('unsafe')}><window.Icon name="crisis" size={16} /> Open urgent safety flow</button>
            <button className="btn btn-soft" onClick={() => onOpenTool('danger')}><window.Icon name="phone" size={16} /> Call / text options</button>
          </div>
        </div>
      )}

      {safety === 'amber' && (
        <div className="card-sunk" style={{ background: 'var(--amber-wash)' }}>
          <p className="eyebrow" style={{ color: 'var(--amber)' }}>Before the next step</p>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>Feet down. Name today. Look for one ordinary object. No major decisions while flooded.</p>
          <div className="cluster" style={{ marginTop: 12 }}>
            <button className="btn btn-soft" onClick={() => onOpenTool('grounding')}><window.Icon name="grounding" size={16} /> Ground first</button>
            <button className="btn btn-ghost" onClick={() => setSafety('green')}>I did this</button>
          </div>
        </div>
      )}

      {safety && safety !== 'red' && (
        <div className="stack">
          <h3 className="tool-section-title" style={{ fontSize: 22 }}>Pick what fits closest</h3>
          <div className="grid-2">
            {visibleChoices.map(([id, title, desc, target]) => (
              <button key={id} className={"card" + (need === id ? ' chip-active' : '')} style={{ textAlign: 'left' }} onClick={() => { setNeed(id); go(target); }}>
                <h3 className="display" style={{ fontSize: 20 }}>{title}</h3>
                <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{desc}</p>
              </button>
            ))}
          </div>
          {!showMoreChoices && nonUrgentChoices.length > visibleChoices.length && (
            <button className="btn btn-ghost" onClick={() => setShowMoreChoices(true)}>Show more choices</button>
          )}
        </div>
      )}
    </div>
  );
}

function SurvivorCardsPanel({ showBrowseLists = true, tapOnlyMode = false, readAloud = false }) {
  const deck = window.AMANAT_SURVIVOR_CARDS || { meta: {}, cards: [] };
  const cards = deck.cards || [];
  const [query, setQuery] = useStateS('');
  const [risk, setRisk] = useStateS('all');
  const [domain, setDomain] = useStateS('all');
  const [module, setModule] = useStateS('all');
  const [selectedId, setSelectedId] = useStateS(cards[0]?.id || null);
  const [showResults, setShowResults] = useStateS(showBrowseLists);
  useEffectS(() => setShowResults(showBrowseLists), [showBrowseLists]);

  const domains = useMemoS(() => Array.from(new Set(cards.map(x => x.domain).filter(Boolean))).sort(), [cards]);
  const risks = useMemoS(() => Array.from(new Set(cards.map(x => x.risk).filter(Boolean))).sort(), [cards]);
  const modules = useMemoS(() => Array.from(new Set(cards.map(x => x.module).filter(Boolean))).sort(), [cards]);
  const filtered = useMemoS(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(card => {
      if (risk !== 'all' && card.risk !== risk) return false;
      if (domain !== 'all' && card.domain !== domain) return false;
      if (module !== 'all' && card.module !== module) return false;
      if (!q) return true;
      return [card.title, card.trigger, card.environment, card.story, card.bodySignal, card.grounding, card.selfScript, card.tags, card.cardText]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [cards, query, risk, domain, module]);
  const shown = filtered.slice(0, 60);
  const selected = cards.find(c => c.id === selectedId) || filtered[0] || cards[0];

  const drawCard = () => {
    const pool = filtered.length ? filtered : cards;
    if (!pool.length) return;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setSelectedId(next.id);
  };

  useEffectS(() => {
    if (filtered.length && !filtered.some(c => c.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  return (
    <div className="stack reveal">
      <div className="card-tactile">
        <p className="eyebrow">Survivor-facing cards</p>
        <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>Draw a card for what is happening now.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {deck.meta.totalCards || cards.length} cards imported from the Humsafar survivor-facing workbook. Use them for regulation before reflection.
        </p>
        <div className="cluster" style={{ marginTop: 14 }}>
          <button className="btn btn-forest" onClick={drawCard}><window.Icon name="reload" size={16} /> Draw a card</button>
          {!tapOnlyMode && (
            <>
              <input
                className="composer-input"
                style={{ minHeight: 40, maxWidth: 340 }}
                placeholder="Search cards..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <select className="input-select" value={risk} onChange={e => setRisk(e.target.value)}>
                <option value="all">All support levels</option>
                {risks.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="all">All domains</option>
                {domains.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={module} onChange={e => setModule(e.target.value)}>
                <option value="all">All modules</option>
                {modules.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </>
          )}
        </div>
      </div>
      {tapOnlyMode && <TapOnlyNote />}

      {selected && (
        <div className="card-tactile survivor-card-feature">
          <div className="cluster" style={{ gap: 6 }}>
            <span className="chip">CARD:{selected.id}</span>
            {selected.risk && <span className={"chip chip-" + chipTone(selected.risk, 'risk')}>{supportLabel(selected.risk)}</span>}
            {selected.domain && <span className="chip chip-forest">{selected.domain}</span>}
            {selected.module && <span className="chip">{selected.module}</span>}
          </div>
          <h3 className="display" style={{ fontSize: 28, marginTop: 12 }}>{selected.title}</h3>
          <div className="grid-2" style={{ marginTop: 14 }}>
            <div className="phrase-row threat">
              <div className="phrase-label threat">What may be happening</div>
              <div className="phrase-text">{selected.story || selected.trigger}</div>
              {selected.bodySignal && <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 8 }}>Body: {selected.bodySignal}</p>}
            </div>
            <div className="phrase-row safe">
              <div className="phrase-label safe">Do this now</div>
              <div className="phrase-text">{selected.grounding}</div>
            </div>
          </div>
          {selected.selfScript && (
            <div className="card-sunk" style={{ background: 'var(--forest-wash)', marginTop: 14 }}>
              <p className="eyebrow" style={{ color: 'var(--forest)' }}>Say to yourself</p>
              <p className="display-italic" style={{ fontSize: 20, marginTop: 6 }}>"{selected.selfScript}"</p>
            </div>
          )}
          <details style={{ marginTop: 14 }}>
            <summary className="ui-sans" style={{ cursor: 'pointer', fontWeight: 700 }}>Full card text</summary>
            <pre className="card-text-pre">{selected.cardText}</pre>
          </details>
          <div className="cluster" style={{ marginTop: 14 }}>
            <ReadAloudButton enabled={readAloud} text={[selected.title, selected.story || selected.trigger, selected.bodySignal, selected.grounding, selected.selfScript].filter(Boolean).join('. ')} />
            <button className="btn btn-soft btn-tiny" onClick={async () => { await window.copyToClipboard(selected.cardText || selected.selfScript || selected.title); }}>
              <window.Icon name="copy" size={14} /> Copy card
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <p className="eyebrow">{filtered.length} matching cards</p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{showResults ? 'Showing first 60 below.' : 'List hidden in survivor mode.'}</p>
      </div>
      {!showResults ? (
        <HiddenResultsCard count={filtered.length} label="matching cards" onShow={() => setShowResults(true)} />
      ) : (
        <div className="grid-2">
          {shown.map(card => (
            <button key={card.id} className="card" style={{ textAlign: 'left' }} onClick={() => setSelectedId(card.id)}>
              <div className="cluster" style={{ gap: 6 }}>
                <span className="chip">CARD:{card.id}</span>
                {card.risk && <span className={"chip chip-" + chipTone(card.risk, 'risk')}>{supportLabel(card.risk)}</span>}
              </div>
              <h3 className="display" style={{ fontSize: 19, marginTop: 10 }}>{card.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 6 }}>{card.grounding}</p>
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 10 }}>{card.module} · {card.tags}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ShameSpiralPanel({ showBrowseLists = true, tapOnlyMode = false, readAloud = false }) {
  const deck = window.AMANAT_SHAME_SPIRAL_CARDS || { meta: {}, cards: [] };
  const cards = deck.cards || [];
  const [query, setQuery] = useStateS('');
  const [risk, setRisk] = useStateS('all');
  const [domain, setDomain] = useStateS('all');
  const [module, setModule] = useStateS('all');
  const [selectedId, setSelectedId] = useStateS(cards[0]?.id || null);
  const [showResults, setShowResults] = useStateS(showBrowseLists);
  useEffectS(() => setShowResults(showBrowseLists), [showBrowseLists]);

  const domains = useMemoS(() => Array.from(new Set(cards.map(x => x.domain).filter(Boolean))).sort(), [cards]);
  const risks = useMemoS(() => Array.from(new Set(cards.map(x => x.risk).filter(Boolean))).sort(), [cards]);
  const modules = useMemoS(() => Array.from(new Set(cards.map(x => x.module).filter(Boolean))).sort(), [cards]);
  const filtered = useMemoS(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(card => {
      if (risk !== 'all' && card.risk !== risk) return false;
      if (domain !== 'all' && card.domain !== domain) return false;
      if (module !== 'all' && card.module !== module) return false;
      if (!q) return true;
      return [card.trigger, card.oldStory, card.shameSentence, card.bodySignal, card.oldOrigin, card.moreTrue, card.reparenting, card.repair, card.grounding, card.tags, card.cardText]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [cards, query, risk, domain, module]);
  const shown = filtered.slice(0, 60);
  const selected = cards.find(c => c.id === selectedId) || filtered[0] || cards[0];

  const drawCard = () => {
    const pool = filtered.length ? filtered : cards;
    if (!pool.length) return;
    setSelectedId(pool[Math.floor(Math.random() * pool.length)].id);
  };

  useEffectS(() => {
    if (filtered.length && !filtered.some(c => c.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-raised))' }}>
        <p className="eyebrow" style={{ color: 'var(--rose)' }}>Shame spiral map</p>
        <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>Map the shame sentence without obeying it.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {deck.meta.totalCards || cards.length} shame spiral cards imported from the workbook. Read one card at a time: body first, repair before analysis.
        </p>
        <div className="cluster" style={{ marginTop: 14 }}>
          <button className="btn btn-forest" onClick={drawCard}><window.Icon name="reload" size={16} /> Draw a shame map</button>
          {!tapOnlyMode && (
            <>
              <input
                className="composer-input"
                style={{ minHeight: 40, maxWidth: 340 }}
                placeholder="Search shame sentence, trigger, body..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <select className="input-select" value={risk} onChange={e => setRisk(e.target.value)}>
                <option value="all">All support levels</option>
                {risks.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="all">All domains</option>
                {domains.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={module} onChange={e => setModule(e.target.value)}>
                <option value="all">All modules</option>
                {modules.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </>
          )}
        </div>
      </div>
      {tapOnlyMode && <TapOnlyNote />}

      {selected && (
        <div className="card-tactile shame-card-feature">
          <div className="cluster" style={{ gap: 6 }}>
            <span className="chip">SHAME:{selected.id}</span>
            {selected.risk && <span className={"chip chip-" + chipTone(selected.risk, 'risk')}>{supportLabel(selected.risk)}</span>}
            {selected.domain && <span className="chip chip-forest">{selected.domain}</span>}
            {selected.module && <span className="chip">{selected.module}</span>}
          </div>
          <h3 className="display" style={{ fontSize: 28, marginTop: 12 }}>{selected.trigger}</h3>
          <div className="grid-2" style={{ marginTop: 14 }}>
            <div className="phrase-row threat">
              <div className="phrase-label threat">Shame may say</div>
              <div className="phrase-text">{selected.shameSentence}</div>
              {selected.bodySignal && <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 8 }}>Body: {selected.bodySignal}</p>}
            </div>
            <div className="phrase-row safe">
              <div className="phrase-label safe">What is more true</div>
              <div className="phrase-text">{selected.moreTrue}</div>
            </div>
          </div>
          <div className="grid-2" style={{ marginTop: 12 }}>
            <div className="card-sunk" style={{ background: 'var(--paper-bright)' }}>
              <p className="eyebrow">Old echo</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{selected.oldOrigin}</p>
            </div>
            <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
              <p className="eyebrow" style={{ color: 'var(--forest)' }}>Repair step</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{selected.repair}</p>
            </div>
          </div>
          {selected.reparenting && (
            <div className="card-sunk" style={{ background: 'var(--forest-wash)', marginTop: 14 }}>
              <p className="eyebrow" style={{ color: 'var(--forest)' }}>Re-parenting response</p>
              <p className="display-italic" style={{ fontSize: 20, marginTop: 6 }}>"{selected.reparenting}"</p>
            </div>
          )}
          <details style={{ marginTop: 14 }}>
            <summary className="ui-sans" style={{ cursor: 'pointer', fontWeight: 700 }}>Full shame spiral card</summary>
            <pre className="card-text-pre">{selected.cardText}</pre>
          </details>
          <div className="cluster" style={{ marginTop: 14 }}>
            <ReadAloudButton enabled={readAloud} text={[selected.trigger, selected.shameSentence, selected.moreTrue, selected.repair, selected.reparenting].filter(Boolean).join('. ')} />
            <button className="btn btn-soft btn-tiny" onClick={async () => { await window.copyToClipboard(selected.cardText || selected.repair || selected.trigger); }}>
              <window.Icon name="copy" size={14} /> Copy map
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <p className="eyebrow">{filtered.length} matching maps</p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{showResults ? 'Showing first 60 below.' : 'List hidden in survivor mode.'}</p>
      </div>
      {!showResults ? (
        <HiddenResultsCard count={filtered.length} label="matching maps" onShow={() => setShowResults(true)} />
      ) : (
        <div className="grid-2">
          {shown.map(card => (
            <button key={card.id} className="card" style={{ textAlign: 'left' }} onClick={() => setSelectedId(card.id)}>
              <div className="cluster" style={{ gap: 6 }}>
                <span className="chip">SHAME:{card.id}</span>
                {card.risk && <span className={"chip chip-" + chipTone(card.risk, 'risk')}>{supportLabel(card.risk)}</span>}
              </div>
              <h3 className="display" style={{ fontSize: 19, marginTop: 10 }}>{card.trigger}</h3>
              <p style={{ color: 'var(--rose)', fontSize: 14, marginTop: 6, fontStyle: 'italic' }}>{card.shameSentence}</p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 8 }}>{card.repair}</p>
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 10 }}>{card.module} · {card.tags}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ResponseProfilesPanel({ showBrowseLists = true, tapOnlyMode = false, readAloud = false }) {
  const deck = window.AMANAT_RESPONSE_PROFILE_CARDS || { meta: {}, cards: [] };
  const cards = deck.cards || [];
  const [query, setQuery] = useStateS('');
  const [profile, setProfile] = useStateS('all');
  const [domain, setDomain] = useStateS('all');
  const [module, setModule] = useStateS('all');
  const [selectedId, setSelectedId] = useStateS(cards[0]?.id || null);
  const [showResults, setShowResults] = useStateS(showBrowseLists);
  useEffectS(() => setShowResults(showBrowseLists), [showBrowseLists]);

  const domains = useMemoS(() => Array.from(new Set(cards.map(x => x.domain).filter(Boolean))).sort(), [cards]);
  const profiles = useMemoS(() => Array.from(new Set(cards.map(x => x.dominantProfile).filter(Boolean))).sort(), [cards]);
  const modules = useMemoS(() => Array.from(new Set(cards.map(x => x.module).filter(Boolean))).sort(), [cards]);
  const filtered = useMemoS(() => {
    const q = query.trim().toLowerCase();
    return cards.filter(card => {
      if (profile !== 'all' && card.dominantProfile !== profile) return false;
      if (domain !== 'all' && card.domain !== domain) return false;
      if (module !== 'all' && card.module !== module) return false;
      if (!q) return true;
      return [card.trigger, card.oldStory, card.shameSentence, card.bodySignal, card.dominantProfile, card.secondaryResponses, card.protectionFunction, card.hiddenCost, card.earlyWarnings, card.grounding, card.saferPlan, card.boundaryScript, card.cardText]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [cards, query, profile, domain, module]);
  const shown = filtered.slice(0, 60);
  const selected = cards.find(c => c.id === selectedId) || filtered[0] || cards[0];

  const drawCard = () => {
    const pool = filtered.length ? filtered : cards;
    if (!pool.length) return;
    setSelectedId(pool[Math.floor(Math.random() * pool.length)].id);
  };

  useEffectS(() => {
    if (filtered.length && !filtered.some(c => c.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-raised))' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Body response maps</p>
        <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>What is this response trying to protect?</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {deck.meta.totalCards || cards.length} body response cards imported from the workbook. These are reflection maps, not diagnoses.
        </p>
        <div className="cluster" style={{ marginTop: 14 }}>
          <button className="btn btn-forest" onClick={drawCard}><window.Icon name="reload" size={16} /> Draw a map</button>
          {!tapOnlyMode && (
            <>
              <input
                className="composer-input"
                style={{ minHeight: 40, maxWidth: 340 }}
                placeholder="Search response, warning, boundary..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <select className="input-select" value={profile} onChange={e => setProfile(e.target.value)}>
                <option value="all">All profiles</option>
                {profiles.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="all">All domains</option>
                {domains.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={module} onChange={e => setModule(e.target.value)}>
                <option value="all">All modules</option>
                {modules.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </>
          )}
        </div>
      </div>
      {tapOnlyMode && <TapOnlyNote />}
      <div className="card-sunk" style={{ background: 'var(--paper-bright)' }}>
        <p className="eyebrow">Not a diagnosis</p>
        <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
          These profiles describe protective patterns that can shift by context. Use them for self-understanding, not for diagnosing yourself or labelling someone else.
        </p>
      </div>

      {selected && (
        <div className="card-tactile response-card-feature">
          <div className="cluster" style={{ gap: 6 }}>
            <span className="chip">PROFILE:{selected.id}</span>
            {selected.risk && <span className={"chip chip-" + chipTone(selected.risk, 'risk')}>{supportLabel(selected.risk)}</span>}
            {selected.dominantProfile && <span className="chip chip-forest">{selected.dominantProfile}</span>}
            {selected.module && <span className="chip">{selected.module}</span>}
          </div>
          <h3 className="display" style={{ fontSize: 28, marginTop: 12 }}>{selected.trigger}</h3>

          <div className="response-bars" style={{ marginTop: 16 }}>
            {[
              ['Fight', selected.fightScore],
              ['Flight', selected.flightScore],
              ['Freeze', selected.freezeScore],
              ['Fawn', selected.fawnScore],
              ['Fix', selected.fixScore],
              ['Fold', selected.foldScore],
              ['Fragment', selected.fragmentScore],
            ].map(([label, value]) => (
              <div key={label} className="response-bar-row">
                <span>{label}</span>
                <div className="response-bar-track"><div style={{ width: `${Math.max(0, Math.min(5, Number(value) || 0)) * 20}%` }} /></div>
                <span className="mono">{value || 0}/5</span>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ marginTop: 14 }}>
            <div className="phrase-row threat">
              <div className="phrase-label threat">Protection function</div>
              <div className="phrase-text">{selected.protectionFunction}</div>
            </div>
            <div className="phrase-row safe">
              <div className="phrase-label safe">Best first grounding</div>
              <div className="phrase-text">{selected.grounding}</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 12 }}>
            <div className="card-sunk" style={{ background: 'var(--paper-bright)' }}>
              <p className="eyebrow">Hidden cost</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{selected.hiddenCost}</p>
            </div>
            <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
              <p className="eyebrow" style={{ color: 'var(--forest)' }}>Safer plan</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{selected.saferPlan}</p>
            </div>
          </div>

          {selected.boundaryScript && (
            <div className="card-sunk" style={{ background: 'var(--forest-wash)', marginTop: 14 }}>
              <p className="eyebrow" style={{ color: 'var(--forest)' }}>Words you can use</p>
              <p className="display-italic" style={{ fontSize: 20, marginTop: 6 }}>"{selected.boundaryScript}"</p>
            </div>
          )}

          <details style={{ marginTop: 14 }}>
            <summary className="ui-sans" style={{ cursor: 'pointer', fontWeight: 700 }}>Full response profile card</summary>
            <pre className="card-text-pre">{selected.cardText}</pre>
          </details>
          <div className="cluster" style={{ marginTop: 14 }}>
            <ReadAloudButton enabled={readAloud} text={[selected.trigger, selected.dominantProfile, selected.protectionFunction, selected.grounding, selected.saferPlan, selected.boundaryScript].filter(Boolean).join('. ')} />
            <button className="btn btn-soft btn-tiny" onClick={async () => { await window.copyToClipboard(selected.cardText || selected.boundaryScript || selected.trigger); }}>
              <window.Icon name="copy" size={14} /> Copy profile
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <p className="eyebrow">{filtered.length} matching profiles</p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{showResults ? 'Showing first 60 below.' : 'List hidden in survivor mode.'}</p>
      </div>
      {!showResults ? (
        <HiddenResultsCard count={filtered.length} label="matching profiles" onShow={() => setShowResults(true)} />
      ) : (
        <div className="grid-2">
          {shown.map(card => (
            <button key={card.id} className="card" style={{ textAlign: 'left' }} onClick={() => setSelectedId(card.id)}>
              <div className="cluster" style={{ gap: 6 }}>
                <span className="chip">PROFILE:{card.id}</span>
                {card.dominantProfile && <span className="chip chip-forest">{card.dominantProfile}</span>}
              </div>
              <h3 className="display" style={{ fontSize: 19, marginTop: 10 }}>{card.trigger}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 6 }}>{card.protectionFunction}</p>
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 10 }}>{card.secondaryResponses} · {card.module}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BoundaryScriptsPanel({ showBrowseLists = true, tapOnlyMode = false, readAloud = false }) {
  const deck = window.AMANAT_BOUNDARY_SCRIPTS || { meta: {}, scripts: [] };
  const scripts = deck.scripts || [];
  const [query, setQuery] = useStateS('');
  const [profile, setProfile] = useStateS('all');
  const [domain, setDomain] = useStateS('all');
  const [module, setModule] = useStateS('all');
  const [selectedId, setSelectedId] = useStateS(scripts[0]?.id || null);
  const [showResults, setShowResults] = useStateS(showBrowseLists);
  useEffectS(() => setShowResults(showBrowseLists), [showBrowseLists]);

  const domains = useMemoS(() => Array.from(new Set(scripts.map(x => x.domain).filter(Boolean))).sort(), [scripts]);
  const profiles = useMemoS(() => Array.from(new Set(scripts.map(x => x.profile).filter(Boolean))).sort(), [scripts]);
  const modules = useMemoS(() => Array.from(new Set(scripts.map(x => x.module).filter(Boolean))).sort(), [scripts]);
  const filtered = useMemoS(() => {
    const q = query.trim().toLowerCase();
    return scripts.filter(item => {
      if (profile !== 'all' && item.profile !== profile) return false;
      if (domain !== 'all' && item.domain !== domain) return false;
      if (module !== 'all' && item.module !== module) return false;
      if (!q) return true;
      return [item.trigger, item.environment, item.shameSentence, item.script, item.pakistanRelevance, item.module, item.profile]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [scripts, query, profile, domain, module]);
  const shown = filtered.slice(0, 80);
  const selected = scripts.find(c => c.id === selectedId) || filtered[0] || scripts[0];

  const drawScript = () => {
    const pool = filtered.length ? filtered : scripts;
    if (!pool.length) return;
    setSelectedId(pool[Math.floor(Math.random() * pool.length)].id);
  };

  useEffectS(() => {
    if (filtered.length && !filtered.some(c => c.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  const copyScript = async (item) => {
    const ok = await window.copyToClipboard(item.script);
    if (ok) window.dispatchEvent(new CustomEvent('amanat:toast', { detail: 'Boundary script copied.' }));
  };

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-raised))' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Boundary scripts</p>
        <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>Words for when your body already said no.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {deck.meta.totalScripts || scripts.length} survivor boundary scripts imported from the workbook. Copy, adapt, or read one quietly before a hard conversation.
        </p>
        <div className="cluster" style={{ marginTop: 14 }}>
          <button className="btn btn-forest" onClick={drawScript}><window.Icon name="reload" size={16} /> Draw a script</button>
          {!tapOnlyMode && (
            <>
              <input
                className="composer-input"
                style={{ minHeight: 40, maxWidth: 340 }}
                placeholder="Search trigger, shame sentence, script..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <select className="input-select" value={profile} onChange={e => setProfile(e.target.value)}>
                <option value="all">All responses</option>
                {profiles.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="all">All domains</option>
                {domains.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={module} onChange={e => setModule(e.target.value)}>
                <option value="all">All modules</option>
                {modules.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </>
          )}
        </div>
      </div>
      {tapOnlyMode && <TapOnlyNote />}

      {selected && (
        <div className="card-tactile boundary-script-feature">
          <div className="cluster" style={{ gap: 6 }}>
            <span className="chip">SCRIPT:{selected.id}</span>
            {selected.risk && <span className={"chip chip-" + chipTone(selected.risk, 'risk')}>{supportLabel(selected.risk)}</span>}
            {selected.profile && <span className="chip chip-forest">{selected.profile}</span>}
            {selected.module && <span className="chip">{selected.module}</span>}
          </div>
          <h3 className="display" style={{ fontSize: 27, marginTop: 12 }}>{selected.trigger}</h3>
          <p style={{ color: 'var(--ink-faint)', marginTop: 4 }}>{selected.environment} · {selected.domain}</p>

          <div className="phrase-row threat">
            <div className="phrase-label threat">Shame sentence</div>
            <div className="phrase-text">{selected.shameSentence}</div>
          </div>

          <div className="card-sunk" style={{ background: 'var(--forest-wash)', marginTop: 14 }}>
            <p className="eyebrow" style={{ color: 'var(--forest)' }}>Boundary script</p>
            <p className="display-italic" style={{ fontSize: 24, lineHeight: 1.45, marginTop: 8 }}>"{selected.script}"</p>
          </div>

          {selected.pakistanRelevance && (
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 12 }}>{selected.pakistanRelevance}</p>
          )}

          <UnsafeConfrontationNote />

          <div className="cluster" style={{ marginTop: 14 }}>
            <ReadAloudButton enabled={readAloud} text={[selected.trigger, selected.shameSentence, selected.script].filter(Boolean).join('. ')} />
            <button className="btn btn-forest btn-tiny" onClick={() => copyScript(selected)}>
              <window.Icon name="copy" size={14} /> Copy script
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <p className="eyebrow">{filtered.length} matching scripts</p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{showResults ? 'Showing first 80 below.' : 'List hidden in survivor mode.'}</p>
      </div>
      {!showResults ? (
        <HiddenResultsCard count={filtered.length} label="matching scripts" onShow={() => setShowResults(true)} />
      ) : (
        <div className="grid-2">
          {shown.map(item => (
            <button key={item.id} className="card" style={{ textAlign: 'left' }} onClick={() => setSelectedId(item.id)}>
              <div className="cluster" style={{ gap: 6 }}>
                <span className="chip">SCRIPT:{item.id}</span>
                {item.profile && <span className="chip chip-forest">{item.profile}</span>}
              </div>
              <h3 className="display" style={{ fontSize: 19, marginTop: 10 }}>{item.trigger}</h3>
              <p className="display-italic" style={{ color: 'var(--forest)', fontSize: 17, marginTop: 8 }}>"{item.script}"</p>
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 10 }}>{item.module} · {item.domain}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SAFETY_PHRASES = {
  english: {
    trusted: 'I am not safe. Please stay on the phone with me.',
    trustedShort: 'Stay on the phone with me. I cannot explain yet.',
    movement: "I need water / the bathroom / my charger. I'll be back.",
    recipe: 'Can you send the recipe?',
    flooded: 'Do not make major decisions while flooded.',
  },
};

function safetyPhrase(language, key) {
  return (SAFETY_PHRASES[language] || SAFETY_PHRASES.english)[key] || SAFETY_PHRASES.english[key] || '';
}

function supportLabel(value) {
  const text = String(value || '').toLowerCase();
  if (!text) return '';
  if (text.includes('urgent') || text.includes('high') || text.includes('red') || text.includes('🔴')) return 'Urgent support';
  if (text.includes('extra') || text.includes('moderate') || text.includes('medium') || text.includes('amber') || text.includes('🟠')) return 'Extra support';
  if (text.includes('light') || text.includes('low') || text.includes('green') || text.includes('🟢')) return 'Light support';
  return value;
}

function chipTone(value, field) {
  const text = String(value || '').toLowerCase();
  if (text.includes('urgent') || text.includes('high') || text.includes('red')) return 'rose';
  if (field === 'module' || field === 'domain' || field === 'visibility') return 'forest';
  return 'amber';
}

const RECOVERY_MODULE_CONFIGS = {
  angerGrief: {
    eyebrow: 'Anger and grief',
    title: 'Safe anger, honest grief, and repair.',
    intro: 'Permission statements, grounding actions, grief practices, and repair steps from the anger and grief workbook.',
    drawLabel: 'Draw a map',
    placeholder: 'Search anger, grief, script, body signal...',
    visibility: 'Survivor-facing',
    filterLabels: { domain: 'All domains', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'angerType', 'griefType', 'module'],
    sections: [
      ['Hidden anger message', 'hiddenAngerMessage', 'threat'],
      ['Safe anger permission', 'safeAngerPermission', 'safe'],
      ['Anger grounding', 'grounding', 'safe'],
      ['Boundary script', 'script', 'safe'],
      ['What was lost', 'whatWasLost', 'threat'],
      ['Grief ritual', 'griefRitual', 'safe'],
      ['Repair step', 'repair', 'safe'],
    ],
  },
  roughDay: {
    eyebrow: 'Rough-day plan',
    title: 'Safe-enough, flooded, and urgent steps for hard days.',
    intro: 'A return-to-safety plan for early warning signs, immediate actions, and next-day repair.',
    drawLabel: 'Draw a rough-day card',
    placeholder: 'Search warning signs, plans, scripts...',
    visibility: 'Survivor-facing',
    filterLabels: { domain: 'All domains', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'roughDayLevel', 'profile', 'module'],
    sections: [
      ['Early warning signs', 'earlyWarnings', 'threat'],
      ['Immediate 3-minute action', 'action', 'safe'],
      ['Safe-enough plan', 'greenPlan', 'safe'],
      ['Flooded plan', 'amberPlan', 'safe'],
      ['Urgent plan', 'redPlan', 'threat'],
      ['Support contact prompt', 'supportPrompt', 'safe'],
      ['Morning repair', 'repair', 'safe'],
    ],
  },
  night: {
    eyebrow: 'Sleep and night-time',
    title: 'A plan for when night makes the nervous system louder.',
    intro: 'Before-bed, during-night, nightmare, and morning repair steps from the night-time plan.',
    drawLabel: 'Draw a night card',
    placeholder: 'Search sleep cue, nightmare, body signal...',
    visibility: 'Survivor-facing',
    filterLabels: { category: 'All night types', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'category', 'profile', 'module'],
    sections: [
      ['Sleep trigger cue', 'sleepCue', 'threat'],
      ['Before-bed plan', 'beforeBed', 'safe'],
      ['During-night activation plan', 'duringNight', 'safe'],
      ['After-nightmare plan', 'afterNightmare', 'safe'],
      ['What not to do at night', 'avoid', 'threat'],
      ['Safe self-script', 'script', 'safe'],
      ['Morning repair', 'repair', 'safe'],
    ],
  },
  goodDay: {
    eyebrow: 'Good-day safety',
    title: 'Let good things arrive slowly enough to feel real.',
    intro: 'Joy tolerance, regulation, and self-scripts for days when calm or ease feels unfamiliar.',
    drawLabel: 'Draw a good-day card',
    placeholder: 'Search good cue, old threat, self-script...',
    visibility: 'Survivor-facing',
    filterLabels: { domain: 'All domains', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'profile', 'module'],
    sections: [
      ['Good cue that may feel unsafe', 'goodCue', 'threat'],
      ['Old threat prediction', 'oldStory', 'threat'],
      ['Joy tolerance practice', 'joyPractice', 'safe'],
      ['Regulation action', 'action', 'safe'],
      ['Good-day rule', 'rule', 'safe'],
      ['Safe self-script', 'script', 'safe'],
    ],
  },
  environmentSafety: {
    eyebrow: 'Environment safety',
    title: 'Check places, cues, exits, and safer setup.',
    intro: 'Environmental safety maps for privacy risk, exposure risk, grounding, boundaries, and safer setup.',
    drawLabel: 'Draw an environment',
    placeholder: 'Search place, cue, exit, redesign...',
    visibility: 'Survivor-facing',
    filterLabels: { category: 'All environments', risk: 'All support levels', domain: 'All domains' },
    chips: ['risk', 'category', 'privacyRisk', 'safetyRating'],
    sections: [
      ['Sensory or social cues', 'cues', 'threat'],
      ['Privacy / exposure risk', 'privacyRisk', 'threat'],
      ['Exit / pause options', 'exitOptions', 'safe'],
      ['Early warning signs', 'earlyWarnings', 'threat'],
      ['Grounding action first', 'grounding', 'safe'],
      ['Safer environment redesign', 'redesign', 'safe'],
      ['Boundary script', 'script', 'safe'],
    ],
  },
  culture: {
    eyebrow: 'Family culture layer',
    title: 'Family pressure, faith-sensitive reframes, and safe routing.',
    intro: 'Pakistani family-system scripts and culture-aware safety steps. Use as options, not instructions.',
    drawLabel: 'Draw a culture card',
    placeholder: 'Search family cue, faith reframe, safe routing...',
    visibility: 'Culturally sensitive',
    filterLabels: { category: 'All cultural categories', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'category', 'profile', 'module'],
    sections: [
      ['Family system cue', 'familyCue', 'threat'],
      ['Gender / power cue', 'powerCue', 'threat'],
      ['Faith / meaning reframe', 'faithReframe', 'safe'],
      ['Boundary need', 'boundaryNeed', 'safe'],
      ['Survivor cultural script', 'script', 'safe'],
      ['Family-safe action', 'safeAction', 'safe'],
      ['Safe routing', 'safeRouting', 'safe'],
    ],
  },
  relationships: {
    eyebrow: 'Relationship maps',
    title: 'Misreads, needs, boundaries, and repair.',
    intro: 'Relationship-specific maps for attachment wounds, relational triggers, safe responses, and repair scripts.',
    drawLabel: 'Draw a relationship map',
    placeholder: 'Search attachment, need, repair, response...',
    visibility: 'Survivor-facing',
    filterLabels: { category: 'All relationship types', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'category', 'profile', 'module'],
    sections: [
      ['Attachment wound', 'attachmentWound', 'threat'],
      ['Common relational misread', 'misread', 'threat'],
      ['Need underneath', 'need', 'safe'],
      ['Unsafe response from other person', 'unsafeResponse', 'threat'],
      ['Safe response from other person', 'safeResponse', 'safe'],
      ['Survivor relationship script', 'script', 'safe'],
      ['Repair script', 'repair', 'safe'],
    ],
  },
  intimacy: {
    eyebrow: 'Safe intimacy',
    title: 'Consent, pace, pause, and aftercare.',
    intro: 'A gentle map for closeness, touch cues, boundaries, partner responses, and repair.',
    drawLabel: 'Draw an intimacy map',
    placeholder: 'Search consent, touch, pause, aftercare...',
    visibility: 'Consent-led',
    filterLabels: { domain: 'All domains', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'profile', 'module'],
    sections: [
      ['Consent / boundary cue', 'consentCue', 'threat'],
      ['Touch / closeness cue', 'touchCue', 'threat'],
      ['Safe pace instruction', 'safePace', 'safe'],
      ['Pause signal', 'pauseSignal', 'safe'],
      ['Survivor intimacy script', 'script', 'safe'],
      ['Aftercare need', 'aftercare', 'safe'],
      ['Repair step', 'repair', 'safe'],
    ],
  },
  workplace: {
    eyebrow: 'Workplace trauma',
    title: 'Discreet grounding and work-safe words.',
    intro: 'Workplace maps for authority cues, affected tasks, impacts, scripts, and reasonable adjustment ideas.',
    drawLabel: 'Draw a work map',
    placeholder: 'Search workplace scenario, task, script...',
    visibility: 'Survivor-facing',
    filterLabels: { risk: 'All support levels', module: 'All modules', profile: 'All responses' },
    chips: ['risk', 'profile', 'module'],
    sections: [
      ['Work task affected', 'workTask', 'threat'],
      ['Authority / power cue', 'authorityCue', 'threat'],
      ['Likely workplace impact', 'impact', 'threat'],
      ['Immediate grounding at work', 'grounding', 'safe'],
      ['Work-safe boundary script', 'script', 'safe'],
      ['Clarifying script', 'clarifyingScript', 'safe'],
      ['Reasonable adjustment / environment design', 'redesign', 'safe'],
    ],
  },
  research: {
    eyebrow: 'Research dashboard',
    title: 'Codebook, variables, and capture references.',
    intro: 'Research-facing material from the dashboard workbook. This is a reference area, not a survivor care flow.',
    drawLabel: 'Draw a codebook row',
    placeholder: 'Search codebook, variable, domain, routing...',
    visibility: 'Research-only',
    filterLabels: { domain: 'All domains', risk: 'All support levels', module: 'All modules' },
    chips: ['risk', 'domain', 'profile', 'safeRouting'],
    sections: [
      ['Shame sentence', 'shameSentence', 'threat'],
      ['Body signal', 'bodySignal', 'threat'],
      ['Dominant response profile', 'profile', 'safe'],
      ['Safe routing', 'safeRouting', 'safe'],
      ['Pakistan relevance', 'pakistanRelevance', 'safe'],
      ['Recommended module', 'module', 'safe'],
    ],
  },
};

function SafetyGatePanel({ moduleTitle, onContinue, onUnsafe, onOpenTool }) {
  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Before opening {moduleTitle || 'this module'}</p>
        <h2 className="display" style={{ fontSize: 28, marginTop: 6 }}>Check your safety level first.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>This keeps the app from asking for reflection when your body may need help, grounding, or distance.</p>
      </div>
      <div className="grid-3">
        <button className="card" style={{ textAlign: 'left', borderColor: 'rgba(179, 67, 56, 0.35)' }} onClick={() => { onUnsafe?.(); onOpenTool?.('danger'); }}>
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Red</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Not safe now</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Danger, self-harm risk, coercion, severe dissociation, or trapped environment.</p>
        </button>
        <button className="card" style={{ textAlign: 'left', borderColor: 'rgba(192, 124, 42, 0.35)' }} onClick={() => onContinue?.('amber')}>
          <p className="eyebrow" style={{ color: 'var(--amber)' }}>Amber</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Flooded but safe enough</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Open the module, but begin with the grounding step. No big decisions.</p>
        </button>
        <button className="card" style={{ textAlign: 'left', borderColor: 'rgba(58, 107, 74, 0.35)' }} onClick={() => onContinue?.('green')}>
          <p className="eyebrow" style={{ color: 'var(--forest)' }}>Green</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Safe enough to reflect</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Continue to the selected card, script, and optional explanation.</p>
        </button>
      </div>
      <div className="cluster">
        <button className="btn btn-soft btn-tiny" onClick={() => onOpenTool?.('grounding')}><window.Icon name="grounding" size={14} /> Ground first</button>
        <button className="btn btn-ghost btn-tiny" onClick={() => onOpenTool?.('public')}><window.Icon name="shield" size={14} /> Public mode</button>
      </div>
    </div>
  );
}

function ConsentGatePanel({ onContinue, onUnsafe, onOpenTool }) {
  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Before safe intimacy</p>
        <h2 className="display" style={{ fontSize: 28, marginTop: 6 }}>Only open this if you have choice, privacy, and permission to pause.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          This module is for consent, pacing, pause signals, and aftercare. It is not for graphic disclosure, pressure, persuasion, or proving anything to a partner.
        </p>
      </div>
      <div className="grid-3">
        <button className="card" style={{ textAlign: 'left', borderColor: 'rgba(58, 107, 74, 0.35)' }} onClick={() => onContinue?.()}>
          <p className="eyebrow" style={{ color: 'var(--forest)' }}>Consent-led</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Continue slowly</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>I can stop at any time and no one is demanding access to this screen.</p>
        </button>
        <button className="card" style={{ textAlign: 'left', borderColor: 'rgba(179, 67, 56, 0.35)' }} onClick={() => { onUnsafe?.(); onOpenTool?.('danger'); }}>
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Not safe</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Do not continue</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>If someone is pressuring, watching, threatening, or blocking exit, use safety support first.</p>
        </button>
        <button className="card" style={{ textAlign: 'left', borderColor: 'rgba(192, 124, 42, 0.35)' }} onClick={() => onOpenTool?.('public')}>
          <p className="eyebrow" style={{ color: 'var(--amber)' }}>Privacy</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Use public mode</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Switch to discreet grounding if this screen could be seen by someone unsafe.</p>
        </button>
      </div>
    </div>
  );
}

function UnsafeConfrontationNote({ compact = false }) {
  return (
    <div className="card-sunk" style={{ background: 'var(--amber-wash)', marginTop: 14 }}>
      <p className="eyebrow" style={{ color: 'var(--amber)' }}>If direct words could raise danger</p>
      <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
        {compact
          ? 'Do not use this directly with someone who may retaliate, monitor, punish, block exit, or escalate. Use it with a safe person, later in writing, or not at all.'
          : 'A script is optional. Do not confront someone who may retaliate, monitor your phone, punish you, block an exit, or escalate. Use these words with a safe person, later in writing, or not at all.'}
      </p>
    </div>
  );
}

const CONFRONTATION_CAUTION_MODULES = new Set(['culture', 'relationships', 'workplace']);

const RESEARCH_SCHEMA_TABLES = [
  ['triggers', 'Canonical trigger rows with module namespace, source card ID, domain, subdomain, baseline support level, and visibility.'],
  ['shame_spirals', 'Old story, shame sentence, body signal, protection response, repair step, and grounding action linked to trigger IDs.'],
  ['response_profiles', 'Fight, flight, freeze, fawn, fix, fold, and fragment scores. These are reflection codes, not diagnoses.'],
  ['grounding_actions', 'One-step actions, public-place actions, night actions, and red-state actions with safety routing.'],
  ['boundary_scripts', 'Optional scripts with unsafe-confrontation warnings, context tags, and cultural relevance.'],
  ['cultural_modifiers', 'Family, faith, honour/sharam/izzat, gender, class, privacy, and help-seeking modifiers.'],
  ['user_logs', 'Optional user-entered check-ins. Store separately from identifying details and allow deletion/export.'],
  ['safety_events', 'Live red/amber/green state, crisis routing shown, support contacted, and follow-up need.'],
  ['research_codes', 'Anonymous study variables, dropdown values, consent state, version, coder, and review status.'],
];

const PUBLIC_PATHWAY_RULES = [
  ['Public survivor app', 'Only low-text, safety-first cards, grounding, crisis routing, privacy controls, and optional scripts. Keep research dashboard hidden.'],
  ['Clinician-supported resource', 'Full module libraries can be used after consent, formulation, and local referral pathways are clear.'],
  ['Partner/supporter mode', 'Support scripts only. No diagnosing, monitoring, pressuring disclosure, or becoming the survivor’s therapist.'],
  ['Research prototype', 'Anonymous coded data only, consent before capture, no clinical claims, no publication as a validated intervention.'],
];

function ResearchWorkspacePanel({ lowTextMode = false, tapOnlyMode = false, readAloud = false }) {
  const [ack, setAck] = useStateS(false);

  if (!ack) {
    return (
      <div className="stack reveal">
        <ResearchReadinessPanel />
        <div className="card-sunk" style={{ background: 'var(--amber-wash)' }}>
          <p className="eyebrow" style={{ color: 'var(--amber)' }}>Before opening research rows</p>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
            Do not enter survivor names, phone numbers, exact addresses, raw screenshots, family identifiers, workplace names, or unconsented disclosures into a research copy. Use anonymous participant IDs and separate consent records.
          </p>
          <button className="btn btn-forest btn-tiny" style={{ marginTop: 12 }} onClick={() => setAck(true)}>
            <window.Icon name="checkin" size={14} /> I understand; show research references
          </button>
        </div>
        <ResearchSchemaPanel />
        <PublicPathwayPanel />
      </div>
    );
  }

  return (
    <div className="stack reveal">
      <ResearchReadinessPanel compact />
      <ResearchSchemaPanel compact />
      <ModuleLibraryPanel moduleKey="research" lowTextMode={lowTextMode} tapOnlyMode={tapOnlyMode} readAloud={readAloud} showBrowseLists />
    </div>
  );
}

function ResearchReadinessPanel({ compact = false }) {
  const items = [
    ['Prototype status', 'This is a private prototype and research-planning aid, not a clinically validated intervention. Do not present outcomes as evidence until a pilot and ethics review are complete.'],
    ['Consent before capture', 'Collect explicit consent before any research logging. Make participation optional, revocable, and separate from support access.'],
    ['Anonymise by default', 'Use participant IDs. Remove names, phone numbers, home details, employer names, screenshots, and details that could identify relatives or abusers.'],
    ['Human escalation', 'Red-risk states belong in urgent human support pathways, not deeper analysis or research questions.'],
  ];
  return (
    <div className="card-tactile" style={{ background: compact ? 'var(--paper-bright)' : 'linear-gradient(135deg, var(--rose-wash), var(--paper-bright))' }}>
      <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Research and public-readiness limits</p>
      <h2 className="display" style={{ fontSize: compact ? 22 : 28, marginTop: 6 }}>Use this as a prototype until it has been reviewed, piloted, and validated.</h2>
      {!compact && (
        <div className="grid-2" style={{ marginTop: 14 }}>
          {items.map(([title, body]) => (
            <div key={title} className="card-sunk" style={{ background: 'rgba(255,255,255,0.45)' }}>
              <p className="eyebrow" style={{ color: title === 'Human escalation' ? 'var(--crisis)' : 'var(--forest)' }}>{title}</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{body}</p>
            </div>
          ))}
        </div>
      )}
      {compact && <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{items.map(x => x[0]).join(' · ')}</p>}
    </div>
  );
}

function ResearchSchemaPanel({ compact = false }) {
  return (
    <div className="card">
      <p className="eyebrow" style={{ color: 'var(--forest)' }}>App-ready data dictionary</p>
      <h3 className="display" style={{ fontSize: compact ? 21 : 24, marginTop: 6 }}>Future backend tables should stay separate and link by namespaced IDs.</h3>
      <div className="grid-2" style={{ marginTop: 14 }}>
        {RESEARCH_SCHEMA_TABLES.map(([table, body]) => (
          <div key={table} className="card-sunk" style={{ background: 'var(--paper-bright)' }}>
            <p className="mono" style={{ color: 'var(--forest)', fontWeight: 700 }}>{table}</p>
            {!compact && <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicPathwayPanel() {
  return (
    <div className="card">
      <p className="eyebrow" style={{ color: 'var(--forest)' }}>Public/private pathway rules</p>
      <div className="grid-2" style={{ marginTop: 14 }}>
        {PUBLIC_PATHWAY_RULES.map(([title, body]) => (
          <div key={title} className="phrase-row safe" style={{ marginTop: 0 }}>
            <div className="phrase-label safe">{title}</div>
            <div className="phrase-text">{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleLibraryPanel({ moduleKey, lowTextMode = false, tapOnlyMode = false, readAloud = false, showBrowseLists = true, onOpenTool, onUnsafe }) {
  const moduleData = window.AMANAT_RECOVERY_MODULES?.[moduleKey] || { meta: {}, items: [], support: {} };
  const config = RECOVERY_MODULE_CONFIGS[moduleKey] || {};
  const items = moduleData.items || [];
  const [query, setQuery] = useStateS('');
  const [filters, setFilters] = useStateS({});
  const [selectedId, setSelectedId] = useStateS(items[0]?.id || null);
  const [showExplanation, setShowExplanation] = useStateS(false);
  const [showResults, setShowResults] = useStateS(showBrowseLists);
  const [safetyGate, setSafetyGate] = useStateS(showBrowseLists ? 'role-open' : null);
  const [consentGate, setConsentGate] = useStateS(moduleKey !== 'intimacy');
  useEffectS(() => setShowResults(showBrowseLists), [showBrowseLists]);
  useEffectS(() => { if (showBrowseLists) setSafetyGate('role-open'); }, [showBrowseLists]);

  const filterKeys = Object.keys(config.filterLabels || {});
  const optionsByFilter = useMemoS(() => {
    const next = {};
    filterKeys.forEach(key => {
      next[key] = Array.from(new Set(items.map(item => item[key]).filter(Boolean))).sort();
    });
    return next;
  }, [items, filterKeys.join('|')]);

  const searchableText = (item) => Object.values(item).join(' ').toLowerCase();
  const filtered = useMemoS(() => {
    const q = query.trim().toLowerCase();
    return items.filter(item => {
      for (const key of filterKeys) {
        if (filters[key] && filters[key] !== 'all' && item[key] !== filters[key]) return false;
      }
      return !q || searchableText(item).includes(q);
    });
  }, [items, query, filters, filterKeys.join('|')]);

  const selected = items.find(item => item.id === selectedId) || filtered[0] || items[0];
  const shown = filtered.slice(0, 80);
  const supportEntries = Object.entries(moduleData.support || {}).filter(([, rows]) => rows?.length);
  const visibleSections = lowTextMode && !showExplanation ? (config.sections || []).slice(0, 3) : (config.sections || []);

  useEffectS(() => {
    if (filtered.length && !filtered.some(item => item.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  const drawItem = () => {
    const pool = filtered.length ? filtered : items;
    if (!pool.length) return;
    setSelectedId(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const copySelected = async () => {
    if (!selected) return;
    const ok = await window.copyToClipboard(selected.cardText || selected.script || selected.trigger || '');
    if (ok) window.dispatchEvent(new CustomEvent('amanat:toast', { detail: 'Copied.' }));
  };

  if (!safetyGate && moduleKey !== 'research') {
    return <SafetyGatePanel moduleTitle={config.eyebrow || moduleData.meta.title} onContinue={setSafetyGate} onUnsafe={onUnsafe} onOpenTool={onOpenTool} />;
  }

  if (moduleKey === 'intimacy' && !consentGate) {
    return <ConsentGatePanel onContinue={() => setConsentGate(true)} onUnsafe={onUnsafe} onOpenTool={onOpenTool} />;
  }

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-raised))' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>{config.eyebrow || moduleData.meta.title}</p>
        <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>{config.title || moduleData.meta.title}</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {lowTextMode ? 'Start with one body step. Details are optional.' : `${config.intro} ${moduleData.meta.totalItems || items.length} primary rows imported.`}
        </p>
        {safetyGate === 'amber' && (
          <div className="card-sunk" style={{ background: 'var(--amber-wash)', marginTop: 12 }}>
            <p className="eyebrow" style={{ color: 'var(--amber)' }}>Amber mode</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>Read only the first step first. No major decisions while flooded.</p>
          </div>
        )}
        <div className="cluster" style={{ marginTop: 14 }}>
          <button className="btn btn-forest" onClick={drawItem}><window.Icon name="reload" size={16} /> {config.drawLabel || 'Draw one'}</button>
          <button className="btn btn-soft" onClick={() => setShowExplanation(v => !v)}>
            <window.Icon name={showExplanation ? 'close' : 'help'} size={16} /> {showExplanation ? 'Skip explanation' : 'Show explanation'}
          </button>
          {!tapOnlyMode && (
            <>
              <input
                className="composer-input"
                style={{ minHeight: 40, maxWidth: 360 }}
                placeholder={config.placeholder || 'Search this module...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {filterKeys.map(key => (
                <select key={key} className="input-select" value={filters[key] || 'all'} onChange={e => updateFilter(key, e.target.value)}>
                  <option value="all">{config.filterLabels[key]}</option>
                  {(optionsByFilter[key] || []).map(x => <option key={x} value={x}>{key === 'risk' ? supportLabel(x) : x}</option>)}
                </select>
              ))}
            </>
          )}
        </div>
      </div>
      {tapOnlyMode && <TapOnlyNote />}

      {selected && (
        <div className="card-tactile survivor-card-feature">
          <div className="cluster" style={{ gap: 6 }}>
            <span className="chip">{selected.standardId || selected.sourceCardId || selected.rowId || selected.id}</span>
            {(selected.visibility || config.visibility) && <span className="chip chip-forest">{selected.visibility || config.visibility}</span>}
            {safetyGate && safetyGate !== 'role-open' && (
              <span className={"chip chip-" + (safetyGate === 'amber' ? 'amber' : 'forest')}>Now: {safetyGate === 'amber' ? 'Extra support' : 'Safe enough'}</span>
            )}
            {(config.chips || []).map(field => selected[field] ? (
              <span key={field} className={"chip chip-" + chipTone(field === 'risk' ? (selected.baselineSupportLevel || selected.supportLevel || selected[field]) : selected[field], field)}>
                {field === 'risk' ? `Baseline: ${supportLabel(selected.baselineSupportLevel || selected.supportLevel || selected[field])}` : selected[field]}
              </span>
            ) : null)}
          </div>
          <h3 className="display" style={{ fontSize: 28, marginTop: 12 }}>{selected.trigger || selected.context || selected.category || selected.id}</h3>
          {(selected.context || selected.environment || selected.domain) && (
            <p style={{ color: 'var(--ink-faint)', marginTop: 4 }}>{[selected.context || selected.environment, selected.domain, selected.subdomain].filter(Boolean).join(' · ')}</p>
          )}

          {selected.shameSentence && (
            <div className="phrase-row threat">
              <div className="phrase-label threat">Shame sentence</div>
              <div className="phrase-text">{selected.shameSentence}</div>
            </div>
          )}
          {selected.bodySignal && (
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 10 }}><strong>Body signal:</strong> {selected.bodySignal}</p>
          )}

          <div className="card-sunk" style={{ background: 'var(--forest-wash)', marginTop: 14 }}>
            <p className="eyebrow" style={{ color: 'var(--forest)' }}>First step</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>Put both feet down. Name today. Look for one ordinary object in the room. Then decide if you want details.</p>
          </div>

          {moduleKey === 'roughDay' && (
            <div className="card-sunk" style={{ background: 'var(--amber-wash)', marginTop: 14 }}>
              <p className="eyebrow" style={{ color: 'var(--amber)' }}>Flooded-state rule</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>Do not make major life decisions while flooded. Choose safety, sleep, food, water, and one real person first.</p>
            </div>
          )}

          <div className="grid-2" style={{ marginTop: 12 }}>
            {visibleSections.map(([label, field, tone]) => selected[field] ? (
              <div key={field + label} className={"phrase-row " + (tone || 'safe')} style={{ marginTop: 0 }}>
                <div className={"phrase-label " + (tone || 'safe')}>{label}</div>
                <div className="phrase-text">{selected[field]}</div>
              </div>
            ) : null)}
          </div>

          {selected.supportResponse && (
            <div className="card-sunk" style={{ background: 'var(--paper-bright)', marginTop: 14 }}>
              <p className="eyebrow">Supporter response</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{selected.supportResponse}</p>
            </div>
          )}
          {selected.pakistanRelevance && (
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 12 }}>{selected.pakistanRelevance}</p>
          )}

          {CONFRONTATION_CAUTION_MODULES.has(moduleKey) && <UnsafeConfrontationNote compact />}

          {showExplanation && (
            <details open style={{ marginTop: 14 }}>
              <summary className="ui-sans" style={{ cursor: 'pointer', fontWeight: 700 }}>Full imported row</summary>
              <pre className="card-text-pre">{selected.cardText}</pre>
            </details>
          )}
          <div className="cluster" style={{ marginTop: 14 }}>
            <ReadAloudButton enabled={readAloud} text={[selected.trigger || selected.context || selected.category, selected.shameSentence, selected.bodySignal, selected.grounding || selected.action || selected.script || selected.repair, selected.supportResponse].filter(Boolean).join('. ')} />
            <button className="btn btn-soft btn-tiny" onClick={copySelected}>
              <window.Icon name="copy" size={14} /> Copy
            </button>
          </div>
        </div>
      )}

      {showExplanation && supportEntries.length > 0 && (
        <div className="card">
          <p className="eyebrow">Workbook helper sheets</p>
          <div className="cluster" style={{ gap: 6, marginTop: 10 }}>
            {supportEntries.map(([name, rows]) => <span key={name} className="chip">{name}: {rows.length}</span>)}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <p className="eyebrow">{filtered.length} matching rows</p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{showResults ? 'Showing first 80 below.' : 'List hidden in survivor mode.'}</p>
      </div>
      {!showResults ? (
        <HiddenResultsCard count={filtered.length} label="matching rows" onShow={() => setShowResults(true)} />
      ) : (
        <div className="grid-2">
          {shown.map(item => (
            <button key={item.id} className="card" style={{ textAlign: 'left' }} onClick={() => setSelectedId(item.id)}>
              <div className="cluster" style={{ gap: 6 }}>
                <span className="chip">{item.id}</span>
                {item.risk && <span className={"chip chip-" + chipTone(item.baselineSupportLevel || item.supportLevel || item.risk, 'risk')}>Baseline: {supportLabel(item.baselineSupportLevel || item.supportLevel || item.risk)}</span>}
                {item.category && <span className="chip chip-forest">{item.category}</span>}
              </div>
              <h3 className="display" style={{ fontSize: 19, marginTop: 10 }}>{item.trigger || item.context || item.id}</h3>
              {item.shameSentence && <p style={{ color: 'var(--rose)', fontSize: 14, marginTop: 6, fontStyle: 'italic' }}>{item.shameSentence}</p>}
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 8 }}>
                {item.script || item.grounding || item.action || item.repair || item.story || item.safeRouting || item.module}
              </p>
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 10 }}>{[item.profile, item.module, item.domain].filter(Boolean).join(' · ')}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TriggerLibraryPanel({ showBrowseLists = true, tapOnlyMode = false, readAloud = false }) {
  const library = window.AMANAT_TRIGGER_LIBRARY || { meta: {}, triggers: [], pakistanTriggers: [] };
  const all = useMemoS(() => [
    ...library.pakistanTriggers.map(x => ({ ...x, sourceSet: 'Pakistan' })),
    ...library.triggers.map(x => ({ ...x, sourceSet: 'General' })),
  ], [library]);
  const [query, setQuery] = useStateS('');
  const [sourceSet, setSourceSet] = useStateS('all');
  const [risk, setRisk] = useStateS('all');
  const [domain, setDomain] = useStateS('all');
  const [showResults, setShowResults] = useStateS(showBrowseLists);
  const [selectedTrigger, setSelectedTrigger] = useStateS(null);
  useEffectS(() => setShowResults(showBrowseLists), [showBrowseLists]);

  const domains = useMemoS(() => Array.from(new Set(all.map(x => x.domain).filter(Boolean))).sort(), [all]);
  const risks = useMemoS(() => Array.from(new Set(all.map(x => x.risk).filter(Boolean))).sort(), [all]);
  const filtered = useMemoS(() => {
    const q = query.trim().toLowerCase();
    return all.filter(item => {
      if (sourceSet !== 'all' && item.sourceSet !== sourceSet) return false;
      if (risk !== 'all' && item.risk !== risk) return false;
      if (domain !== 'all' && item.domain !== domain) return false;
      if (!q) return true;
      return [item.cue, item.environment, item.story, item.bodySignals, item.responsePattern, item.grounding, item.selfScript, item.tags, item.module]
        .join(' ')
        .toLowerCase()
        .includes(q);
    }).slice(0, 80);
  }, [all, query, sourceSet, risk, domain]);

  return (
    <div className="stack reveal">
      <div className="card-tactile">
        <p className="eyebrow">Trigger database</p>
        <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>Humsafar Trauma Trigger Library</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {library.meta.totalGeneralTriggers || library.triggers.length} general triggers and {library.meta.totalPakistanTriggers || library.pakistanTriggers.length} Pakistan-specific triggers imported from the workbook.
        </p>
        <div className="cluster" style={{ marginTop: 14 }}>
          {!tapOnlyMode ? (
            <>
              <input
                className="composer-input"
                style={{ minHeight: 40, maxWidth: 360 }}
                placeholder="Search cue, body signal, module, tag..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <select className="input-select" value={sourceSet} onChange={e => setSourceSet(e.target.value)}>
                <option value="all">All sets</option>
                <option value="Pakistan">Pakistan</option>
                <option value="General">General</option>
              </select>
              <select className="input-select" value={risk} onChange={e => setRisk(e.target.value)}>
                <option value="all">All support levels</option>
                {risks.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
              <select className="input-select" value={domain} onChange={e => setDomain(e.target.value)}>
                <option value="all">All domains</option>
                {domains.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </>
          ) : (
            <button className="btn btn-forest" onClick={() => setShowResults(true)}><window.Icon name="tools" size={16} /> Show trigger cards</button>
          )}
        </div>
      </div>
      {tapOnlyMode && <TapOnlyNote />}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
        <p className="eyebrow">{filtered.length} shown</p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 12 }}>{showResults ? 'Showing up to 80 results for performance.' : 'List hidden in survivor mode.'}</p>
      </div>

      {!showResults ? (
        <HiddenResultsCard count={filtered.length} label="matching triggers" onShow={() => setShowResults(true)} />
      ) : (
        <div className="grid-2">
          {filtered.map(item => (
            <div key={item.id + item.sourceSet} className="phrase-card trigger-result-card">
              <div className="cluster" style={{ gap: 6 }}>
                <span className="chip">TRIGGER:{item.sourceSet.toUpperCase()}:{item.id}</span>
                <span className={"chip chip-" + (item.sourceSet === 'Pakistan' ? 'forest' : 'amber')}>{item.sourceSet}</span>
                {item.risk && <span className={"chip chip-" + chipTone(item.risk, 'risk')}>{supportLabel(item.risk)}</span>}
                {item.intensity && <span className="chip">Intensity {item.intensity}/5</span>}
              </div>
              <h3 className="display" style={{ fontSize: 20, marginTop: 10 }}>{item.cue}</h3>
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 4 }}>{item.domain} · {item.subdomain}</p>
              {item.story && (
                <div className="phrase-row threat">
                  <div className="phrase-label threat">Trauma story</div>
                  <div className="phrase-text">{item.story}</div>
                </div>
              )}
              {item.grounding && (
                <div className="phrase-row safe">
                  <div className="phrase-label safe">Grounding</div>
                  <div className="phrase-text">{item.grounding}</div>
                </div>
              )}
              {item.selfScript && <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 10 }}><strong>Self-script:</strong> {item.selfScript}</p>}
              {item.bodySignals && <p style={{ color: 'var(--ink-faint)', fontSize: 13, marginTop: 8 }}><strong>Body:</strong> {item.bodySignals}</p>}
              {item.partnerResponse && <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 8 }}><strong>Partner/clinician:</strong> {item.partnerResponse}</p>}
              <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 10 }}>{item.module} · {item.tags}</p>
              <div className="cluster" style={{ marginTop: 10 }}>
                <ReadAloudButton enabled={readAloud} text={[item.cue, item.story, item.grounding, item.selfScript].filter(Boolean).join('. ')} />
                <button className="btn btn-ghost btn-tiny" onClick={() => setSelectedTrigger(item)}>Open detail <window.Icon name="chevronRight" size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedTrigger && <TriggerDetailOverlay item={selectedTrigger} onClose={() => setSelectedTrigger(null)} readAloud={readAloud} />}
    </div>
  );
}

function TriggerDetailOverlay({ item, onClose, readAloud }) {
  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-label="Trigger detail">
      <div className="detail-topbar">
        <button className="btn btn-ghost btn-tiny" onClick={onClose}>
          <window.Icon name="chevronLeft" size={14} /> Triggers
        </button>
        <span className="chip">TRIGGER:{item.sourceSet?.toUpperCase()}:{item.id}</span>
      </div>
      <div className="page page-narrow">
        <div className="cluster" style={{ gap: 6 }}>
          {item.risk && <span className={"chip chip-" + chipTone(item.risk, 'risk')}>{supportLabel(item.risk)}</span>}
          {item.domain && <span className="chip chip-forest">{item.domain}</span>}
          {item.sourceSet && <span className="chip">{item.sourceSet}</span>}
        </div>
        <p className="eyebrow" style={{ marginTop: 20 }}>Trigger</p>
        <h1 className="page-title">{item.cue}</h1>
        <p className="page-lede">{[item.environment, item.subdomain, item.module].filter(Boolean).join(' · ')}</p>
        <div className="stack" style={{ marginTop: 20 }}>
          {item.story && (
            <div className="phrase-row threat">
              <div className="phrase-label threat">Old story</div>
              <div className="phrase-text">{item.story}</div>
            </div>
          )}
          {item.bodySignals && (
            <div className="phrase-row">
              <div className="phrase-label">Body may show</div>
              <div className="phrase-text">{item.bodySignals}</div>
            </div>
          )}
          {item.responsePattern && (
            <div className="phrase-row">
              <div className="phrase-label">Protection response</div>
              <div className="phrase-text">{item.responsePattern}</div>
            </div>
          )}
          {item.grounding && (
            <div className="phrase-row safe">
              <div className="phrase-label safe">Try this now</div>
              <div className="phrase-text">{item.grounding}</div>
            </div>
          )}
          {item.selfScript && (
            <div className="phrase-row safe">
              <div className="phrase-label safe">What you can say</div>
              <div className="phrase-text">{item.selfScript}</div>
            </div>
          )}
          {item.partnerResponse && (
            <div className="card-sunk" style={{ background: 'var(--paper-bright)' }}>
              <p className="eyebrow">Support should look like</p>
              <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{item.partnerResponse}</p>
            </div>
          )}
          {item.tags && <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Tags: {item.tags}</p>}
          <div className="cluster">
            <ReadAloudButton enabled={readAloud} text={[item.cue, item.story, item.bodySignals, item.grounding, item.selfScript, item.partnerResponse].filter(Boolean).join('. ')} />
            <button className="btn btn-soft btn-tiny" onClick={async () => {
              const ok = await window.copyToClipboard([item.cue, item.story, item.grounding, item.selfScript].filter(Boolean).join('\n\n'));
              if (ok) window.dispatchEvent(new CustomEvent('amanat:toast', { detail: 'Copied.' }));
            }}>
              <window.Icon name="copy" size={14} /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotSafePanel({ onOpenTool, safetyLanguage = 'english', lowTextMode = false }) {
  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Safety first</p>
        <h2 className="display" style={{ fontSize: 30, marginTop: 6 }}>If you are not safe, do not analyse this yet.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {lowTextMode ? 'First: contact, distance, light, and a real human.' : 'This path is for physical danger, coercion, self-harm risk, severe dissociation, or being trapped somewhere unsafe. The goal is contact, distance, light, and a real human.'}
        </p>
        <div className="cluster" style={{ marginTop: 16 }}>
          <button className="btn btn-crisis" onClick={() => onOpenTool('danger')}><window.Icon name="crisis" size={16} /> Open urgent safety flow</button>
          <a className="btn btn-soft" href="tel:1122"><window.Icon name="phone" size={16} /> Call 1122</a>
          <a className="btn btn-soft" href="tel:15"><window.Icon name="phone" size={16} /> Call 15</a>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>1. Move toward safety</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>People, light, exit, lock, public place.</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>If you can move without increasing danger, move closer to another person, a lit area, a door, a lock, a shop, a neighbour, or the street.</p>
        </div>
        <div className="card">
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>2. Stay connected</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Call or text one real person.</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Use plain words: “{safetyPhrase(safetyLanguage, 'trusted')}” If calling is unsafe, send a short text or missed call signal.</p>
        </div>
        <div className="card">
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>3. Reduce immediate harm</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Put distance between you and means.</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>If self-harm risk is present, move away from blades, pills, cords, weapons, heights, or anything you could use before the wave passes.</p>
        </div>
        <div className="card">
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>4. No deep processing</p>
          <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>Do not solve the whole life right now.</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{safetyPhrase(safetyLanguage, 'flooded')} Avoid confrontations, long messages, or trauma analysis. First get through the next few minutes with support.</p>
        </div>
      </div>

      <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>If the screen needs to look neutral</p>
        <div className="cluster" style={{ marginTop: 10 }}>
          <button className="btn btn-ghost" onClick={() => onOpenTool('public')}><window.Icon name="shield" size={16} /> Public-place mode</button>
          <a className="btn btn-ghost" href="sms:"><window.Icon name="send" size={16} /> Text someone</a>
        </div>
      </div>
    </div>
  );
}

function CoercionPanel({ onOpenTool, safetyLanguage = 'english', lowTextMode = false }) {
  const warningSigns = [
    'They monitor your phone, location, messages, clothes, money, study, work, or friendships.',
    'They threaten harm, divorce, exposure, family shame, deportation, custody loss, or financial punishment.',
    'They block exits, hide documents, take your phone, control transport, or stop you from contacting help.',
    'They pressure you to forgive, stay silent, meet someone, marry, have sex, disclose, withdraw a complaint, or stop therapy.',
  ];
  const saferSteps = [
    'Do not announce a plan to leave or confront them if that could increase danger.',
    `Use a neutral reason to move: "${safetyPhrase(safetyLanguage, 'movement')}"`,
    'Keep evidence only if it is safe: screenshots, dates, threats, injuries, witnesses, money records.',
    `Choose one code phrase with a trusted person, such as "${safetyPhrase(safetyLanguage, 'recipe')}" meaning "call me now."`,
  ];
  const visibleWarningSigns = lowTextMode ? warningSigns.slice(0, 2) : warningSigns;
  const visibleSaferSteps = lowTextMode ? saferSteps.slice(0, 2) : saferSteps;

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Being controlled or unsafe</p>
        <h2 className="display" style={{ fontSize: 30, marginTop: 6 }}>Control is a safety issue, even when no one is shouting.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {lowTextMode ? 'If saying no feels unsafe, choose contact and distance first.' : 'This is for monitoring, threats, forced choices, blocked exits, financial control, family pressure, sexual pressure, or being made afraid to say no.'}
        </p>
        <div className="cluster" style={{ marginTop: 16 }}>
          <button className="btn btn-crisis" onClick={() => onOpenTool('danger')}><window.Icon name="crisis" size={16} /> If danger is immediate</button>
          <a className="btn btn-soft" href="sms:"><window.Icon name="send" size={16} /> Text trusted person</a>
          <button className="btn btn-ghost" onClick={() => onOpenTool('public')}><window.Icon name="shield" size={16} /> Neutral screen</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Warning signs</p>
          <ul style={{ paddingLeft: 20, margin: '12px 0 0', color: 'var(--ink-soft)', display: 'grid', gap: 8 }}>
            {visibleWarningSigns.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <p className="eyebrow" style={{ color: 'var(--forest)' }}>Safer next steps</p>
          <ul style={{ paddingLeft: 20, margin: '12px 0 0', color: 'var(--ink-soft)', display: 'grid', gap: 8 }}>
            {visibleSaferSteps.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Words that do not reveal the whole situation</p>
        <div className="grid-2" style={{ marginTop: 10 }}>
          <div className="phrase-row safe" style={{ marginTop: 0 }}>
            <div className="phrase-label safe">To a trusted person</div>
            <div className="phrase-text">“{safetyPhrase(safetyLanguage, 'trustedShort')}”</div>
          </div>
          <div className="phrase-row safe" style={{ marginTop: 0 }}>
            <div className="phrase-label safe">To create movement</div>
            <div className="phrase-text">“{safetyPhrase(safetyLanguage, 'movement')}”</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ borderColor: 'rgba(179, 67, 56, 0.25)' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Do not do this if it raises danger</p>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          Do not confront, threaten to leave, disclose saved evidence, or tell them you are using a safety tool if they may retaliate. Safety planning works best with a real person who understands the local risk.
        </p>
      </div>
    </div>
  );
}

function DomesticViolencePlanPanel({ onOpenTool, safetyLanguage = 'english', lowTextMode = false }) {
  const steps = [
    ['Do not announce a plan', 'If leaving, refusing, or asking for help could increase danger, keep the plan private and involve a safe person.'],
    ['Prepare quiet essentials', 'If safe: ID, medication, charger, money, keys, documents, children’s essentials, and one safe contact.'],
    ['Use neutral movement', `Use ordinary reasons: "${safetyPhrase(safetyLanguage, 'movement')}" or buying something, helping someone, fresh air.`],
    ['Choose a code phrase', `Agree with one trusted person that "${safetyPhrase(safetyLanguage, 'recipe')}" means "call me now" or "send help."`],
    ['Keep evidence only if safe', 'Screenshots, dates, threats, injuries, and witnesses can help later, but do not store evidence where the unsafe person can find it.'],
    ['Plan after leaving', 'Think transport, a first safe place, phone privacy, blocked tracking, and who should not be told your location.'],
  ];
  const shown = lowTextMode ? steps.slice(0, 3) : steps;

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Domestic violence safety planning</p>
        <h2 className="display" style={{ fontSize: 30, marginTop: 6 }}>Safety planning is not confrontation. It is quiet protection.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          Use this for partner, family, in-law, employer, or household abuse where power, money, transport, documents, threats, or surveillance are involved.
        </p>
        <div className="cluster" style={{ marginTop: 16 }}>
          <button className="btn btn-crisis" onClick={() => onOpenTool('danger')}><window.Icon name="crisis" size={16} /> Immediate danger</button>
          <a className="btn btn-soft" href="tel:15"><window.Icon name="phone" size={16} /> Call 15</a>
          <a className="btn btn-soft" href="tel:1122"><window.Icon name="phone" size={16} /> Call 1122</a>
          <button className="btn btn-ghost" onClick={() => onOpenTool('public')}><window.Icon name="shield" size={16} /> Neutral screen</button>
        </div>
      </div>
      <div className="grid-2">
        {shown.map(([title, body]) => (
          <div key={title} className="card">
            <p className="eyebrow" style={{ color: 'var(--forest)' }}>{title}</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{body}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ borderColor: 'rgba(179, 67, 56, 0.25)' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Avoid if it increases danger</p>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Do not confront, reveal evidence, threaten to leave, share the plan with unsafe relatives, or use this app openly if monitoring is possible.</p>
      </div>
    </div>
  );
}

function CsaDisclosurePanel({ onOpenTool }) {
  const survivorSteps = [
    ['You do not have to prove everything right now', 'A disclosure can be partial, unclear, remembered in pieces, or said for the first time. Start with safety and support.'],
    ['Check current safety', 'If the person who harmed you has access to you, a child, your home, your phone, or your family system, treat this as a safety issue.'],
    ['Choose one safe person', 'Tell someone who can stay calm, believe you, and not force confrontation, forgiveness, or family disclosure.'],
    ['Medical/legal choices are yours', 'If there is recent assault, injury, pregnancy risk, STI risk, or ongoing contact with the abuser, consider urgent medical or specialist support.'],
  ];
  const supporterSteps = [
    'Say: “I believe you. I am sorry this happened. You are not to blame.”',
    'Do not ask graphic questions or push for a full timeline.',
    'Ask: “Are you safe from that person now?”',
    'Offer choices: quiet presence, safe adult, clinician, medical care, or a specialist child/sexual abuse support organization.',
  ];

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Childhood sexual abuse disclosure support</p>
        <h2 className="display" style={{ fontSize: 30, marginTop: 6 }}>If childhood sexual abuse is named, go slowly and protect choice.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>This app is not a forensic, legal, or medical service. It can help with immediate containment and routing to human support.</p>
        <div className="cluster" style={{ marginTop: 16 }}>
          <button className="btn btn-crisis" onClick={() => onOpenTool('danger')}><window.Icon name="crisis" size={16} /> Not safe now</button>
          <a className="btn btn-soft" href="sms:"><window.Icon name="send" size={16} /> Text safe person</a>
        </div>
      </div>
      <div className="grid-2">
        {survivorSteps.map(([title, body]) => (
          <div key={title} className="card">
            <p className="eyebrow" style={{ color: 'var(--forest)' }}>{title}</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{body}</p>
          </div>
        ))}
      </div>
      <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>If someone discloses to you</p>
        <ul style={{ paddingLeft: 20, margin: '12px 0 0', color: 'var(--ink-soft)', display: 'grid', gap: 8 }}>
          {supporterSteps.map((step, i) => <li key={i}>{step}</li>)}
        </ul>
      </div>
    </div>
  );
}

function MedicalRedFlagsPanel({ onOpenTool }) {
  const redFlags = [
    'Chest pain that is severe, new, crushing, or comes with sweating, fainting, nausea, jaw/arm pain, or trouble breathing.',
    'Fainting, seizure, confusion, sudden weakness, face drooping, or trouble speaking.',
    'Heavy bleeding, poisoning/overdose risk, serious injury, burns, choking, or severe allergic reaction.',
    'Severe abdominal pain, pregnancy-related bleeding/pain, high fever with stiff neck, or sudden worst headache.',
    'Self-harm injury, strangulation, sexual assault injury, or any injury from violence.',
  ];
  const amber = [
    'If symptoms are new, intense, worsening, or “not like usual,” choose medical advice over only grounding.',
    'If panic is possible but you are unsure, sit upright, loosen tight clothing, call/message a person, and consider urgent care.',
    'This app cannot decide whether symptoms are trauma, panic, or medical.',
  ];

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Body danger signs</p>
        <h2 className="display" style={{ fontSize: 30, marginTop: 6 }}>Some body alarms need medical help, not only grounding.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>Trauma can affect the body, but the app cannot rule out medical emergencies.</p>
        <div className="cluster" style={{ marginTop: 16 }}>
          <a className="btn btn-crisis" href="tel:1122"><window.Icon name="phone" size={16} /> Call 1122</a>
          <button className="btn btn-soft" onClick={() => onOpenTool('public')}><window.Icon name="shield" size={16} /> Discreet grounding while waiting</button>
        </div>
      </div>
      <div className="card" style={{ borderColor: 'rgba(179, 67, 56, 0.25)' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Seek urgent medical help for</p>
        <ul style={{ paddingLeft: 20, margin: '12px 0 0', color: 'var(--ink-soft)', display: 'grid', gap: 8 }}>
          {redFlags.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className="grid-2">
        {amber.map((item, i) => (
          <div key={i} className="card-sunk" style={{ background: 'var(--amber-wash)' }}>
            <p style={{ color: 'var(--ink-soft)' }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SharedDevicePanel({ lowTextMode = false }) {
  const cards = [
    ['Quick exit', 'Use the Exit button to clear local app data and turn the screen into a neutral Notes page.'],
    ['Disguise mode', 'Turn on Shared device mode or Disguise as Notes in settings when a family phone, partner, employer, or child may see the screen.'],
    ['Deletion clarity', 'Erase everything clears local moods, journal entries, saved scripts, and local chat from this browser. It cannot erase text already processed by an AI service.'],
    ['Write less detail', 'Avoid names, addresses, exact locations, school or workplace names, and identifying details if someone else can access the device.'],
  ];
  const visibleCards = lowTextMode ? cards.slice(0, 2) : cards;

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Shared-device safety</p>
        <h2 className="display" style={{ fontSize: 30, marginTop: 6 }}>Make the app easier to hide, clear, or use with less detail.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
          {lowTextMode ? 'Use neutral words. Clear local data. Leave fast.' : 'This is for shared phones, monitored devices, family laptops, workplace devices, or any moment where privacy is uncertain.'}
        </p>
      </div>

      <div className="grid-2">
        {visibleCards.map(([title, body]) => (
          <div key={title} className="card">
            <p className="eyebrow" style={{ color: 'var(--forest)' }}>{title}</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{body}</p>
          </div>
        ))}
      </div>

      <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Code phrases you can choose with a trusted person</p>
        <div className="grid-2" style={{ marginTop: 10 }}>
          <div className="phrase-row safe" style={{ marginTop: 0 }}>
            <div className="phrase-label safe">Call me</div>
            <div className="phrase-text">“Can you send the recipe?”</div>
          </div>
          <div className="phrase-row safe" style={{ marginTop: 0 }}>
            <div className="phrase-label safe">I need help leaving</div>
            <div className="phrase-text">“The battery is low.”</div>
          </div>
          <div className="phrase-row safe" style={{ marginTop: 0 }}>
            <div className="phrase-label safe">I am safe</div>
            <div className="phrase-text">“I found the file.”</div>
          </div>
          <div className="phrase-row safe" style={{ marginTop: 0 }}>
            <div className="phrase-label safe">Do not reply in detail</div>
            <div className="phrase-text">“Send only a dot if you understand.”</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModesPanel({ onOpenTool }) {
  return (
    <div className="stack reveal">
      <div className="grid-2">
        {window.AMANAT_CONTENT.supportModes.map(mode => (
          <div key={mode.id} className="card">
            <p className="eyebrow">{mode.subtitle}</p>
            <h3 className="display" style={{ fontSize: 22, marginTop: 6 }}>{mode.title}</h3>
            <ul style={{ paddingLeft: 18, margin: '14px 0 0', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mode.lines.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <div className="cluster" style={{ marginTop: 14 }}>
              {mode.id === 'unsafe' && <button className="btn btn-crisis btn-tiny" onClick={() => onOpenTool('danger')}>Open danger flow</button>}
              {mode.id === 'public' && <button className="btn btn-forest btn-tiny" onClick={() => onOpenTool('public')}>Open public mode</button>}
              {mode.id === 'sit' && <button className="btn btn-soft btn-tiny" onClick={async () => { await window.copyToClipboard(mode.lines.join('\n')); }}>Copy sitting script</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodPanel({ store, onLogMood }) {
  const { state } = store;
  const insight = window.getMoodInsight(state.moodLog);
  const reversed = state.moodLog.slice().reverse();

  return (
    <div className="stack reveal">
      <div className="card-tactile">
        <p className="eyebrow">Right now</p>
        <h3 className="display" style={{ fontSize: 24, marginTop: 6 }}>How are you arriving?</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>One tap. There is no wrong answer.</p>
        <div className="cluster" style={{ gap: 10, marginTop: 14 }}>
          {window.AMANAT_CONTENT.moodVocab.map(m => (
            <button key={m.key} className="mood-dot" onClick={() => onLogMood(m)} title={m.label}>
              <span className="mood-glyph" style={{ background: m.wash }}>{m.glyph}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <p className="eyebrow">Pattern (this session{state.moodLog.length >= 7 ? '+' : ''})</p>
          <span className="mono" style={{ color: 'var(--ink-faint)' }}>{state.moodLog.length} entries</span>
        </div>
        <h3 className="display-italic" style={{ fontSize: 22, marginTop: 8 }}>{insight.headline}</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{insight.detail}</p>

        {state.moodLog.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <MoodSparkline log={state.moodLog} />
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <p className="eyebrow">Log</p>
          <span className="mono" style={{ color: 'var(--ink-faint)' }}>{state.moodLog.length} total</span>
        </div>
        {reversed.length === 0 && <p style={{ color: 'var(--ink-faint)', marginTop: 14, fontStyle: 'italic' }}>No mood entries yet. Pick a feeling above.</p>}
        {reversed.length > 0 && (
          <div className="stack" style={{ gap: 6, marginTop: 12 }}>
            {reversed.map((m, i) => (
              <div key={m.at + '_' + i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0', borderTop: i ? '1px dashed var(--ink-line)' : 0 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: m.wash, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{m.glyph}</span>
                <div style={{ flex: 1 }}>
                  <div className="ui-sans" style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{new Date(m.at).toLocaleString()}</div>
                </div>
                <span className="ui-sans" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{window.formatRelativeTime(m.at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MoodSparkline({ log }) {
  const order = ['low','flat','mixed','ok','calm','safe'];
  const points = log.slice(-30);
  if (points.length < 2) return <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>One more entry and we&rsquo;ll start to see a line.</p>;
  const W = 600, H = 100, PAD = 8;
  const max = points.length - 1;
  const path = points.map((p, i) => {
    const x = PAD + (i / max) * (W - PAD * 2);
    const v = order.indexOf(p.key);
    const y = PAD + ((order.length - 1 - v) / (order.length - 1)) * (H - PAD * 2);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 110, display: 'block' }}>
      {order.map((_, i) => {
        const y = PAD + (i / (order.length - 1)) * (H - PAD * 2);
        return <line key={i} x1={PAD} x2={W - PAD} y1={y} y2={y} stroke="var(--ink-ghost)" strokeWidth="1" />;
      })}
      <path d={path} fill="none" stroke="var(--forest)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const x = PAD + (i / max) * (W - PAD * 2);
        const v = order.indexOf(p.key);
        const y = PAD + ((order.length - 1 - v) / (order.length - 1)) * (H - PAD * 2);
        return <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 4 : 2.5} fill="var(--forest)" />;
      })}
    </svg>
  );
}

function LanguagePanel({ data, eyebrowText, eyebrowSafe, intro }) {
  return (
    <div className="stack reveal">
      <p style={{ color: 'var(--ink-soft)', maxWidth: '60ch' }}>{intro}</p>
      <div className="grid-2" style={{ marginTop: 6 }}>
        {data.map(d => (
          <div key={d.id} className="phrase-card">
            <h3 className="display" style={{ fontSize: 20 }}>{d.topic}</h3>
            <div className="phrase-row threat">
              <div className="phrase-label threat">{eyebrowText}</div>
              <div className="phrase-text">{d.threat}</div>
            </div>
            <div className="phrase-row safe">
              <div className="phrase-label safe">{eyebrowSafe}</div>
              <div className="phrase-text">{d.safe}</div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 12, fontStyle: 'italic' }}>{d.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AffirmPanel({ store }) {
  const { state, setState } = store;
  const items = window.AMANAT_CONTENT.affirmations;
  const idx = state.affirmIdx % items.length;
  const next = () => setState({ affirmIdx: (idx + 1) % items.length });
  const prev = () => setState({ affirmIdx: (idx - 1 + items.length) % items.length });

  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ textAlign: 'center', padding: '48px 32px', background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-bright))' }}>
        <p className="display-italic" style={{ fontSize: 26, lineHeight: 1.4 }}>"{items[idx]}"</p>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 22 }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setState({ affirmIdx: i })} aria-label={'Affirmation ' + (i + 1)}
              style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 4, background: i === idx ? 'var(--forest)' : 'var(--ink-ghost)', transition: 'all var(--motion)' }} />
          ))}
        </div>
        <div className="cluster" style={{ justifyContent: 'center', marginTop: 18 }}>
          <button className="btn btn-ghost btn-tiny" onClick={prev}><window.Icon name="chevronLeft" size={14} /> Previous</button>
          <button className="btn btn-forest btn-tiny" onClick={next}>Next <window.Icon name="chevronRight" size={14} /></button>
          <button className="btn btn-soft btn-tiny" onClick={async () => { await window.copyToClipboard(items[idx]); alert('Copied.'); }}>
            <window.Icon name="copy" size={14} /> Copy
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// JOURNAL screen
// ────────────────────────────────────────────────────────────────────────────
function JournalScreen({ t, store, persistLocal, onOpenTool }) {
  const [draft, setDraft] = useStateS('');
  const [promptKey, setPromptKey] = useStateS(null);
  const [open, setOpen] = useStateS(true);
  const [safetyAfterSave, setSafetyAfterSave] = useStateS(null);
  const date = useMemoS(() => new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }), []);
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const safetyKind = draft.trim() ? window.AMANAT_SAFETY?.detect(draft) : null;
  const urgentSafety = window.AMANAT_SAFETY?.isUrgent(safetyKind);

  const seedPrompt = (p) => {
    setPromptKey(p.key);
    setDraft(p.seed + '\n');
  };

  const save = () => {
    if (!draft.trim()) return;
    const kind = window.AMANAT_SAFETY?.detect(draft);
    store.addJournal(draft, promptKey);
    setSafetyAfterSave(kind && window.AMANAT_SAFETY?.isUrgent(kind) ? kind : null);
    setDraft(''); setPromptKey(null);
  };

  return (
    <div className="page page-narrow">
      <div className="reveal">
        <p className="eyebrow">Safe Journal</p>
        <h1 className="page-title">A room of its own.</h1>
        <p className="page-lede">
          {persistLocal
            ? 'You\u2019ve chosen to keep entries on this device. They stay here until you delete them.'
            : 'In session-only mode entries disappear when you close this tab. Toggle persistence in settings to keep them.'}
        </p>
      </div>

      <div className="card-tactile reveal">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p className="eyebrow">{date}</p>
          <p className="mono" style={{ color: 'var(--ink-faint)' }}>{words} word{words === 1 ? '' : 's'}</p>
        </div>
        <div className="cluster" style={{ marginTop: 10 }}>
          {window.AMANAT_CONTENT.journalPrompts.map(p => (
            <button key={p.key} className={"chip" + (promptKey === p.key ? ' chip-forest' : '')} onClick={() => seedPrompt(p)}>{p.label}</button>
          ))}
        </div>
        <textarea
          className="textarea"
          style={{ marginTop: 14, minHeight: 220, background: 'var(--paper-bright)', fontSize: 17, lineHeight: 1.7 }}
          placeholder="Begin wherever you are. There is no right way to do this..."
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
        {safetyKind && (
          <div className="card-sunk" style={{ background: urgentSafety ? 'var(--rose-wash)' : 'var(--forest-wash)', marginTop: 14 }}>
            <p className="eyebrow" style={{ color: urgentSafety ? 'var(--crisis)' : 'var(--forest)' }}>
              {urgentSafety ? 'Safety check' : 'Grounding check'}
            </p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
              {urgentSafety
                ? 'This sounds urgent. You can save the entry, but first consider opening the safety flow or contacting one real person now.'
                : window.AMANAT_SAFETY?.reply(safetyKind)}
            </p>
            {urgentSafety && (
              <div className="cluster" style={{ marginTop: 10 }}>
                <button className="btn btn-crisis btn-tiny" onClick={() => onOpenTool && onOpenTool('danger')}>Open safety flow</button>
                <a className="btn btn-soft btn-tiny" href="sms:">Text someone</a>
              </div>
            )}
          </div>
        )}
        {safetyAfterSave && (
          <div className="card-sunk" style={{ background: 'var(--rose-wash)', marginTop: 14 }}>
            <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Saved. Safety still comes first.</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{window.AMANAT_SAFETY?.reply(safetyAfterSave)}</p>
            <button className="btn btn-crisis btn-tiny" style={{ marginTop: 10 }} onClick={() => onOpenTool && onOpenTool('danger')}>Open safety flow</button>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 8 }}>
          <span className="ui-sans" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            <window.Icon name="lock" size={12} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
            {persistLocal ? 'Stays on this device.' : 'Disappears when you close this tab.'}
          </span>
          <div className="cluster">
            <button className="btn btn-ghost btn-tiny" onClick={() => { if (confirm('Clear this draft?')) { setDraft(''); setPromptKey(null); } }}>Clear</button>
            <button className="btn btn-forest btn-tiny" onClick={save} disabled={!draft.trim()}>Save entry</button>
          </div>
        </div>
      </div>

      <div className="reveal" style={{ marginTop: 28 }}>
        <div className="section-header">
          <h2 className="section-title">Saved entries</h2>
          {store.state.journalEntries.length > 3 && <button className="btn btn-ghost btn-tiny" onClick={() => setOpen(o => !o)}>{open ? 'Collapse' : 'Expand'}</button>}
        </div>
        {store.state.journalEntries.length === 0 && (
          <div className="card-sunk" style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>
            Nothing saved yet. Saved entries stay private to {persistLocal ? 'this device' : 'this session'}.
          </div>
        )}
        <div className="stack">
          {(open ? store.state.journalEntries : store.state.journalEntries.slice(0, 2)).map(j => (
            <div key={j.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                <span className="eyebrow">{new Date(j.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <button className="btn btn-ghost btn-tiny" onClick={() => { if (confirm('Delete this entry?')) store.removeJournal(j.id); }}>Delete</button>
              </div>
              <p style={{ marginTop: 10, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)' }}>{j.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HELP screen — partner guide, scripts, crisis steps, resources
// ────────────────────────────────────────────────────────────────────────────
function HelpScreen({ t, store, sub }) {
  const [tab, setTab] = useStateS(sub || 'resources');
  useEffectS(() => { if (sub) setTab(sub); }, [sub]);

  const tabs = [
    { id: 'resources', label: 'Pakistan resources' },
    { id: 'safety',    label: 'Safety & privacy' },
    { id: 'minors',    label: 'Minors' },
    { id: 'csa',       label: 'CSA support' },
    { id: 'dv',        label: 'Quiet safety plan' },
    { id: 'medical',   label: 'Medical red flags' },
    { id: 'readiness', label: 'Prototype limits' },
    { id: 'partners',  label: 'For partners' },
    { id: 'scripts',   label: 'Scripts' },
    { id: 'crisis',    label: 'Crisis steps' },
  ];

  return (
    <div className="page">
      <div className="reveal">
        <p className="eyebrow">Help</p>
        <h1 className="page-title">You don't have to carry this alone.</h1>
        <p className="page-lede">Real lines, real people, real practices. Seeking help is not weakness. It can be a courageous act.</p>
      </div>
      <div className="cluster" style={{ marginTop: 16, marginBottom: 22, gap: 6 }}>
        {tabs.map(x => <button key={x.id} className={"chip" + (tab === x.id ? ' chip-active' : '')} onClick={() => setTab(x.id)}>{x.label}</button>)}
      </div>

      {tab === 'resources' && <ResourcesPanel />}
      {tab === 'safety'    && <SafetyPrivacyPanel />}
      {tab === 'minors'    && <MinorsSafeguardingPanel />}
      {tab === 'csa'       && <CsaDisclosurePanel onOpenTool={() => {}} />}
      {tab === 'dv'        && <DomesticViolencePlanPanel onOpenTool={() => {}} />}
      {tab === 'medical'   && <MedicalRedFlagsPanel onOpenTool={() => {}} />}
      {tab === 'readiness' && <PrototypeReadinessHelpPanel />}
      {tab === 'partners'  && <PartnersPanel store={store} />}
      {tab === 'scripts'   && <ScriptsPanel store={store} />}
      {tab === 'crisis'    && <CrisisPanel />}
    </div>
  );
}

function PrototypeReadinessHelpPanel() {
  return (
    <div className="stack reveal">
      <ResearchReadinessPanel />
      <PublicPathwayPanel />
      <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>Suggested validation path</p>
        <div className="grid-2" style={{ marginTop: 12 }}>
          {[
            ['Expert safety review', 'Trauma clinician, safeguarding reviewer, Pakistan cultural reviewer, and lived-experience reviewer check red-risk flows first.'],
            ['Small usability pilot', 'Observe whether dysregulated users can reach one safe step in under 30 seconds without reading long text.'],
            ['Supported field pilot', 'Use only with trained facilitators, consent, referral pathways, adverse-event protocol, and stop criteria.'],
            ['Public release gate', 'Release only after privacy/security review, helpline re-verification, data-retention policy, and outcome claims are restrained.'],
          ].map(([title, body]) => (
            <div key={title} className="phrase-row safe" style={{ marginTop: 0 }}>
              <div className="phrase-label safe">{title}</div>
              <div className="phrase-text">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourcesPanel() {
  return (
    <div className="grid-2 reveal">
      {window.AMANAT_CONTENT.resources.map(r => (
        <div key={r.name} className="card">
          <span className={"chip chip-" + (r.tag === 'crisis' ? 'rose' : r.tag === 'therapy' ? 'forest' : 'amber')}>{r.tag === 'crisis' ? 'Crisis line' : r.tag === 'therapy' ? 'Therapy' : 'Community'}</span>
          <h3 className="display" style={{ fontSize: 20, marginTop: 10 }}>{r.name}</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{r.desc}</p>
          {r.verified && <p style={{ color: 'var(--ink-faint)', fontSize: 12, marginTop: 8 }}>{r.verified}</p>}
          <a className="btn btn-soft btn-tiny" style={{ marginTop: 14 }} href={r.href} target="_blank" rel="noopener noreferrer">
            <window.Icon name={r.kind === 'tel' ? 'phone' : 'arrowRight'} size={14} /> {r.contact}
          </a>
        </div>
      ))}
    </div>
  );
}

function SafetyPrivacyPanel() {
  const items = [
    {
      title: 'What local deletion does',
      body: 'Erase everything removes mood logs, journal entries, saved scripts, reframes, and local chat history from this browser storage. It cannot erase text already sent to an AI/model service for processing.',
    },
    {
      title: 'Before Companion/Reframe',
      body: 'Companion and Reframe are AI-assisted. They may be wrong, incomplete, or too generic. They are not a therapist, lawyer, doctor, crisis service, or child-protection service.',
    },
    {
      title: 'Shared-device safety',
      body: 'Use Quick exit to immediately wipe local app data and replace the page with a neutral Notes screen. Use Disguise as Notes in settings when a shared family phone makes the app name unsafe.',
    },
    {
      title: 'Safeguarding for minors',
      body: 'If you are under 18 and are being hurt, exploited, sexually abused, forced, threatened, or unsafe at home, this app is not enough. Contact a trusted adult, child protection organization, emergency services, or a trauma-informed professional as soon as it is safe.',
    },
  ];
  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'var(--rose-wash)' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Important limits</p>
        <h2 className="display" style={{ fontSize: 26, marginTop: 6 }}>Privacy and safety have edges. The app should say where they are.</h2>
      </div>
      <div className="grid-2">
        {items.map(item => (
          <div key={item.title} className="card">
            <h3 className="display" style={{ fontSize: 21 }}>{item.title}</h3>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MinorsSafeguardingPanel() {
  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-bright))' }}>
        <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Safeguarding for minors</p>
        <h2 className="display" style={{ fontSize: 28, marginTop: 6 }}>If you are under 18 and being hurt, this app is not enough.</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>You deserve real-world protection. Try to involve a safe adult or protection service as soon as it is safe.</p>
      </div>
      <div className="grid-2">
        {[
          ['Tell a safe adult', 'A teacher, school counsellor, doctor, trusted relative, neighbour, older sibling, or family friend who does not protect the unsafe person.'],
          ['Do not confront alone', 'If the unsafe person has power over your home, money, transport, phone, school, or reputation, do not confront them without support.'],
          ['If sexual abuse is happening', 'You are not to blame. You do not have to describe everything in detail. Say: “I am being hurt and I need help.”'],
          ['If home is unsafe', 'Think of the nearest safer adult, clinic, school, neighbour, or emergency number. Keep the screen neutral if someone checks your phone.'],
        ].map(([title, body]) => (
          <div key={title} className="card">
            <p className="eyebrow" style={{ color: 'var(--forest)' }}>{title}</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{body}</p>
          </div>
        ))}
      </div>
      <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
        <p className="eyebrow" style={{ color: 'var(--forest)' }}>One sentence to use</p>
        <p className="display-italic" style={{ fontSize: 22, marginTop: 6 }}>“I am not safe with someone at home. I need you to help me get safe.”</p>
      </div>
    </div>
  );
}

function PartnersPanel({ store }) {
  return (
    <div className="stack reveal">
      <div className="card-tactile" style={{ background: 'linear-gradient(135deg, var(--rose-wash), var(--paper-raised))' }}>
        <p className="eyebrow" style={{ color: 'var(--rose)' }}>For everyone who loves a survivor</p>
        <h2 className="display" style={{ fontSize: 28, marginTop: 6 }}>You did not cause this. You cannot fix this. But your consistency, over time, becomes the evidence.</h2>
      </div>
      <div className="grid-2">
        <div className="card">
          <h3 className="display" style={{ fontSize: 22 }}>What a survivor may be experiencing</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Bullet color="var(--rose)" title="Hypervigilance">
              The nervous system may have been shaped by an unsafe, unpredictable, or emotionally costly home. It may read your delayed text, a neutral tone, or a closed door as the beginning of something ending.
            </Bullet>
            <Bullet color="var(--amber)" title="“I'm fine”">
              When they say they are fine and they are not, it may be an old survival rule: do not need things, do not burden people, do not be a problem.
            </Bullet>
            <Bullet color="var(--forest)" title="Body symptoms">
              Anxiety can live in the chest, stomach, jaw, shoulders. Physical symptoms may be the body speaking what still feels unsafe to say out loud.
            </Bullet>
            <Bullet color="var(--ink-soft)" title="Self-diminishment">
              "It's probably stupid but..." before every important share. They may offer smallness before anyone can take it from them. It is armor, not modesty.
            </Bullet>
          </ul>
        </div>
        <div className="card">
          <h3 className="display" style={{ fontSize: 22 }}>What a partner can do</h3>
          <div className="grid-2" style={{ gridTemplateColumns: '1fr', gap: 12, marginTop: 14 }}>
            <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
              <p className="eyebrow" style={{ color: 'var(--forest)' }}>Do</p>
              <ul style={{ paddingLeft: 18, margin: '8px 0 0', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {window.AMANAT_CONTENT.partnerDos.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
            <div className="card-sunk" style={{ background: 'var(--rose-wash)' }}>
              <p className="eyebrow" style={{ color: 'var(--rose)' }}>Do not</p>
              <ul style={{ paddingLeft: 18, margin: '8px 0 0', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {window.AMANAT_CONTENT.partnerDonts.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bullet({ color, title, children }) {
  return (
    <li style={{ display: 'flex', gap: 10 }}>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: color, flexShrink: 0, marginTop: 9 }} />
      <div>
        <div className="ui-sans" style={{ fontWeight: 600 }}>{title}</div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 2 }}>{children}</p>
      </div>
    </li>
  );
}

function ScriptsPanel({ store }) {
  const saved = new Set(store.state.savedScripts);
  const onCopy = async (script) => {
    const ok = await window.copyToClipboard(script.text);
    if (ok) {
      const evt = new CustomEvent('amanat:toast', { detail: 'Copied. Paste anywhere.' });
      window.dispatchEvent(evt);
    }
  };
  return (
    <div className="stack reveal">
      <p style={{ color: 'var(--ink-soft)', maxWidth: '60ch' }}>
        Save the ones you want to keep within reach. Copy any to paste into a text, an email, a note for yourself.
      </p>
      <div className="grid-2">
        {window.AMANAT_CONTENT.partnerScripts.map(s => (
          <div key={s.id} className="phrase-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <h3 className="display" style={{ fontSize: 18 }}>{s.heading}</h3>
              <button className="icon-btn" onClick={() => store.toggleSavedScript(s.id)} aria-label={saved.has(s.id) ? 'Unsave' : 'Save'} title={saved.has(s.id) ? 'Unsave' : 'Save'}>
                <window.Icon name="bookmark" size={18} style={{ fill: saved.has(s.id) ? 'var(--forest)' : 'none', stroke: saved.has(s.id) ? 'var(--forest)' : 'currentColor' }} />
              </button>
            </div>
            <p className="display-italic" style={{ fontSize: 18, marginTop: 10, color: 'var(--ink)' }}>"{s.text}"</p>
            <div className="cluster" style={{ marginTop: 14 }}>
              <button className="btn btn-ghost btn-tiny" onClick={() => onCopy(s)}>
                <window.Icon name="copy" size={14} /> {window.useI18n('en')('common.copy')}
              </button>
              {saved.has(s.id) && <span className="chip chip-forest"><window.Icon name="check" size={12} /> Saved</span>}
            </div>
          </div>
        ))}
      </div>

      {saved.size > 0 && (
        <div className="card" style={{ marginTop: 18, background: 'var(--forest-wash)' }}>
          <p className="eyebrow" style={{ color: 'var(--forest)' }}>Your saved scripts ({saved.size})</p>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6 }}>
            These stay in your personal vault on this device.
          </p>
        </div>
      )}
    </div>
  );
}

function CrisisPanel() {
  return (
    <div className="stack reveal">
      <p style={{ color: 'var(--ink-soft)', maxWidth: '60ch' }}>
        Stay calm. Reduce demand. Prioritise immediate safety over perfect words.
      </p>
      <div className="grid-2">
        {window.AMANAT_CONTENT.crisisSteps.map(c => (
          <div key={c.id} className="card">
            <h3 className="display" style={{ fontSize: 22 }}>{c.topic}</h3>
            <ol style={{ paddingLeft: 22, margin: '12px 0 0', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {c.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// COMPANION screen
// ────────────────────────────────────────────────────────────────────────────
function CompanionScreen({ t, store }) {
  return (
    <div className="page page-narrow">
      <div className="reveal">
        <p className="eyebrow">Companion</p>
        <h1 className="page-title">A small lamp in a dark room.</h1>
        <p className="page-lede">
          A gentle listener you can talk to. Not a therapist, not a crisis service. High-risk phrases are screened locally first so the app can show safety steps immediately. If a response needs the model, your message may be sent to that service.
        </p>
      </div>
      <window.Companion thread={store.state.chatThread} onAddMsg={store.addChatMsg} onClear={store.clearChat} t={t} />
    </div>
  );
}

window.Screens = { HomeStandard, HomeHub, ToolsScreen, JournalScreen, HelpScreen, CompanionScreen, MoodPanel, AffirmPanel };
