// Reviewable high-risk phrase list used before any model call.

export const CRISIS_PHRASES = [
  {
    category: 'suicidality',
    kind: 'suicide',
    patterns: [
      /\b(kill myself|end my life|suicide|suicidal|don'?t want to exist|do not want to exist|want to die|wish i was dead|i can'?t live|better off dead|no reason to live)\b/,
      /\b(khudkushi|khud kushi|marna chahta|marna chahti|zinda nahi rehna|jeena nahi|main mar jaun|mai mar jaun)\b/,
      /(خودکشی|مرنا چاہ|جینا نہیں|زندہ نہیں)/,
    ],
  },
  {
    category: 'self-harm',
    kind: 'selfHarm',
    patterns: [
      /\b(cut myself|hurt myself|self harm|self-harm|harm myself|blade|razor|pills tonight|overdose|burn myself|punish myself|make myself bleed)\b/,
      /\b(apne aap ko kaat|khud ko kaat|chaku|bottle se kaat|zakhmi karna|goliyaan)\b/,
      /(خود کو کاٹ|بلیڈ|چاقو|زخمی|گولیاں)/,
    ],
  },
  {
    category: 'active-danger',
    kind: 'activeDanger',
    patterns: [
      /\b(shouting outside my room|outside my room|he is shouting|he's shouting|hit me|hurt me|threatening me|break down the door|coming for me|not safe at home|locked me in|won'?t let me leave)\b/,
      /\b(kamray ke bahar|darwazay ke bahar|cheekh raha|cheekh rahi|maar dega|maar degi|ghar mein khatra|mehfooz nahi)\b/,
      /(کمرے کے باہر|دروازے کے باہر|چیخ رہا|مار دے|محفوظ نہیں|خطرہ)/,
    ],
  },
];
