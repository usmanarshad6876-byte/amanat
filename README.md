# Amanat

A private mental health companion prototype for survivors of childhood emotional abuse and neglect in Pakistan.

## Run Locally

From this folder:

```sh
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:5173/
```

The app uses the Claude warm-paper React design. It includes grounding tools, survivor-facing trigger cards, shame spiral map cards, trauma response profile cards, survivor boundary scripts, trauma-language guides, metacognitive mind loops, partner guidance, crisis steps, affirmations, a companion screen, support resources, a searchable Humsafar trauma trigger database, and safety modes for danger, public places, family pressure, faith-sensitive language, and quiet presence.

The Tools area uses grouped navigation to reduce cognitive load: Right now, Understand, Repair, Life contexts, and optional Research mode. The Right now group includes first-class safety paths for “I am not safe,” coercion/abuse, and shared-device privacy, covering physical danger, monitoring, threats, blocked exits, forced choices, severe dissociation, self-harm risk, quick exit, disguised mode, and local deletion clarity before emotional grounding. The app also includes separate workbook-driven features for anger and grief, rough-day return-to-safety protocol, sleep/night-time planning, good-day safety, environment safety, Pakistani family culture, relationship maps, safe intimacy, and workplace trauma. Duplicate sheets already represented by existing features were skipped. Research dashboard/codebook references are hidden from survivor-facing Tools unless Research mode is enabled in settings.

Safety and app-readiness improvements include low-text mode, English safety phrases for urgent scripts, support-routing labels instead of raw risk labels, a “do not make major decisions while flooded” rule in rough-day care, one-step grounding before module explanations, an optional “show explanation” control, module visibility labels, and standardized module row metadata for future database work.

The latest safety/data pass adds “do not confront if unsafe” cautions to boundary, family/culture, relationship, and workplace scripts; a consent/privacy gate before Safe Intimacy; a clearer “not a diagnosis” warning for response profiles; formula-zero helper rows are filtered out of imported support sheets; displayed IDs are namespaced by feature/module; and imported module rows now separate baseline support level from the user’s live red/amber/green safety-gate state.

The research/public-readiness pass adds a research consent and anonymisation gate, an app-ready backend table dictionary, role/pathway rules for public survivor use versus clinician-supported, partner, and research use, and a Help page that labels the system as a private prototype until expert review, usability testing, supported field pilot work, privacy/security review, and helpline re-verification are complete.

The UI refresh replaces the older beige paper look with a cleaner warm-ivory notebook theme, stronger charcoal text, deep teal/indigo/plum accent presets, bolder headings, clearer card borders and shadows, labeled mood buttons, and higher-contrast controls while keeping crisis red reserved for urgent safety actions.

The graphic identity pass adds a stronger Amanat mark, a subtle vertical care-line motif, distinct action and quote card treatments, clearer tool-tile hierarchy, and a crisis-specific tile style so the interface feels more art-directed and less like a generic wellness card grid.

## Deploy on GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

After pushing to GitHub:

1. Open the repository settings.
2. Go to **Pages**.
3. Set **Build and deployment** to **GitHub Actions**.
4. Push to `main`, or run the workflow manually from the **Actions** tab.

The Vite config uses `base: './'` so the app can run from a GitHub Pages project URL such as `https://username.github.io/repository-name/`.

Role mode is available in settings for Survivor, Partner, Clinician, and Researcher use. Survivor mode keeps large matching-result grids folded by default so the app opens on one selected card or script first; partner, clinician, and researcher roles can browse the fuller libraries directly.

The Right Now group includes a guided “What is happening right now?” flow. Survivor-facing module pages now start with a red/amber/green safety gate before opening deeper reflection content: red routes to urgent safety, amber opens with grounding-first cautions, and green continues to the card.

Tap-only mode hides search boxes and dropdown filters on the main card/module surfaces so the app can be used through buttons only. Read-aloud buttons can be enabled in settings; they use the browser speech-synthesis API to read the selected card, script, or map aloud when supported.

Additional safeguarding flows now cover minors, CSA disclosure support, domestic violence/coercive-control safety planning, and medical red flags. These appear in Help and as first-class Right Now tools so they are reachable before deep reflection.

By default, mood and journal data stay in the current browser session. The in-app privacy setting can keep data on the device via local storage. Companion and Reframe messages may be sent to a model service for replies; the app now screens high-risk phrases locally before any model response. The same local safety detector also surfaces urgent safety prompts in the journal when suicide, self-harm, or active-danger language appears.

Helpline numbers were checked on May 22, 2026 against current public pages for Umang, Rozan, Rescue 1122, and Punjab Police emergency helplines. Re-verify before any public deployment.
