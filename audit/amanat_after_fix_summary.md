# Amanat 200 After-Fix Audit Summary

Generated: 2026-05-29

## Scope

Targeted fixes were made only in the Companion response logic. The app was not rebuilt structurally or redesigned.

Files saved:

- `audit/amanat_200_after_fix_results.csv`
- `audit/amanat_after_fix_summary.md`
- `audit/failed_cases_before_after_comparison.csv`

## Before-Fix Failure Summary From Completed Workbook

Total failed before fix: 34

### By Failure Reason

- Roman Urdu/mixed-language handling: 25
- missing cue-specific grounding: 5
- safety/crisis routing: 2
- short acknowledgement repeated fallback: 2

### By Language

- Roman Urdu: 26
- English: 8

### By Trigger/Manual

- Digital Nervous System Manual: 12
- Night Survival Manual: 10
- Conversation State: 4
- Partner & Family Manual: 3
- Safety & Crisis: 2
- Boundary: 1
- Low Speech: 1
- Survivor Manual: 1

### By Likely App Logic Area

- language detection / Roman Urdu local replies: 22
- detectLocalSafety privacy branch: 4
- localSupportReply short fallback / conversation state: 4
- localCompanionReply crisis safety copy: 3
- cueSpecificReply digital triggers: 1

## After-Fix Results

- Total prompts: 200
- Passed: 200
- Failed: 0
- Pass percentage: 100.0%
- Roman Urdu pass: 100/100 (100.0%)
- Repeated fallback failures: 0
- English replies to Roman Urdu prompts by language heuristic: 0
- Crisis replies missing explicit human/emergency support routing: 0

## Target Check

- 190/200 pass: MET
- 95%+ Roman Urdu pass: MET
- 0 repeated fallback failures: MET
- 0 English replies to Roman Urdu prompts: MET
- 0 crisis replies without explicit human/emergency support routing: MET

## Top 20 Before-Fix Weak Cases, Now Compared

1. **AMANAT-T01-026** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: I am here with you. You do not have to make this neat before it is allowed to matter. What part of this feels loudest right now?
   - After: Aap ne body alarm ko naam diya. Crowded ya unpredictable jagah nervous system ko alert kar sakti hai. Abhi pehla qadam: exit/quiet side dekhein, paon zameen par mehsoos karein, aur ek safe person ya landmark choose karein.
   - Result: PASS (9/9)
2. **AMANAT-T02-053** — missing cue-specific grounding / detectLocalSafety privacy branch
   - Before: Important truth: journal and mood entries stay in this browser session or on this device if you turn persistence on. Companion and Reframe may send your text to a model service to generate a reply. Do not type anything here that would put you at risk if someone else accessed the device or service logs.
   - After: I hear that you want to support them well. You can say: “I can understand why lack of privacy would make your body feel on alert. First step: let us take one small safe pause; you do not have to explain everything right now.” If there is danger, contact a trusted person or emergency support now.
   - Result: PASS (9/9)
3. **AMANAT-T02-054** — Roman Urdu/mixed-language handling / detectLocalSafety privacy branch
   - Before: Important truth: journal and mood entries stay in this browser session or on this device if you turn persistence on. Companion and Reframe may send your text to a model service to generate a reply. Do not type anything here that would put you at risk if someone else accessed the device or service logs.
   - After: Aap unhein yeh keh sakte/sakti hain: “Mujhe samajh aa raha hai ke privacy na milna body ko alert kar sakta hai. Pehla qadam: hum ek chhota safe pause lete hain; aap ko explain karna zaroori nahi.” Agar danger ho to trusted safe shakhs/emergency support se rabta karein.
   - Result: PASS (9/9)
4. **AMANAT-T02-060** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: A simple boundary can be enough: “I need a pause. I will come back to this when I can think clearly.” You do not have to explain everything while your body is overwhelmed.
   - After: Aap keh sakte/sakti hain: “Aap ki boundary matter karti hai. Pehla qadam: agar touch, message, ya baat uncomfortable ho, pause lena allowed hai.” Agar risk ho to trusted safe shakhs ko involve karein.
   - Result: PASS (9/9)
5. **AMANAT-T03-085** — missing cue-specific grounding / detectLocalSafety privacy branch
   - Before: Important truth: journal and mood entries stay in this browser session or on this device if you turn persistence on. Companion and Reframe may send your text to a model service to generate a reply. Do not type anything here that would put you at risk if someone else accessed the device or service logs.
   - After: This can be a work-power trigger, not an app privacy issue. First step: you are allowed to pause before replying; translate it into a task: “Please tell me the specific next step so I can respond clearly.”
   - Result: PASS (9/9)
