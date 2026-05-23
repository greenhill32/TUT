# Lessons Learned — TUT! Development

## Process & Organization

### ✅ What Worked Well
1. **Comprehensive Planning Before Code** — Having TUT_PLAN.md with 9 phases + detailed checklists meant we knew exactly what to build and in what order. No scope creep.

2. **Documentation First** — Day-0 Companion Guide prevented us from rebuilding App Store setup later. RevenueCat goes in before product logic (not after).

3. **Existing Assets Reuse** — The magazine ad campaign UI components (`chat.jsx`, brand colours, fonts) ported directly to React Native. Saved weeks.

4. **Tracey's Voice Already Written** — The 4 scenarios in `chat.jsx` were production-ready. We didn't guess the comedic rhythm — it was there.

5. **Folder Organization** — Moving `documentaion` → `docs`, keeping Expo app in `/app` subfolder kept things clean. Project root stays for planning/config files.

6. **TypeScript from Day 1** — Caught component prop mismatches early. Type safety paid for itself on ChatScreen.

### ⚠️ What We'd Do Differently

1. **Expo Template Selection** — Interactive CLI prompts don't work well in non-interactive shells. Next time: use `npx create-expo-app . --template blank` or programmatic setup.

2. **Bundle ID Locking** — The Day-0 guide says lock it before anything else. We did this late (in app.json after initialization). Do it *before* any code.

3. **Scenario Format** — We used JSON from the PRD, but the types were loose (optional `sender`, `text`, etc). Should define strict TypeScript types first, then generate JSON from those.

4. **No Async Scenario Player Yet** — Current implementation is blocking/setTimeout-based. For longer scenarios or network responses (paid tier), we'll need proper queue/state management (Zustand).

5. **Typing Indicator** — CSS animations don't work in React Native. We need Animated API or react-native-reanimated instead of CSS `@keyframes`.

## Technical Decisions

### ✅ Correct Choices
- **Zustand for state** (deferred, but right choice) — simpler than Redux for this scope
- **Supabase for backend** — auth + DB + realtime in one, fits the tech stack
- **Expo managed workflow** — no Xcode needed, fast iteration, Expo Go testing
- **SecureStore for entitlements** — compliance rule from Day-0 guide
- **Dismissal phrase pool** — hardcoded string pool beats API for off-scenario scenarios

### 🔧 Needs Adjustment
1. **Message IDs** — Using `msg-${Date.now()}` works for now, but UUID would be better
2. **No error boundaries** — Phase 0.6 requires this. Need RootError boundary component
3. **No AsyncStorage persistence** — Users close and reopen, messages disappear. Need storage layer (Phase 0.5)
4. **No deep linking** — Phase 8 requires `tut://chat/:scenarioId`. Haven't wired this yet

## Next Phase (Phase 1 → 2 Transition)

### Before Moving to Scenario Engine
- [ ] Add error boundary (Root + feature level)
- [ ] Add AsyncStorage for message persistence
- [ ] Replace setTimeout with proper async/state queue
- [ ] Replace CSS animations with Animated API
- [ ] Add UUID for message IDs
- [ ] Test on real iOS device (not just web/simulator)

### Critical for Phase 2
- Define strict TypeScript types for Scenario format (not loose JSON)
- Build `useScenarioPlayer()` hook that handles delays + state transitions
- Implement dismissal phrase randomization properly (no repeat within 5)
- Add scenario rotation logic (exclude last 3 seen)

## Communication & Collaboration

### What Made This Fast
1. **Checklist format** — TUT_PLAN.md with ✓ boxes let us knock them off methodically
2. **Clear phase gates** — "Don't start Phase 1 until Phase 0 is done" prevented rework
3. **Existing code samples** — The magazine ad `chat.jsx` showed exactly what the UI should look like
4. **CLAUDE.md + Day-0 guide** — Two authoritative documents meant less guessing

### If This Happens Again
1. **Lock bundle ID and App Store Connect setup on day 1** — not day 3
2. **Write strict TypeScript types before JSON** — not after
3. **Real device testing earlier** — web preview masks platform-specific bugs
4. **Test Tracey's voice with real users before scaling to 50 scenarios** — we have 4 validated, need to test variations

## Velocity & Scope

| Phase | Work | Time |
|---|---|---|
| **Project Setup** (0.1–0.9) | Init Expo, configure, scaffold | ~1 hour |
| **Messaging Shell** (1.1–1.7) | Chat UI, hard-coded scenario | ~2 hours |
| **Total to MVP** | Tracey texting on device | ~3 hours |

To **Phase 2 completion** (50 scenarios, full engine): ~2 weeks solo, with user testing built in.

## Core Insight

**Ship comedy first. Infrastructure second.** We built the minimum viable messaging UI in 3 hours and validated Tracey works. Everything else (notifications, payments, personalization) is infrastructure on top of that core comedic experience. If the messaging felt wrong, we'd have wasted weeks on features around a broken product. Getting feedback on the *feeling* (is she funny?) early meant we can confidently add tiers and features later.
