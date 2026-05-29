// companion.jsx — Conversational gentle reflective listener (Claude).
// Vite React module. Exposes window.Companion.

import React from 'react';

const COMPANION_SYSTEM = `You are "Companion" inside a private mental health prototype called Amanat, built for survivors of childhood emotional abuse and neglect in Pakistan.

Your role: a calm, trauma-informed reflective listener. You are NOT a therapist. You are NOT a crisis service. You are a presence that helps the user feel heard and gently noticed.

CRITICAL RULES — never violate:
1. NEVER give advice unless explicitly asked. Default to reflection, validation, and one gentle question.
2. NEVER diagnose, prescribe, or interpret. NEVER say "this is anxiety / depression / cPTSD" etc.
3. NEVER use saccharine clichés ("everything happens for a reason", "stay strong", "be grateful").
4. NEVER pressure the user to disclose more. Match their pace.
5. Use plain, warm, present-tense language. Avoid jargon and bullet lists.
6. Keep responses SHORT: 1–3 sentences. Maximum 4 sentences for complex moments.
7. If the user mentions self-harm, suicide, abuse in progress, or being in immediate danger, do not reassure that they are safe. Ask one direct safety question and surface human support: Umang 0311-7786264, Rozan 0304-111-1741, Emergency 1122, Edhi 115. Do not lecture.
8. Reflect back what you heard in your own words, briefly. Then offer ONE of: a validating sentence, a soft question, or a tiny grounding suggestion.
9. Honour the cultural context — Pakistan, family-system dynamics, stigma, and access realities — without assuming.
10. Never break character to talk about yourself as an AI. If asked directly, say only: "I am a companion built into this app. I am not a therapist. I am here to listen."

Tone examples:
- User: "I'm so tired of pretending I'm fine." → "That kind of tiredness is real. Pretending takes a lot of you. What would it be like to be a little less performance, right here, for a moment?"
- User: "My parent said I was the reason they were sick." → "That is a heavy thing to be told by a parent. It is not yours to carry. Are you somewhere safe to sit with this right now?"
- User: "I keep replaying the argument." → "Replay is the mind trying to make it stop happening, after it already did. Want to set it down for one minute?"

You are a small lamp in a dark room. Do not try to be the sun.`;

