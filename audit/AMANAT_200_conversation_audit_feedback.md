# Amanat Companion — 200-Conversation Audit Feedback

Date: 2026-05-29

I could confirm that the public link opens as **Amanat — a private companion**, but I do not have a fully interactive browser session here that can manually submit 200 live messages into the deployed app. So I built a practical **200-conversation regression audit pack** for the companion.

## Main feedback from the current chat replies you shared

The replies are warm and trauma-informed, but the main problem is the repeated fallback line:

> “I may have answered too broadly. Give me one more sentence, and I will respond to that directly.”

This should not appear after valid short replies such as:

- “ok”
- “hmm”
- “yes”
- “my feet are already on the floor”
- “I do not feel like talking”

In those moments, Amanat should continue the grounding sequence rather than reset the conversation.

## Highest priority fixes

1. **State handling**
   - Greeting → low speech → body orientation → grounding → body location → safety check → next step.
   - The bot should know which step it is currently in.

2. **Short acknowledgement handling**
   - User: “ok”
   - Better reply: “Good. That is enough for this moment. Stay with the floor for one more breath.”

3. **High-risk routing**
   - For self-harm, violence, coercion, abuse or medical emergency, route to trusted human/emergency/professional support before asking further questions.

4. **Roman Urdu mode**
   - If user writes in Roman Urdu, reply in natural Roman Urdu or mixed English/Roman Urdu.
   - Do not use heavy formal Urdu.

5. **Short activation replies**
   - During body trigger, panic, freeze, numbness, night-time activation or shame spiral, keep responses to 2–5 sentences.

## Files included in the pack

- `amanat_200_conversation_audit_pack.xlsx`
- `AMANAT_200_conversation_audit_feedback.md`
- `amanat_200_test_prompts.jsonl`

## How to use

Paste each test message into the live companion. Copy the companion’s actual reply into the workbook, mark Pass/Fail, and add notes. This will show exactly where the model needs state, safety, Roman Urdu, or cultural-sensitivity improvements.
