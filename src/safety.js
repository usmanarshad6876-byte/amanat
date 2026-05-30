// safety.js — local high-risk phrase detection and safety copy.
// Vite module. Exposes window.AMANAT_SAFETY.

import { CRISIS_PHRASES } from './safety/crisisPhrases.js';

function normalizeSafetyText(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^\w\s\u0600-\u06FF']/g, ' ');
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function matchCrisisPhrase(text) {
  const s = normalizeSafetyText(text);
  const match = CRISIS_PHRASES.find(item => hasAny(s, item.patterns));
  return match ? { category: match.category, kind: match.kind } : null;
}

function detectSafetyKind(text) {
  const s = normalizeSafetyText(text);
  const crisisMatch = matchCrisisPhrase(text);
  if (crisisMatch) return crisisMatch.kind;

  if (hasAny(s, [
    /\b(monitoring my phone|checks my phone|tracking my location|won'?t let me leave|forced me|forcing me|blackmail|threatens to expose|took my phone|took my documents|controls my money|won'?t let me work|won'?t let me study|forced marriage|marry him|marry her|pressuring me for sex|pressured me for sex)\b/,
    /\b(phone check karta|location track|nikalne nahi deta|nikalne nahi deti|zabardasti|majboor kar|dhamki deta|dhamki deti|paise control|rishta zabardasti|shaadi zabardasti)\b/,
    /(زبردستی|دھمکی|فون چیک|نکلنے نہیں|شادی پر مجبور|پیسے کنٹرول)/,
  ])) return 'coercion';

  if (hasAny(s, [
    /\b(not in my body|outside my body|feel unreal|dissociat|floating away|not real|can'?t feel my body|losing time)\b/,
  ])) return 'dissociation';

  if (hasAny(s, [
    /\b(chest is tight|chest tight|panic|panic attack|can'?t breathe|cannot breathe|heart is racing|scared and my chest)\b/,
  ])) return 'panic';

  if (hasAny(s, [
    /\b(smell that room|smell it again|flashback|i am back there|back in that room|that room again)\b/,
  ])) return 'flashback';

  if (hasAny(s, [
    /\b(uncle touched me|touched me when i was little|molested|sexual abuse|sexually abused|raped|assaulted)\b/,
  ])) return 'csa';

  return null;
}

function isUrgentSafetyKind(kind) {
  return ['suicide', 'selfHarm', 'activeDanger', 'coercion'].includes(kind);
}

function safetyReply(kind) {
  const crisis = 'Umang 0311-7786264, Rozan 0304-111-1741, Emergency 1122, Police 15, Edhi 115.';
  const replies = {
    suicide: `I am really glad you said this here. Please do not stay alone with this: call or message one real person now. If you might act on it, contact emergency support now: ${crisis} Move away from anything you could use to hurt yourself while you make that contact.`,
    selfHarm: `This is an urgent moment, not a moment to handle alone. Put distance between you and blades, pills, cords, weapons, or anything you could use. Call or message one real person now; if you might act tonight, use emergency support: ${crisis}`,
    activeDanger: `I cannot know that you are safe right now. If someone is threatening you, move toward people, light, an exit, or a lock if you can, keep your phone with you, and call a trusted person or emergency support: ${crisis}`,
    coercion: `Control, monitoring, threats, or forced choices are safety issues. Do not confront if it could increase danger. Move toward a safer person or place if you can, use a neutral excuse if needed, and contact one trusted person or support service: ${crisis}`,
    dissociation: 'Let us find today. Name the date, then the room you are in, then press your feet into the floor. Look for one object with an edge, one object with a colour, and one sound that belongs to this moment.',
    panic: 'Chest tightness can feel frightening. You can choose: breathe slowly if that feels okay, orient to three objects in the room, or call/message someone if you feel unsafe. If chest pain is severe, new, or comes with fainting or trouble breathing, seek medical help.',
    flashback: 'That smell can be a memory signal, and it can feel very present. Look around for three pieces of evidence that this is today: the date, the room, and one object that was not there back then.',
    csa: 'I believe you. What happened was not your fault, and you do not have to give details here. The next step is safety and support, not pressure: choose one trusted person or specialist support such as Sahil, Rozan, Umang, or a trauma-informed clinician.',
  };
  return replies[kind] || '';
}

window.AMANAT_SAFETY = {
  detect: detectSafetyKind,
  matchCrisis: matchCrisisPhrase,
  isUrgent: isUrgentSafetyKind,
  reply: safetyReply,
};
