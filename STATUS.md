# Current Work Status - TUT!

**Last Updated:** 2026-05-25 12:05 UTC+1

## In Progress
- None currently

## Completed This Session
- Done: Tested Tracey media messages (voice note + picture) on device path, then rolled back runtime flow to the original startup sequence.
- Done: Restored original startup pacing and typing behavior in `magicMike.json`, `index.tsx`, and text-only `ChatScreen.tsx`.
- Done: Removed temporary `expo-audio` runtime wiring from `app.json` and `package.json`.
- Done: Kept future media assets in repo (`app/assets/audio/dave.mp3`, `app/assets/images/Dave.jpg`) and anchored references in `app/src/lib/parkedMediaAssets.ts` for later reactivation.
- Done: Fixed keyboard/send UX in the chat composer: Enter now submits, empty sends are disabled, and the input bar stays inside `KeyboardAvoidingView` so the keyboard does not hide the send button.
- Done: Added `keyboardShouldPersistTaps="handled"` to the message list so tapping send works while the keyboard is open.
- Done: Verified TypeScript with `npx tsc --noEmit`.
- Done: Updated handoff docs (`STATUS.md`, `lessons_learned.md`, `CLAUDE.md`).
- Done: Added keyboard/send button UX issue to `to-do.txt`.
- Done: Always show purple send arrow in chat composer instead of initial mic button.
- Done: Matched TUT Expo versions to working 364 Rails SDK 54 setup.
- Done: Added initial typing delay before "hiya babes" and fixed send button app colour styling.
- Done: Downgraded Expo app to SDK 55 so it works with the App Store Expo Go app.
- Done: Fixed typing indicator placement so the animated dots render under the last conversation line.
- Done: Added Codex/Claude coordination instructions to `CLAUDE.md`.
- Done: File path reorganization (moved scenarios/ and lib/ to src/).
- Done: Fixed ChatScreen rendering (`lineHeight: 1.32` to `18`).
- Done: Modern icons via lucide-react-native (Phone, Video, Send, Mic, Plus).
- Done: Animated typing indicator with bouncing dots.
- Done: Increased message delays (2.2-3s) for visible typing.
- Done: Initial git repo + GitHub push.

## Completed Previously
- Done: Expo project initialization with TypeScript.
- Done: ChatScreen component with full messaging UI.
- Done: Brand color system (4 palettes: magPink, peachPunch, creamMagenta, sunnySide).
- Done: First scenario (Magic Mike) with timing and user input handling.
- Done: Dismissal phrase system.

## Next Priority (Phase 2)
1. **Scenario Engine** - data-driven scenarios, randomization, scenario rotation.
2. **Content Sprint** - 10-50 scenarios across all categories from PRD.
3. **Error Boundaries** - Root + feature level (Phase 0.6).
4. **AsyncStorage Persistence** - messages survive app close (Phase 0.5).
5. **UUID Message IDs** - replace Date.now().

## Blocked / Needs Decision
- None currently.

## Known Issues / Tech Debt
- No error boundaries yet.
- No persistence (messages disappear on app close).
- Typing animation now uses React Native `Animated`, but needs real device testing before calling it done.
- Message IDs still use Date.now() (should be UUID).
- Media assets are intentionally parked (not active): `app/assets/audio/dave.mp3` and `app/assets/images/Dave.jpg`.
- Parked asset references live in `app/src/lib/parkedMediaAssets.ts`.

## Git Info
- Remote: `git@github.com:greenhill32/TUT.git`
- Latest commit: `715d3c8` - Add keyboard UX todo
- Branch: `main`

## How to Avoid Conflicts
1. Run `git pull` before starting work.
2. Check this `STATUS.md` before starting work.
3. Update "In Progress" section with your name before you start.
4. Move completed items to "Completed This Session".
5. After each task, run `git add -A && git commit -m "[description]" && git push`.
6. Check `STATUS.md` again before starting a new task in case another agent updated it.

## Codex Startup Prompt
Paste this into the first Codex message when starting a fresh session:

```text
Before you start working on the TUT! app, read STATUS.md in the current repo.

Your instructions:
1. Read STATUS.md to see what's in progress and what's next.
2. Before starting work, update the "In Progress" section with what you're about to do.
3. When done, move tasks to "Completed This Session".
4. After each task, run: git add -A && git commit -m "[description]" && git push.
5. Always check STATUS.md again before starting a new task in case another agent updated it.

Reference files: CLAUDE.md (rules), TUT_PLAN.md (master plan), lessons_learned.md (context)

Current repo location in this session: C:\claude\TUT
```

---

## Reference Files (for both AI systems)
- **CLAUDE.md** - project rules and behavioral guidelines.
- **TUT_PLAN.md** - 9-phase master plan with checkboxes.
- **lessons_learned.md** - what worked, what to do differently.
- **STATUS.md** - this file; current session status and blockers.
