# Current Work Status — TUT!

**Last Updated:** 2026-05-23 19:50 UTC+1

## In Progress
- ✏️ Messaging shell UI polish (Claude) — icons & typing animation complete, ready for testing

## Completed This Session
- ✅ Added initial typing delay before "hiya babes" and fixed send button app colour styling
- ✅ Downgraded Expo app to SDK 55 so it works with the App Store Expo Go app
- ✅ Fixed typing indicator placement so the animated dots render under the last conversation line
- ✅ Added Codex/Claude coordination instructions to `CLAUDE.md`
- ✅ File path reorganization (moved scenarios/ and lib/ to src/)
- ✅ Fixed ChatScreen rendering (lineHeight: 1.32 → 18)
- ✅ Modern icons via lucide-react-native (Phone, Video, Send, Mic, Plus)
- ✅ Animated typing indicator with bouncing dots
- ✅ Increased message delays (2.2-3s) for visible typing
- ✅ Initial git repo + GitHub push

## Completed Previously
- ✅ Expo project initialization with TypeScript
- ✅ ChatScreen component with full messaging UI
- ✅ Brand color system (4 palettes: magPink, peachPunch, creamMagenta, sunnySide)
- ✅ First scenario (Magic Mike) with timing & user input handling
- ✅ Dismissal phrase system

## Next Priority (Phase 2)
1. **Scenario Engine** — data-driven scenarios, randomization, scenario rotation
2. **Content Sprint** — 10-50 scenarios across all categories from PRD
3. **Error Boundaries** — Root + feature level (Phase 0.6)
4. **AsyncStorage Persistence** — messages survive app close (Phase 0.5)
5. **UUID Message IDs** — replace Date.now()

## Blocked / Needs Decision
- None currently

## Known Issues / Tech Debt
- No error boundaries yet
- No persistence (messages disappear on app close)
- Typing animation uses CSS @keyframes (works but not ideal for React Native)
- Message IDs still use Date.now() (should be UUID)

## Git Info
- Remote: `git@github.com:greenhill32/TUT.git`
- Latest commit: `7ddbcc2` — properly tracking app source code
- Branch: `main`

## How to Avoid Conflicts
1. Run `git pull` before starting work
2. Check this `STATUS.md` before starting work
3. Update "In Progress" section with your name before you start
4. Move completed items to "Completed This Session"
5. After each task, run `git add -A && git commit -m "[description]" && git push`
6. Check `STATUS.md` again before starting a new task in case another agent updated it

## Codex Startup Prompt
Paste this into the first Codex message when starting a fresh session:

```text
Before you start working on the TUT! app, read /Users/leemanley/Documents/TUT/STATUS.md

Your instructions:
1. Read STATUS.md to see what's in progress and what's next
2. Before starting work, update the "In Progress" section with what you're about to do
3. When done, move tasks to "Completed This Session"
4. After each task, run: git add -A && git commit -m "[description]" && git push
5. Always check STATUS.md again before starting a new task (in case Claude updated it)

Reference files: CLAUDE.md (rules), TUT_PLAN.md (master plan), lessons_learned.md (context)

Current repo location: /Users/leemanley/Documents/TUT
```

---

## Reference Files (for both AI systems)
- **CLAUDE.md** — project rules & behavioral guidelines
- **TUT_PLAN.md** — 9-phase master plan with checkboxes
- **lessons_learned.md** — what worked, what to do differently
- **STATUS.md** — THIS FILE — current session status & blockers
