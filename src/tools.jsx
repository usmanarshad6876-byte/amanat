// tools.jsx — Breathing, 5-4-3-2-1, Reframe, Check-in, Panic.
// Vite React module. Exposes window.Tools.{...}.

import React from 'react';

const { useState: useStateT, useEffect: useEffectT, useRef: useRefT, useMemo: useMemoT } = React;

// ────────────────────────────────────────────────────────────────────────────
// BoxBreathing
// ────────────────────────────────────────────────────────────────────────────
const PHASES = [
  { text: 'Breathe in',  cls: 'expand' },
  { text: 'Hold',        cls: 'hold-in' },
  { text: 'Breathe out', cls: 'shrink' },
  { text: 'Hold',        cls: 'hold-out' },
];

function BoxBreathing({ onClose }) {
  const [round, setRound] = useStateT(1);
  const [phase, setPhase] = useStateT(0);
  const [total] = useStateT(4);
  const [paused, setPaused] = useStateT(false);

  useEffectT(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setPhase(p => {
        const next = (p + 1) % PHASES.length;
        if (next === 0) {
          setRound(r => {
            if (r >= total) {
              setTimeout(() => onClose && onClose('done'), 200);
              return r;
            }
            return r + 1;
          });
        }
        return next;
      });
    }, 4000);
    return () => clearTimeout(id);
  }, [phase, paused, total, onClose]);

  const p = PHASES[phase];
  return (
    <div className="breathe-overlay" role="dialog" aria-label="Box breathing">
      <button className="icon-btn" style={{ position: 'absolute', top: 18, right: 18 }} onClick={() => onClose && onClose('cancelled')} aria-label="Close">
        <window.Icon name="close" />
      </button>
      <div className="breathe-ring-outer">
        <div className="breathe-halo" />
        <div className="breathe-halo" />
        <div className="breathe-halo" />
        <div className={"breathe-ring " + p.cls} />
      </div>
      <div className="breathe-instruction">{p.text}</div>
      <div className="breathe-counter">Round {round} of {total} · 4-4-4-4</div>
      <p style={{ maxWidth: 320, textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14 }}>
        If holding your breath feels scary, skip the hold and look for three ordinary objects in the room.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-ghost" onClick={() => setPaused(x => !x)}>
          <window.Icon name={paused ? 'play' : 'pause'} size={16} /> {paused ? 'Resume' : 'Pause'}
        </button>
        <button className="btn btn-soft" onClick={() => onClose && onClose('cancelled')}>End</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Grounding 5-4-3-2-1
// ────────────────────────────────────────────────────────────────────────────
const GROUNDING_STEPS = [
  { n: 5, label: 'See',    prompt: 'Five things you can actually see in this room.', placeholder: 'A window, a cup, the ceiling fan...' },
  { n: 4, label: 'Touch',  prompt: 'Four things you can feel against your body.',    placeholder: 'The chair beneath me, the phone in my hand...' },
  { n: 3, label: 'Hear',   prompt: 'Three sounds in the actual room. Not in your head.', placeholder: 'A fan, traffic outside, my own breathing...' },
  { n: 2, label: 'Smell',  prompt: 'Two smells, even subtle.',                       placeholder: 'The smell of my tea, clean air...' },
  { n: 1, label: 'Taste',  prompt: 'One thing you can taste, even just your own mouth.', placeholder: 'The last thing I ate, the air on my tongue...' },
];

function Grounding({ onClose }) {
  const [idx, setIdx] = useStateT(0);
  const [vals, setVals] = useStateT(() => GROUNDING_STEPS.map(() => ''));
  const [done, setDone] = useStateT(false);

  const next = () => {
    if (idx < GROUNDING_STEPS.length - 1) setIdx(i => i + 1);
    else setDone(true);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-label="5-4-3-2-1 grounding">
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="eyebrow">Grounding</div>
            <h2 className="modal-title">5-4-3-2-1</h2>
          </div>
          <button className="icon-btn" onClick={() => onClose && onClose()} aria-label="Close"><window.Icon name="close" /></button>
        </div>
        <div className="modal-body">
          {!done && (
            <div>
              {idx === 0 && (
                <div className="card-sunk" style={{ marginBottom: 16, background: 'var(--forest-wash)' }}>
                  <p className="eyebrow" style={{ color: 'var(--forest)' }}>First orient</p>
                  <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
                    Today is {new Date().toLocaleDateString()}. Name the room you are in, then one object that belongs to today.
                  </p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
                {GROUNDING_STEPS.map((s, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 4,
                    background: i <= idx ? 'var(--forest)' : 'var(--ink-ghost)',
                    transition: 'background var(--motion)'
                  }} />
                ))}
              </div>
              <div className="display" style={{ fontSize: 56, lineHeight: 1, color: 'var(--forest)' }}>{GROUNDING_STEPS[idx].n}</div>
              <div className="ui-sans" style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', marginTop: 6, color: 'var(--ink-soft)' }}>
                Things you can {GROUNDING_STEPS[idx].label.toUpperCase()}
              </div>
              <p style={{ marginTop: 10, color: 'var(--ink-soft)' }}>{GROUNDING_STEPS[idx].prompt}</p>
              <textarea
                className="textarea"
                style={{ marginTop: 14, minHeight: 90 }}
                placeholder={GROUNDING_STEPS[idx].placeholder}
                value={vals[idx]}
                onChange={e => setVals(v => v.map((x, i) => i === idx ? e.target.value : x))}
                autoFocus
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
                <button className="btn btn-ghost btn-tiny" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>
                  <window.Icon name="chevronLeft" size={16} /> Back
                </button>
                <button className="btn btn-forest" onClick={next}>
                  {idx === GROUNDING_STEPS.length - 1 ? 'Finish' : 'Next'} <window.Icon name="chevronRight" size={16} />
                </button>
              </div>
            </div>
          )}
          {done && (
            <div style={{ textAlign: 'center', padding: '18px 0' }}>
              <div style={{ color: 'var(--forest)', display: 'inline-flex' }}>
                <window.Icon name="leaf" size={56} stroke={1.2} />
              </div>
              <h3 className="display-italic" style={{ fontSize: 28, marginTop: 14 }}>You are here. Check the room.</h3>
              <p style={{ color: 'var(--ink-soft)', margin: '10px auto 22px', maxWidth: '36ch' }}>
                You named twenty things in the present. If danger is still nearby, choose the next safest human or place.
              </p>
              <button className="btn btn-primary" onClick={() => onClose && onClose()}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PublicGrounding({ onClose }) {
  const steps = [
    'Put both feet on the floor. Press your toes down inside your shoes.',
    'Name today\u2019s date silently. Then name the room: office, classroom, shop, car, home.',
    'Find three straight lines near you: a door frame, table edge, window, notebook.',
    'Relax your jaw once. Let your shoulders drop one centimetre.',
    'Choose one next action: sip water, text one person, step outside, or return to the task.',
  ];

  return (
    <div className="modal-overlay" role="dialog" aria-label="30-second grounding">
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">Discreet grounding</div>
            <h2 className="modal-title">No one has to know.</h2>
          </div>
          <button className="icon-btn" onClick={() => onClose && onClose()} aria-label="Close"><window.Icon name="close" /></button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--ink-soft)' }}>
            For work, class, shared family spaces, or anywhere you need discreet support.
          </p>
          <ol style={{ paddingLeft: 22, margin: '18px 0 0', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <div className="cluster" style={{ marginTop: 22 }}>
            <a className="btn btn-soft" href="sms:"><window.Icon name="send" size={16} /> Text someone</a>
            <button className="btn btn-forest" onClick={() => onClose && onClose()}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Reframe — Claude-powered "trauma says" → "safety says"
// ────────────────────────────────────────────────────────────────────────────
const REFRAME_PROMPT = (input) => `You are a trauma-informed reframing tool inside a private mental health app for survivors of childhood emotional abuse and neglect in Pakistan.

The user has written a "trauma says" sentence — a harsh, catastrophic, or self-shaming thought. Your job is to offer a "safety says" alternative.

Rules — follow strictly:
- Do not invalidate the original feeling. Acknowledge that the feeling is real.
- Do not say "just think positive" or anything saccharine.
- Use language that is gentle, present-tense, specific. Avoid clichés.
- Do not advise, diagnose, or prescribe.
- Output ONLY the safety-says sentence(s). One to three sentences. No preamble, no quotes.
- Sound like an emotionally-regulated friend who has done their own work.

The trauma-says sentence:
"""${input}"""

Write the safety-says sentence(s):`;

function needsSafetyRedirect(input) {
  const kind = window.AMANAT_SAFETY?.detect(input);
  return window.AMANAT_SAFETY?.isUrgent(kind);
}

function localReframe(input) {
  const text = input.trim().toLowerCase();
  if (/\b(weak|foolish|responsible|fault|blame|my fault)\b/.test(text)) {
    return 'What happened was not proof that I was weak, foolish, or responsible. My body may carry blame because blame once felt like control, but the responsibility belongs with the harm, not with me.';
  }
  if (/\b(too much|burden|problem|dramatic|overreacting)\b/.test(text)) {
    return 'My feelings are not too much; they are signals from a body that learned to survive. I can have needs without becoming a burden.';
  }
  if (/\b(broken|ruined|damaged|normal people)\b/.test(text)) {
    return 'I am not broken for having a nervous system that adapted to pain. Healing can be slow and still be real.';
  }
  if (/\b(no one|nobody|alone|left|abandoned)\b/.test(text)) {
    return 'This loneliness is real, and it does not mean I am impossible to stay with. I can look for one safe connection without forcing myself to explain everything.';
  }
  if (/\b(family|honour|honor|shame|izzat|log kya kahenge)\b/.test(text)) {
    return 'Family pressure can feel enormous, but my safety and dignity still matter. Naming harm is not the same as creating it.';
  }
  if (/\b(allah|god|punish|punishing|faith|sabr)\b/.test(text)) {
    return 'Struggling is not proof that I am being punished or that my faith is weak. Seeking safety and support can be part of caring for the life entrusted to me.';
  }
  return 'This thought may be trying to protect me by explaining pain, but it is not the whole truth. I can slow down, notice what happened, and speak to myself without turning the harm into a verdict about who I am.';
}

async function completeReframe(input) {
  if (!window.claude?.complete) return localReframe(input);
  try {
    const res = await window.claude.complete({
      system: REFRAME_PROMPT(input),
      messages: [{ role: 'user', content: input }],
    });
    return (res || '').trim().replace(/^["']|["']$/g, '') || localReframe(input);
  } catch (e) {
    return localReframe(input);
  }
}

function Reframe({ onSave, lastReframes = [] }) {
  const [input, setInput] = useStateT('');
  const [output, setOutput] = useStateT('');
  const [loading, setLoading] = useStateT(false);
  const [err, setErr] = useStateT('');

  const run = async () => {
    if (!input.trim() || loading) return;
    if (needsSafetyRedirect(input)) {
      const kind = window.AMANAT_SAFETY?.detect(input);
      setOutput('');
      setErr(window.AMANAT_SAFETY?.reply(kind) || 'This sounds urgent enough for human support, not a reframe. Contact one real person now or use emergency support.');
      return;
    }
    setLoading(true); setErr(''); setOutput('');
    try {
      const cleaned = await completeReframe(input.trim());
      setOutput(cleaned);
      onSave && onSave(input.trim(), cleaned);
    } catch (e) {
      setErr('I couldn\u2019t reframe that just now. Try again, or take a slower breath and come back in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack">
      <div className="card-tactile">
        <div className="eyebrow" style={{ color: 'var(--rose)' }}>What the old alarm says</div>
        <textarea
          className="textarea"
          style={{ background: 'var(--rose-wash)', borderColor: 'rgba(168, 83, 100, 0.25)', minHeight: 90, marginTop: 8 }}
          placeholder="Type the thought that won&rsquo;t leave you alone. e.g. &lsquo;Nobody really cares.&rsquo;"
          value={input}
          onChange={e => setInput(e.target.value)}
          maxLength={500}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <span className="ui-sans" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            {input.length}/500 · uses a model if available; otherwise reframes locally
          </span>
          <button className="btn btn-forest" onClick={run} disabled={!input.trim() || loading}>
            {loading ? 'Listening...' : 'Reframe gently'} <window.Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
      {(output || err) && (
        <div className="card-tactile reveal" style={{ background: 'linear-gradient(135deg, var(--forest-wash), var(--paper-raised))' }}>
          <div className="eyebrow" style={{ color: 'var(--forest)' }}>What steadiness can also say</div>
          {output && <p className="display-italic" style={{ fontSize: 22, lineHeight: 1.4, marginTop: 10 }}>{output}</p>}
          {err && <p style={{ marginTop: 8, color: 'var(--rose)' }}>{err}</p>}
          <div className="cluster" style={{ marginTop: 14 }}>
            <button className="btn btn-ghost btn-tiny" onClick={() => { setInput(''); setOutput(''); }}>Try another</button>
            <button className="btn btn-ghost btn-tiny" onClick={async () => {
              const txt = `Old alarm says: ${input}\nSteadiness says: ${output}`;
              const ok = await window.copyToClipboard(txt);
              if (ok) alert('Copied to clipboard.');
            }}><window.Icon name="copy" size={14} /> Copy both</button>
          </div>
        </div>
      )}
      {lastReframes.length > 0 && (
        <div className="card">
          <div className="eyebrow" style={{ marginBottom: 10 }}>Earlier this session</div>
          <div className="stack" style={{ gap: 10 }}>
            {lastReframes.slice(0, 4).map((r, i) => (
              <div key={i} style={{ borderTop: i ? '1px dashed var(--ink-line)' : 0, paddingTop: i ? 10 : 0 }}>
                <p style={{ color: 'var(--rose)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16 }}>"{r.in}"</p>
                <p style={{ color: 'var(--forest)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, marginTop: 4 }}>"{r.out}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Guided check-in (mood → body → what's up → suggested tool)
// ────────────────────────────────────────────────────────────────────────────
function CheckIn({ onClose, onLogMood, onNavigate }) {
  const [step, setStep] = useStateT(0);
  const [mood, setMood] = useStateT(null);
  const [bodyParts, setBodyParts] = useStateT([]);
  const [whatsUp, setWhatsUp] = useStateT(null);
  const [note, setNote] = useStateT('');

  const suggest = useMemoT(() => {
    if (!mood) return null;
    if (mood.key === 'low' || mood.key === 'flat') return { id: 'companion', title: 'Talk it through with Companion', detail: 'No advice. Just presence.' };
    if (bodyParts.includes('chest') || bodyParts.includes('throat')) return { id: 'breathing', title: 'Try box breathing', detail: 'Slows the chest. 4-4-4-4 for four rounds.' };
    if (bodyParts.includes('head') || whatsUp === 'flashback') return { id: 'grounding', title: 'Run 5-4-3-2-1', detail: 'Bring the senses back into the actual room.' };
    if (whatsUp === 'someone-said' || whatsUp === 'argument') return { id: 'reframe', title: 'Reframe the sentence', detail: 'Try writing what stuck. Safety can also answer.' };
    return { id: 'journal', title: 'Open the journal', detail: 'Some things just need a private page first.' };
  }, [mood, bodyParts, whatsUp]);

  const totalSteps = 4;
  const STEP_TITLES = ['How are you arriving?', 'Where in the body?', 'What\u2019s up, if anything?', 'A suggestion'];

  return (
    <div className="modal-overlay" role="dialog" aria-label="Check-in">
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow">Check-in</div>
            <h2 className="modal-title">{STEP_TITLES[step]}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><window.Icon name="close" /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= step ? 'var(--forest)' : 'var(--ink-ghost)' }} />
            ))}
          </div>

          {step === 0 && (
            <div className="stack">
              <p style={{ color: 'var(--ink-soft)' }}>There is no right answer. Pick the one closest to true.</p>
              <div className="cluster" style={{ gap: 10, marginTop: 8 }}>
                {window.AMANAT_CONTENT.moodVocab.map(m => (
                  <button key={m.key}
                    className={"mood-dot" + (mood && mood.key === m.key ? ' selected' : '')}
                    style={{ background: m.wash, width: 60, height: 60, fontSize: 22 }}
                    onClick={() => setMood(m)}
                    aria-label={m.label}
                    title={m.label}
                  >{m.glyph}</button>
                ))}
              </div>
              {mood && (
                <p className="display-italic reveal" style={{ fontSize: 20, color: 'var(--forest)', marginTop: 10 }}>
                  {mood.label}. {window.AMANAT_CONTENT.moodMessages[mood.key]}
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="stack">
              <p style={{ color: 'var(--ink-soft)' }}>Anywhere in your body that wants noticing. Pick any.</p>
              <div className="cluster" style={{ marginTop: 4 }}>
                {window.AMANAT_CONTENT.bodyParts.map(b => (
                  <button key={b.id}
                    className={"chip" + (bodyParts.includes(b.id) ? ' chip-active' : '')}
                    onClick={() => setBodyParts(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])}
                  >{b.label}</button>
                ))}
              </div>
              <p style={{ color: 'var(--ink-faint)', fontSize: 13, marginTop: 10 }}>You can also skip.</p>
            </div>
          )}

          {step === 2 && (
            <div className="stack">
              <p style={{ color: 'var(--ink-soft)' }}>If something pulled you here, name it. You can also leave it.</p>
              <div className="cluster" style={{ marginTop: 4 }}>
                {window.AMANAT_CONTENT.whatsUp.map(w => (
                  <button key={w.id}
                    className={"chip" + (whatsUp === w.id ? ' chip-active' : '')}
                    onClick={() => setWhatsUp(w.id === whatsUp ? null : w.id)}
                  >{w.label}</button>
                ))}
              </div>
              <textarea className="textarea" placeholder="A sentence is plenty. Or skip." value={note} onChange={e => setNote(e.target.value)} style={{ marginTop: 10, minHeight: 80 }} />
            </div>
          )}

          {step === 3 && suggest && (
            <div className="stack">
              <div className="card-sunk" style={{ background: 'var(--forest-wash)' }}>
                <div className="eyebrow" style={{ color: 'var(--forest)' }}>Maybe try</div>
                <h3 className="display" style={{ fontSize: 24, marginTop: 6 }}>{suggest.title}</h3>
                <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>{suggest.detail}</p>
              </div>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
                If none of these feel right, that is also fine. You showed up. That is the practice.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-forest" onClick={() => { onNavigate(suggest.id); onClose(); }}>Open <window.Icon name="arrowRight" size={16} /></button>
                <button className="btn btn-ghost" onClick={onClose}>Not now</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26 }}>
            <button className="btn btn-ghost btn-tiny" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
              <window.Icon name="chevronLeft" size={16} /> Back
            </button>
            {step < 3 && (
              <button className="btn btn-primary" onClick={() => {
                if (step === 0 && !mood) return;
                if (step === 0) onLogMood && onLogMood(mood);
                setStep(s => s + 1);
              }} disabled={step === 0 && !mood}>
                Next <window.Icon name="chevronRight" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DangerNow — physical safety before emotional grounding.
// ────────────────────────────────────────────────────────────────────────────
function DangerNow({ onClose, onOpenPublic, onOpenCompanion }) {
  const [showOffline, setShowOffline] = useStateT(false);
  const trustedMessage = 'I am not safe. I cannot explain right now. Please call me or help me reach a safer place.';
  const copyTrustedMessage = async () => {
    const ok = await window.copyToClipboard(trustedMessage);
    if (ok) window.dispatchEvent(new CustomEvent('amanat:toast', { detail: 'Safety message copied.' }));
  };

  return (
    <div className="modal-overlay" role="dialog" aria-label="I am not safe">
      <div className="modal" style={{ maxWidth: 560, background: 'var(--paper-bright)' }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow" style={{ color: 'var(--crisis)' }}>Right now</div>
            <h2 className="modal-title">I am not safe.</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><window.Icon name="close" /></button>
        </div>
        <div className="modal-body">
          <div className="card-sunk" style={{ background: 'var(--rose-wash)', marginBottom: 14 }}>
            <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Safety first</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
              This is for physical danger, coercion, severe dissociation, or risk of self-harm. Do not use calming tools instead of getting away, calling someone, or reaching emergency help.
            </p>
          </div>
          <ol style={{ paddingLeft: 22, margin: '0 0 16px', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Move toward people, light, an exit, a lock, or a public place if you can.</li>
            <li>Keep your phone with you. Avoid arguing through a door or in a closed room.</li>
            <li>If you may hurt yourself, move away from blades, pills, cords, weapons, or heights.</li>
            <li>Call one real person now. Stay connected until the danger has passed.</li>
          </ol>
          <div className="stack">
            <a className="btn btn-crisis btn-large btn-block" href="tel:03117786264">
              <window.Icon name="phone" size={18} /> Call Umang · 0311-7786264
            </a>
            <a className="btn btn-soft btn-block" href="tel:03041111741">
              <window.Icon name="phone" size={16} /> Call Rozan · 0304-111-1741
            </a>
            <a className="btn btn-soft btn-block" href="tel:1122">
              <window.Icon name="phone" size={16} /> Emergency · 1122
            </a>
            <a className="btn btn-soft btn-block" href="tel:15">
              <window.Icon name="phone" size={16} /> Police · 15
            </a>
            <a className="btn btn-soft btn-block" href="tel:115">
              <window.Icon name="phone" size={16} /> Edhi · 115
            </a>
            <button className="btn btn-ghost btn-block" onClick={() => setShowOffline(true)}>
              I still can't reach anyone
            </button>
          </div>
          {showOffline && (
            <div className="card-sunk" style={{ background: 'var(--paper-bright)', marginTop: 14 }}>
              <p className="eyebrow" style={{ color: 'var(--crisis)' }}>Offline safety card</p>
              <ol style={{ paddingLeft: 20, margin: '8px 0 0', color: 'var(--ink-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>Leave the room if you can. If leaving is not possible, lock the door or move closer to an exit, light, or another person.</li>
                <li>Name 5 things you can see. Keep your eyes moving around the room.</li>
                <li>Copy this message and text it to a trusted contact when you can.</li>
              </ol>
              <div className="phrase-card" style={{ marginTop: 12 }}>
                <div className="phrase-label safe">Message to copy</div>
                <div className="phrase-text">"{trustedMessage}"</div>
              </div>
              <div className="cluster" style={{ marginTop: 12 }}>
                <button className="btn btn-forest btn-tiny" onClick={copyTrustedMessage}>
                  <window.Icon name="copy" size={14} /> Copy message
                </button>
                <a className="btn btn-soft btn-tiny" href={`sms:?&body=${encodeURIComponent(trustedMessage)}`}>
                  <window.Icon name="send" size={14} /> Open text
                </a>
              </div>
            </div>
          )}
          <div className="divider-dotted" />
          <p className="eyebrow" style={{ marginBottom: 8 }}>If you need the screen to look neutral</p>
          <div className="stack">
            <button className="btn btn-ghost btn-block" onClick={onOpenPublic}><window.Icon name="shield" size={16} /> Open public-place mode</button>
            <button className="btn btn-ghost btn-block" onClick={onOpenCompanion}><window.Icon name="companion" size={16} /> Open companion after contacting a person</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Panic — emotional overwhelm, not active danger.
// ────────────────────────────────────────────────────────────────────────────
function Panic({ onClose, onOpenBreathing, onOpenGrounding, onOpenCompanion }) {
  return (
    <div className="modal-overlay" role="dialog" aria-label="Emotional grounding">
      <div className="modal" style={{ maxWidth: 520, background: 'var(--paper-bright)' }}>
        <div className="modal-head">
          <div>
            <div className="eyebrow" style={{ color: 'var(--forest)' }}>Emotional grounding</div>
            <h2 className="modal-title">The feeling is intense.</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><window.Icon name="close" /></button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--ink-soft)' }}>
            Use this only if you are not in immediate physical danger. If danger is present, choose the danger flow first.
          </p>
          <div className="divider-soft" />
          <div className="stack">
            <button className="btn btn-ghost btn-block" onClick={onOpenBreathing}><window.Icon name="breathing" size={16} /> Breathe if that feels okay</button>
            <button className="btn btn-ghost btn-block" onClick={onOpenGrounding}><window.Icon name="grounding" size={16} /> Run 5-4-3-2-1</button>
            <button className="btn btn-ghost btn-block" onClick={onOpenCompanion}><window.Icon name="companion" size={16} /> Talk to companion</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Tools = { BoxBreathing, Grounding, PublicGrounding, DangerNow, Reframe, CheckIn, Panic };