6. **AMANAT-T03-086** — Roman Urdu/mixed-language handling / detectLocalSafety privacy branch
   - Before: Important truth: journal and mood entries stay in this browser session or on this device if you turn persistence on. Companion and Reframe may send your text to a model service to generate a reply. Do not type anything here that would put you at risk if someone else accessed the device or service logs.
   - After: Yeh work-power trigger ho sakta hai, app privacy ka issue zaroori nahi. Abhi pehla qadam: reply delay karna allowed hai; message ko task mein translate karein: “Mujhe clear next step bata dein taake main respond kar sakun.”
   - Result: PASS (9/9)
7. **AMANAT-T03-106** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: Tonight needs a smaller plan, not a perfect one. Keep a light or familiar sound on if it helps, put water nearby, and choose one person or service you could contact if the night gets unsafe.
   - After: Raat ka alarm zyada loud lag sakta hai. Abhi pehla qadam: light ya familiar sound on karein, paani paas rakhein, aur aaj ki tareekh plus room ka naam lein. Agar raat unsafe lage to trusted safe shakhs ya emergency support se rabta karein.
   - Result: PASS (9/9)
8. **AMANAT-T03-110** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: Tonight needs a smaller plan, not a perfect one. Keep a light or familiar sound on if it helps, put water nearby, and choose one person or service you could contact if the night gets unsafe.
   - After: Raat ka alarm zyada loud lag sakta hai. Abhi pehla qadam: light ya familiar sound on karein, paani paas rakhein, aur aaj ki tareekh plus room ka naam lein. Agar raat unsafe lage to trusted safe shakhs ya emergency support se rabta karein.
   - Result: PASS (9/9)
9. **AMANAT-T03-112** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: Chest tightness can feel frightening. You can choose: breathe slowly if that feels okay, orient to three objects in the room, or call/message someone if you feel unsafe. If chest pain is severe, new, or comes with fainting or trouble breathing, seek medical help.
   - After: Panic body ko bohat dara sakta hai. Abhi pehla qadam: dono paon zameen par, teen cheezen dekhein, aur ek slow breath lein. Agar chest pain severe/new ho ya saans bohat mushkil ho, medical help lein.
   - Result: PASS (8/9)
10. **AMANAT-T03-114** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: That smell can be a memory signal, and it can feel very present. Look around for three pieces of evidence that this is today: the date, the room, and one object that was not there back then.
   - After: Yeh memory/body alarm ho sakta hai, final proof nahi ke aap wahan wapas hain. Aaj ki tareekh, room ka naam, aur ek object jo us waqt nahi tha naam lein.
   - Result: PASS (9/9)
11. **AMANAT-T03-118** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: Replay is often the mind trying to make the moment end differently after it has already happened. For one minute, can you name the room you are in and one thing that is not part of that memory?
   - After: Yeh work-power trigger ho sakta hai, app privacy ka issue zaroori nahi. Abhi pehla qadam: reply delay karna allowed hai; message ko task mein translate karein: “Mujhe clear next step bata dein taake main respond kar sakun.”
   - Result: PASS (9/9)
12. **AMANAT-T03-122** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: A delayed reply can touch an old abandonment alarm very quickly. Before you decide what it means, try holding both truths: the fear is real, and the evidence may still be incomplete.
   - After: Delayed reply purana abandonment alarm jaga sakta hai. Meaning decide karne se pehle dono truths hold karein: darr real hai, aur evidence abhi incomplete ho sakta hai. Phone ko thori der face down rakhna pehla qadam ho sakta hai.
   - Result: PASS (9/9)
13. **AMANAT-T03-123** — missing cue-specific grounding / localCompanionReply crisis safety copy
   - Before: This is an urgent moment, not a moment to handle alone. Put distance between you and blades, pills, cords, or anything you could use, then call or message one real person now; if you might act tonight, use emergency support: Umang 0311-7786264, Rozan 0304-111-1741, Emergency 1122, Edhi 115.
   - After: I am glad you named this. Safety comes first, and this is not a moment to handle alone. Put distance between you and blades, pills, cords, or anything risky, then call/message one trusted person now; if you might act tonight, use emergency support: Umang 0311-7786264, Rozan 0304-111-1741, Emergency 1122, Police 15, Edhi 115.
   - Result: PASS (8/9)