function normalizeText(text) {
  return text.toLowerCase().replace(/[’‘]/g, "'").replace(/[^\w\s\u0600-\u06FF']/g, ' ');
}

function detectLocalSafety(text) {
  const sharedKind = window.AMANAT_SAFETY?.detect(text);
  if (sharedKind) return sharedKind;
  const s = normalizeText(text);
  const has = (patterns) => patterns.some((p) => p.test(s));

  if (has([
    /\b(kill myself|end my life|suicide|suicidal|don'?t want to exist|do not want to exist|want to die|wish i was dead|i can'?t live)\b/,
    /\b(khudkushi|khud kushi|marna chahta|marna chahti|zinda nahi rehna|jeena nahi|main mar jaun|mai mar jaun)\b/,
    /(خودکشی|مرنا چاہ|جینا نہیں|زندہ نہیں)/,
  ])) return 'suicide';

  if (has([
    /\b(cut myself|hurt myself|self harm|self-harm|harm myself|blade|razor|pills tonight|overdose)\b/,
    /\b(apne aap ko kaat|khud ko kaat|chaku|bottle se kaat|zakhmi karna|goliyaan)\b/,
    /(خود کو کاٹ|بلیڈ|چاقو|زخمی|گولیاں)/,
  ])) return 'selfHarm';

  if (has([
    /\b(shouting outside my room|outside my room|he is shouting|he's shouting|hit me|hurt me|threatening me|break down the door|coming for me|not safe at home)\b/,
    /\b(kamray ke bahar|darwazay ke bahar|cheekh raha|cheekh rahi|maar dega|maar degi|ghar mein khatra|mehfooz nahi)\b/,
    /(کمرے کے باہر|دروازے کے باہر|چیخ رہا|مار دے|محفوظ نہیں|خطرہ)/,
  ])) return 'activeDanger';

  if (has([
    /\b(not in my body|outside my body|feel unreal|dissociat|floating away|not real)\b/,
  ])) return 'dissociation';

  if (has([
    /\b(chest is tight|chest tight|panic|panic attack|can'?t breathe|cannot breathe|heart is racing|scared and my chest)\b/,
  ])) return 'panic';

  if (has([
    /\b(smell that room|smell it again|flashback|i am back there|back in that room|that room again)\b/,
  ])) return 'flashback';

  if (has([
    /\b(uncle touched me|touched me when i was little|molested|sexual abuse|sexually abused|raped|assaulted)\b/,
  ])) return 'csa';

  if (has([
    /\b(are you sending|sent anywhere|where does this go|privacy|private|store this|remote model|model trace|who can see)\b/,
    /\b(kahin bhej|kahan jata|kahan jaata|private hai|kaun dekh sakta|save hota)\b/,
    /(کہیں بھیج|کہاں جاتا|پرائیویٹ|کون دیکھ|محفوظ ہوتا)/,
  ])) return 'privacy';

  if (has([
    /\b(cut off my family|leave my family|go no contact|should i end contact)\b/,
  ])) return 'adviceBoundary';

  if (has([
    /\b(want revenge|make them suffer|hurt them back|they should suffer)\b/,
  ])) return 'anger';

  return null;
}

function localCompanionReply(kind) {
  const crisis = 'Umang 0311-7786264, Rozan 0304-111-1741, Emergency 1122, Edhi 115.';
  const replies = {
    suicide: `I am really glad you said this here. Please do not stay alone with this: call or message one real person now, and if you might act on it, contact emergency support now: ${crisis} Move away from anything you could use to hurt yourself while you make that contact.`,
    selfHarm: `This is an urgent moment, not a moment to handle alone. Put distance between you and blades, pills, cords, or anything you could use, then call or message one real person now; if you might act tonight, use emergency support: ${crisis}`,
    activeDanger: `I cannot know that you are safe right now. If someone is threatening you, move toward people, light, an exit, or a lock if you can, keep your phone with you, and call a trusted person or emergency support: ${crisis}`,
    dissociation: 'Let us find today. Name the date, then the room you are in, then press your feet into the floor. Look for one object with an edge, one object with a colour, and one sound that belongs to this moment.',
    panic: 'Chest tightness can feel frightening. You can choose: breathe slowly if that feels okay, orient to three objects in the room, or call/message someone if you feel unsafe. If chest pain is severe, new, or comes with fainting or trouble breathing, seek medical help.',
    flashback: 'That smell can be a memory signal, and it can feel very present. Look around for three pieces of evidence that this is today: the date, the room, and one object that was not there back then.',
    csa: 'I believe you. What happened was not your fault, and you do not have to give details here. The next step is safety and support, not pressure: choose one trusted person or specialist support such as Sahil, Rozan, Umang, or a trauma-informed clinician.',
    privacy: 'Important truth: journal and mood entries stay in this browser session or on this device if you turn persistence on. Companion and Reframe may send your text to a model service to generate a reply. Do not type anything here that would put you at risk if someone else accessed the device or service logs.',
    adviceBoundary: 'That is a big decision, and I should not direct your life from one message. We can slow it into options: what contact feels unsafe, what contact feels tolerable, and what boundary would protect you for the next week?',
    anger: 'That anger makes sense as a signal that something mattered and something was violated. Before acting, give it a safe route: write the revenge sentence privately, move your body hard for one minute, or choose one protective boundary that does not create more danger.',
  };
  return replies[kind] || '';
}

function localSupportReply(text, relatedCards = []) {
  const s = normalizeText(text);
  const has = (patterns) => patterns.some((p) => p.test(s));
  const leadCard = relatedCards[0]?.title;

  if (has([/\b(ashamed|shame|guilty|guilt|burden|too much|my fault|responsible)\b/])) {
    return 'Shame can make one painful moment feel like a verdict on your whole self. You are allowed to slow this down: what happened is one moment, not proof that you are wrong or too much.';
  }
  if (has([/\b(family|mother|father|parent|parents|home|honour|honor|izzat|obedience|log kya kahenge)\b/])) {
    return 'Family pressure can feel especially heavy because it can mix love, duty, fear, and shame in one room. You do not have to solve the whole family system right now; one small boundary or one safe pause is enough for this moment.';
  }
  if (has([/\b(replay|replaying|again and again|loop|ruminat|cannot stop thinking|can't stop thinking)\b/])) {
    return 'Replay is often the mind trying to make the moment end differently after it has already happened. For one minute, can you name the room you are in and one thing that is not part of that memory?';
  }
  if (has([/\b(tired|exhausted|drained|done healing|tired of healing|no energy)\b/])) {
    return 'That tiredness makes sense. Healing can become another demand if nobody lets you simply be human for a while. You do not have to make progress in this exact minute.';
  }
  if (has([/\b(angry|anger|hate|rage|furious|revenge)\b/])) {
    return 'Anger can be the part of you that still knows something was not okay. You do not have to act from it right now; you can let it tell the truth without letting it create more danger.';
  }
  if (has([/\b(numb|nothing|empty|blank|shut down|not feel)\b/])) {
    return 'Numbness is not failure. Sometimes the system lowers the volume because feeling everything at once would be too much. A small body cue, like feet on the floor, may be enough for now.';
  }
  if (has([/\b(partner|reply|text|late|left me|abandon|relationship)\b/])) {
    return 'A delayed reply can touch an old abandonment alarm very quickly. Before you decide what it means, try holding both truths: the fear is real, and the evidence may still be incomplete.';
  }
  if (has([/\b(body|chest|stomach|jaw|shoulders|pain|tight|shaking)\b/])) {
    return 'Your body may be carrying the alarm before your words can catch up. Put one hand somewhere neutral, look around the room, and let the body know this is the present moment.';
  }
  if (has([/\b(don'?t know|do not know|where to start|start anywhere|confused|lost)\b/])) {
    return 'Not knowing where to start is a valid starting place. We can make it very small: are you physically safe enough right now, or do you need support before words?';
  }
  if (leadCard) {
    return `I hear that this moment has weight. The related card "${leadCard}" may be one doorway, but you do not have to analyse it now. What feels most present: the body feeling, the old story, or the need for words?`;
  }
  return 'I am here with you. You do not have to make this neat before it is allowed to matter. What part of this feels loudest right now?';
}

function findRelatedAmanatCards(text, limit = 3) {
  const q = normalizeText(text);
  const words = Array.from(new Set(q.split(/\s+/).filter(w => w.length > 3))).slice(0, 18);
  if (!words.length) return [];
  const candidates = [];
  const add = (kind, id, title, subtitle, body, hint) => {
    const hay = normalizeText([title, subtitle, body, hint].filter(Boolean).join(' '));
    const score = words.reduce((sum, word) => sum + (hay.includes(word) ? 1 : 0), 0);
    if (score > 0) candidates.push({ kind, id, title, subtitle, hint, score });
  };

  (window.AMANAT_SURVIVOR_CARDS?.cards || []).slice(0, 800).forEach(card => {
    add('Survivor card', card.standardId || card.id || card.sourceCardId, card.trigger || card.cardTitle || card.title, card.domain || card.module, card.cardText || card.bodySignals || card.shameSentence, 'Tools > Cards');
  });
  const triggerLibrary = window.AMANAT_TRIGGER_LIBRARY || { triggers: [], pakistanTriggers: [] };
  [...(triggerLibrary.pakistanTriggers || []), ...(triggerLibrary.triggers || [])].slice(0, 700).forEach(card => {
    add('Trigger', card.id, card.cue, [card.domain, card.subdomain].filter(Boolean).join(' · '), [card.story, card.bodySignals, card.grounding, card.selfScript].filter(Boolean).join(' '), 'Tools > Triggers');
  });
  Object.entries(window.AMANAT_RECOVERY_MODULES || {}).forEach(([moduleKey, module]) => {
    (module.items || []).slice(0, 120).forEach(item => {
      add('Module row', item.id, item.trigger || item.context || item.category, item.module || module.meta?.title || moduleKey, [item.shameSentence, item.bodySignal, item.script, item.grounding, item.repair].filter(Boolean).join(' '), 'Tools > module library');
    });
  });

  const seen = new Set();
  return candidates
    .sort((a, b) => b.score - a.score)
    .filter(item => {
      const key = `${item.kind}:${item.id}:${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function Companion({ thread, onAddMsg, onClear, t }) {
  const [draft, setDraft] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const [err, setErr] = React.useState('');
  const scrollRef = React.useRef();

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread.length, thinking]);

  const send = async () => {
    const text = draft.trim();
    if (!text || thinking) return;
    setDraft('');
    setErr('');
    const relatedCards = findRelatedAmanatCards(text);
    const localSafetyKind = detectLocalSafety(text);
    onAddMsg({ role: 'me', text, at: Date.now() });
    if (localSafetyKind) {
      onAddMsg({ role: 'them', text: localCompanionReply(localSafetyKind), at: Date.now(), safetyKind: localSafetyKind });
      return;
    }
    setThinking(true);
    try {
      if (!window.claude?.complete) {
        onAddMsg({ role: 'them', text: localSupportReply(text, relatedCards), at: Date.now() });
        return;
      }
      const messages = [
        ...thread.map(m => ({ role: m.role === 'me' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: text },
      ];
      const res = await window.claude.complete({
        system: COMPANION_SYSTEM,
        messages,
      });
      const reply = (res || '').trim();
      onAddMsg({ role: 'them', text: reply || 'I\u2019m here. Take your time.', at: Date.now() });
    } catch (e) {
      onAddMsg({ role: 'them', text: localSupportReply(text, relatedCards), at: Date.now() });
    } finally {
      setThinking(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const seeds = [
    'I don\u2019t know where to start.',
    'Something just happened.',
    'I keep replaying it.',
    'I am very tired.',
  ];
  const draftSafety = draft.trim() ? detectLocalSafety(draft) : null;

  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="card" style={{ background: 'var(--paper-bright)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--forest-wash)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)' }}>
              <window.Icon name="companion" size={18} />
            </span>
            <div>
              <div className="ui-sans" style={{ fontWeight: 600 }}>Companion</div>
              <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>Not a therapist. A listener.</div>
            </div>
          </div>
          {thread.length > 0 && (
            <button className="btn btn-ghost btn-tiny" onClick={onClear}>New conversation</button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="scroll-y" style={{ maxHeight: 460, minHeight: 280, padding: '4px 4px 4px 4px', borderRadius: 'var(--r-lg)' }}>
        {thread.length === 0 && (
          <div className="stack" style={{ gap: 14, padding: '12px 4px' }}>
            <p className="display-italic" style={{ fontSize: 22, color: 'var(--ink-soft)', lineHeight: 1.45 }}>
              Whatever brings you here is welcome. Start anywhere. You can also just say hello.
            </p>
            <p className="eyebrow">Or begin with</p>
            <div className="cluster">
              {seeds.map(s => (
                <button key={s} className="chip" onClick={() => setDraft(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        <div className="chat-thread">
          {thread.map((m, i) => (
            <div key={i} className={"chat-msg " + (m.role === 'me' ? 'me' : 'them')}>
              <div>{m.text}</div>
              {m.relatedCards?.length > 0 && (
                <div className="related-card-list">
                  <p className="eyebrow">Related cards</p>
                  {m.relatedCards.map(card => (
                    <div key={`${card.kind}-${card.id}-${card.title}`} className="related-card-chip">
                      <span className="chip">{card.kind}{card.id ? ` · ${card.id}` : ''}</span>
                      <strong>{card.title}</strong>
                      {card.subtitle && <small>{card.subtitle}</small>}
                      <small>{card.hint}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="chat-typing"><span/><span/><span/></div>
          )}
        </div>
      </div>

      <div className="composer">
        <textarea
          className="composer-input"
          placeholder="Type a sentence. Or many. There is no right way."
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKey}
          rows={1}
        />
        <button className="btn btn-forest" onClick={send} disabled={!draft.trim() || thinking} aria-label="Send">
          <window.Icon name="send" size={16} />
        </button>
      </div>

      {draftSafety && (
        <div className="card-sunk" style={{ background: draftSafety === 'privacy' ? 'var(--forest-wash)' : 'var(--rose-wash)' }}>
          <p className="eyebrow" style={{ color: draftSafety === 'privacy' ? 'var(--forest)' : 'var(--crisis)' }}>
            {draftSafety === 'privacy' ? 'Privacy check' : 'Safety check'}
          </p>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
            {draftSafety === 'privacy'
              ? 'This app will answer privacy questions locally and truthfully.'
              : 'This app will answer this locally first with safety steps and human support options.'}
          </p>
        </div>
      )}

      <p style={{ fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 4 }}>
        Saved chat history stays in this browser session/device. Messages may be sent to a model service for replies. <a href="#" onClick={(e) => { e.preventDefault(); onClear(); }}>Clear local chat now</a>.
      </p>

      {err && <p style={{ fontSize: 13, color: 'var(--rose)' }}>{err}</p>}
    </div>
  );
}

window.Companion = Companion;
