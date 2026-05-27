# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## TUT! Project Context

**What this is:** A British comedy messaging app. iOS only. Target: June 2026.

**The one rule that overrides everything:** Ship comedy first. Infrastructure second. The only question that matters is "Is Tracey funny?" Everything else is solvable.

## Cross-Agent Coordination

Before starting work on the TUT! app, read `STATUS.md` in the current repo. The original Mac path was `/Users/leemanley/Documents/TUT`; this Windows workspace is `C:\claude\TUT`.

Workflow for Codex/Claude sessions:
1. Run `git pull` before starting work so `STATUS.md` is current.
2. Read `STATUS.md` to see what is in progress and what is next.
3. Before making changes, update the `In Progress` section with what you are about to do.
4. When done, move finished work to `Completed This Session`.
5. After each task, run `git add -A && git commit -m "[description]" && git push`.
6. Check `STATUS.md` again before starting a new task in case another agent updated it.

Reference files:
- `CLAUDE.md` — rules and project context
- `TUT_PLAN.md` — master plan
- `lessons_learned.md` — context and decisions
- `STATUS.md` — current work, blockers, and handoff notes

### Product
- Free tier: 50–100 pre-written scripted scenarios. Tracey texts the user, mostly ignores their replies, pivots back to her own chaos.
- Paid tier (£2.99/mo): Claude-powered "Your Tracey" — personalised, remembers context, still chaotic and dismissive.

### Tech Stack
- **Framework:** Expo (managed workflow) + TypeScript
- **State:** Zustand
- **Backend:** Supabase (auth, DB, realtime)
- **Subscriptions:** RevenueCat
- **AI:** Claude API (paid tier only, server-side via Supabase Edge Function — never expose key in app)
- **Navigation:** Expo Router

### Rules That Cannot Be Broken
- Tracey never becomes a therapist, emotional support, or wellness product
- Claude API is invisible — users must never feel like they're talking to AI
- Notifications are narrative ("Trace: dave's in france"), never promotional
- No vector DB, no multi-character AI orchestration in V1
- Tracey only in V1 — no Dave, no group chat mode
- RevenueCat installed before product logic (per Day-0 guide)
- Entitlement state in SecureStore/Keychain, never AsyncStorage

### Existing Assets (documentaion/Tracey/)
- `chat.jsx` — 4 scripted scenarios with Tracey's voice already written. This is the seed content.
- `ad.jsx`, `app.jsx` — Magazine ad campaign components (brand, colours, fonts all locked in)
- `design-canvas.jsx` — Design canvas tooling
- Brand fonts: Alfa Slab One (wordmark), Anton (headlines), DM Sans (UI), Georgia (editorial)
- Colour palettes: magPink, peachPunch, creamMagenta, sunnySide (all defined in app.jsx)

### Day-0 Shipping Checklist (follow before feature work)
From `01_Day-0 Companion Guide.docx`:
1. App created in App Store Connect, bundle ID locked
2. RevenueCat SDK installed, EntitlementContext wired
3. Storage version constant defined
4. Root + feature error boundaries scaffolded
5. Accessibility roles on all interactive elements
6. Navigation tested (back gesture, deep linking scaffold)
7. Sensitive state in SecureStore, not AsyncStorage

### React Native Chat UX Notes
- Keep the chat `InputBar` inside the same `KeyboardAvoidingView` as the message list so the keyboard does not hide the send button.
- For single-line chat input, use `returnKeyType="send"` with `onSubmitEditing`; only reintroduce `multiline` when multi-line messages are intentionally supported.
- Set `keyboardShouldPersistTaps="handled"` on the `FlatList` so the send button remains tappable while the keyboard is open.

### Phase 1 Guided Reply Rule
- Phase 1 uses authored, deterministic reply options only (`replyOptions` in scenario beats).
- Do not reintroduce free typing or keyboard-driven chat input in Phase 1.
- Selected reply pills should transition into user chat bubbles before continuing Tracey beats.
- Keep startup sequence authored ("hiya babes" flow) and preserve typing delay timing.
- Bottom-right tab acts as `Reset` in this phase and restarts the scenario flow.

### Chat Colour Scheme (current)
- Tracey bubbles: cerise `#FF2D7A`, white text — `chatColors.traceyBubble / traceyText` in `src/lib/theme.ts`
- User bubbles: light grey `#E5E5EA`, dark text — `chatColors.userBubble / userText` in `src/lib/theme.ts`
- Reply option pills: white fill, thin cerise border (`theme.hot`), cerise fill when selected
- Dave bubbles: `#dff2d8` (light green), dark text — hardcoded in `ChatScreen.tsx`
- Do not revert user bubbles to cerise — that was the old scheme.

### S01E01 Tesco Scenario Notes
- Active Phase 1 scenario is `app/src/scenarios/tescoThing.json`, generated from `docs/tut_s01e01day1script.md`.
- Scenario beats may be typed as `message`, `voice-note`, or `image`.
- Image beats use filenames that map to `app/assets/s01e01/` in `ChatScreen.tsx`; keep filenames stable when editing script JSON.
- Voice-note beats currently render as visual bubbles with play icon, waveform, duration, and transcript stored for later audio/subtitle work. They do not play audio yet.
- Dave is allowed inside this authored S01E01 script as a visual sender (`from: "dave"`) with green bubbles and a `Dave` label; this does not mean free-form Dave/chat mode is in V1.

### Media Test Parking Rule
- If voice note or image features are tested and then paused, do not delete assets.
- Keep parked media files in `app/assets/audio/` and `app/assets/images/`.
- Keep explicit non-runtime references in `app/src/lib/parkedMediaAssets.ts` so reactivation later is fast and path-safe.