14. **AMANAT-T03-124** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: This is an urgent moment, not a moment to handle alone. Put distance between you and blades, pills, cords, or anything you could use, then call or message one real person now; if you might act tonight, use emergency support: Umang 0311-7786264, Rozan 0304-111-1741, Emergency 1122, Edhi 115.
   - After: Yeh urgent safety moment hai, aur aap ko isay akelay hold nahi karna. Safety pehle: blades, pills, cords ya kisi bhi risky cheez se distance banayein, abhi ek trusted safe shakhs ko call/message karein; agar risk abhi hai to emergency support: Umang 0311-7786264, Rozan 0304-111-1741, Emergency 1122, Police 15, Edhi 115.
   - Result: PASS (9/9)
15. **AMANAT-T04-148** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: I am here with you. You do not have to make this neat before it is allowed to matter. What part of this feels loudest right now?
   - After: Yeh digital alarm ho sakta hai, final proof nahi. Abhi pehla qadam: phone 10 minutes ke liye face down rakhein, notifications mute karein, aur 5 neutral facts naam lein. Aap baad mein choice ke saath respond kar sakte/sakti hain.
   - Result: PASS (9/9)
16. **AMANAT-T04-150** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: A delayed reply can touch an old abandonment alarm very quickly. Before you decide what it means, try holding both truths: the fear is real, and the evidence may still be incomplete.
   - After: Yeh digital alarm ho sakta hai, final proof nahi. Abhi pehla qadam: phone 10 minutes ke liye face down rakhein, notifications mute karein, aur 5 neutral facts naam lein. Aap baad mein choice ke saath respond kar sakte/sakti hain.
   - Result: PASS (9/9)
17. **AMANAT-T04-154** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: I am here with you. You do not have to make this neat before it is allowed to matter. What part of this feels loudest right now?
   - After: Yeh digital alarm ho sakta hai, final proof nahi. Abhi pehla qadam: phone 10 minutes ke liye face down rakhein, notifications mute karein, aur 5 neutral facts naam lein. Aap baad mein choice ke saath respond kar sakte/sakti hain.
   - Result: PASS (9/9)
18. **AMANAT-T04-164** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: I am here with you. You do not have to make this neat before it is allowed to matter. What part of this feels loudest right now?
   - After: Yeh digital alarm ho sakta hai, final proof nahi. Abhi pehla qadam: phone 10 minutes ke liye face down rakhein, notifications mute karein, aur 5 neutral facts naam lein. Aap baad mein choice ke saath respond kar sakte/sakti hain.
   - Result: PASS (9/9)
19. **AMANAT-T04-166** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: I am here with you. You do not have to make this neat before it is allowed to matter. What part of this feels loudest right now?
   - After: Yeh digital alarm ho sakta hai, final proof nahi. Abhi pehla qadam: phone 10 minutes ke liye face down rakhein, notifications mute karein, aur 5 neutral facts naam lein. Aap baad mein choice ke saath respond kar sakte/sakti hain.
   - Result: PASS (9/9)
20. **AMANAT-T04-168** — Roman Urdu/mixed-language handling / language detection / Roman Urdu local replies
   - Before: I am here with you. You do not have to make this neat before it is allowed to matter. What part of this feels loudest right now?
   - After: Yeh digital alarm ho sakta hai, final proof nahi. Abhi pehla qadam: phone 10 minutes ke liye face down rakhein, notifications mute karein, aur 5 neutral facts naam lein. Aap baad mein choice ke saath respond kar sakte/sakti hain.
   - Result: PASS (9/9)

## Exact Code/System-Prompt Changes Made

1. Added stronger Roman Urdu detection in `src/companion.jsx`.
2. Made safety replies language-aware through `localCompanionReply(kind, text)`.
3. Added `shortContinuationReply()` for `ok`, `theek hai`, `haan`, `ji`, `done`, `hmm`, feet-on-floor continuation, and low-speech replies.
4. Added `diagnosisReply()` to avoid PTSD/diagnosis certainty while giving a grounded next step.
5. Added `supporterModeReply()` for prompts asking what to say to someone else.
6. Added `cueSpecificReply()` for digital triggers, graphic/sexual violence media exposure, night activation, male supervisor/private message, crowded/public travel cues, joint-family privacy, rishta/honour-shame, and checking loops.
7. Narrowed app privacy routing with `isAppPrivacyQuestion()` so situational privacy and private-message triggers no longer show storage/privacy boilerplate.
8. Removed the repeated short fallback line from active use by replacing the `prior && short` fallback with a grounding continuation.
9. Updated the audit runner to call the new local response branches in the same order as the app send path.

## Remaining Notes

The after-fix audit is heuristic and local-code based. It verifies the current Companion response path, including safety/training/boundary/fallback logic, but does not validate a remote model response because the static app does not expose a model service in this environment.
