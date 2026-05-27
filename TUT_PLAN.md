# TUT! Build Plan
**Version:** 1.0 | **Target:** June 2026 | **Platform:** iOS only

> "Ship comedy first. Infrastructure second. The only question that matters is: Is Tracey funny?"

---

## What Already Exists
These are done. Do not rebuild them.

- [x] Brand identity — fonts (Alfa Slab One, Anton, DM Sans, Georgia), colour palettes (magPink, peachPunch, creamMagenta, sunnySide)
- [x] Tracey's voice — 4 scripted scenarios in `documentaion/Tracey/chat.jsx` (Magic Mike, Cake, Paintball, Group Chat)
- [x] Magazine ad campaign — 4 full-page A4 ads in `documentaion/Tracey/` (doubles as App Store screenshot source material)
- [x] Phone frame + chat UI components — `PhoneFrame`, `ChatScreen`, `Bubble`, `TypingBubble`, `InputBar` (port these to React Native)
- [x] PRD — `documentaion/TUT_PRD_V2.md`
- [x] Day-0 shipping checklist — `documentaion/01_Day-0 Companion Guide.docx`
- [x] CLAUDE.md — project root

---

## PHASE 0 — Foundation Before Feature Work
*The Day-0 guide: do all of this before writing a single product screen.*

### 0.1 Mental Contract
- [ ] Accepted: shipping > elegance. Compliance early beats refactors later.

### 0.2 Expo Project Init
- [x] `npx create-expo-app tut --template expo-template-blank-typescript`
- [x] Confirm it runs on device via Expo Go
- [x] Install core dependencies: `zustand`, `nativewind`, `expo-router`
- [x] Configure `tsconfig.json`, ESLint, Prettier
- [x] Set up folder structure: `/app`, `/components`, `/scenarios`, `/store`, `/lib` (moved to `/src/`)

### 0.3 App Store & Identity (Before Feature Work)
- [ ] Create app in App Store Connect
- [ ] Lock bundle identifier: `com.tut.app` (or equivalent — cannot change later without pain)
- [ ] Lock app name: **TUT!**
- [ ] Create placeholder app icon (solid accent colour + "TUT!" wordmark — refine later)
- [ ] Create placeholder splash screen (matches app background colour)
- [ ] Host privacy policy on a real domain (not GitHub raw URL)
- [ ] Host terms of service on a real domain
- [ ] Verify both URLs are reachable
- [ ] Add `PrivacyInfo.xcprivacy` file — declare only what is actually collected

### 0.4 Monetisation & Entitlements (Before Product Logic)
*RevenueCat goes in now. Features never check raw purchase state.*
- [ ] Create RevenueCat account and project
- [ ] Install RevenueCat SDK: `expo install react-native-purchases`
- [ ] Create `EntitlementContext` (wraps the whole app)
- [ ] `useEntitlement()` hook returns `{ isPro, isLoading }` — that's it
- [ ] All premium gating checks only `isPro` from this hook
- [ ] `restorePurchases()` method exists (even if not surfaced in UI yet)
- [ ] Configure products in App Store Connect: `tut_monthly_299` (£2.99/mo), `tut_annual_1999` (£19.99/yr)

### 0.5 Storage Discipline
- [ ] Storage version constant defined: `const STORAGE_VERSION = 1`
- [ ] All AsyncStorage writes are `await`ed
- [ ] UI state updates only after persistence succeeds
- [ ] `try/catch` around all storage operations — no silent failures
- [ ] Related values written atomically (not in separate calls)

### 0.6 Error & Loading Boundaries
- [ ] Root error boundary added (catches crashes, shows fallback UI)
- [ ] Global loading gate during app hydration (no flash of wrong state)
- [ ] UI disabled until state is ready
- [ ] Fallback UI shown instead of white screen

### 0.7 Accessibility Defaults
*Set these from the first component. Do not defer.*
- [ ] All buttons have `accessibilityRole="button"`
- [ ] All icon-only buttons have `accessibilityLabel`
- [ ] Headers marked with `accessibilityRole="header"`
- [ ] Modals marked with `accessibilityViewIsModal`
- [ ] Reduced motion respected for typing indicator animation

### 0.8 Navigation Scaffold
- [ ] Expo Router configured with file-based routing
- [ ] `.push()` for forward navigation, `.replace()` only for hard resets
- [ ] Back gesture tested on device
- [ ] Deep linking scaffold added (notification → specific scenario): `tut://chat/:scenarioId`

### 0.9 Secure State
- [ ] `expo-secure-store` installed
- [ ] Entitlement state stored in SecureStore / Keychain — NOT AsyncStorage
- [ ] No sensitive flags in AsyncStorage
- [ ] `__DEV__` guards on any dev-only helpers

---

## PHASE 1 — Messaging Shell
*Goal: Tracey is texting you on a real iPhone. Nothing else matters yet.*
*Verify: Show it to someone — they should immediately "get it".*

### 1.1 Chat Screen Layout
- [x] Chat screen at `/src/app/chat.tsx`
- [x] Full-screen layout: header (fixed top) + messages list (scrollable) + input bar (fixed bottom)
- [x] Keyboard avoidance — input stays above keyboard on iOS
- [x] Auto-scroll to latest message on new message arrival
- [x] White background (`#ffffff`)

### 1.2 Tracey's Header
- [x] Back chevron (accent colour, matching brand)
- [x] Tracey avatar — circular, gradient from `hot` to `accent` colour, "T" in Alfa Slab One
- [x] Name: "Tracey" — 14px, 700 weight
- [x] Status line: "last seen typing forever" — 11px, 45% opacity
- [x] Video and phone call icons (decorative, non-functional in V1)
- [x] Dynamic Island safe area

### 1.3 Message Bubbles
- [x] Tracey messages: left-aligned, `#ececec` background, `#000` text
- [x] User messages: right-aligned, hot colour background, white text
- [x] Bubble corner radius: 18px, with tail (5px radius) on last bubble in a run
- [x] Font: 13.5px, line-height 1.32
- [x] `isLastOfRun` logic — tail only on final message before sender switches
- [x] Timestamps below each message group

### 1.4 Typing Indicator
- [x] Three bouncing dots, `#999` colour, `#ececec` bubble
- [x] CSS/Animated API bounce: 1.2s cycle, 0.15s stagger per dot
- [x] Shows while Tracey is "typing" (during `delay_ms` between messages)
- [x] Hides when message arrives

### 1.5 Read Receipts
- [ ] "Delivered" shown below last user message
- [ ] "Read" shown after Tracey's next message fires

### 1.6 Input Bar
- [x] `+` button (left) — non-functional in V1
- [x] Text field: "iMessage" placeholder, rounded pill shape
- [x] Microphone icon (right of field) — non-functional in V1
- [x] Send button appears when user has typed text
- [x] Home indicator safe area at bottom

### 1.7 First Hard-Coded Scenario (Proof of Life)
- [x] S01E01 "The Tesco Thing" authored as active JSON scenario with guided replies, Dave-labelled green bubbles, real image beats, and visual voice-note beats.
- [x] App opens → 1.5s pause → Tracey's first message appears
- [x] Typing indicator shows during pause
- [x] User types reply → send → Tracey's dismissal fires after 2s → continues story
- [x] Test on real device via Expo Go ← **must pass before moving on**

---

## PHASE 2 — Scenario Engine
*Goal: Scenarios are JSON data. Swap content without touching code.*
*Verify: 5 different scenarios play correctly with correct timing and dismissals.*

### 2.1 TypeScript Schema
- [x] Define active beat shape for Phase 1: `{ id, from, text?, type?, delayMs, nextBeatId?, replyOptions?, filename?, durationLabel?, transcript? }`
- [ ] Define `ScenarioMessage` type: `{ delay_ms, sender, text, type?, dismissal? }`
- [ ] Define `Scenario` type: `{ id, title, character, duration_minutes, messages, category }`
- [ ] Create `/scenarios/` folder
- [ ] One scenario per `.json` file

### 2.2 Scenario Player Engine
- [ ] `useScenarioPlayer(scenario)` hook
- [ ] Plays messages sequentially with correct `delay_ms` timing
- [ ] Shows typing indicator during each delay
- [ ] Pauses at `await_user_input` step — waits for user to send a message
- [ ] On user send: selects random dismissal phrase, appends to Tracey's next message, continues
- [ ] `scenarioComplete` state when final message fires

### 2.3 Dismissal Phrase Pool
- [ ] 20+ dismissal phrases in `/lib/dismissals.ts`
- [ ] Seeded from PRD: "I know, but as I was saying...", "You don't say? Anyway...", "Christ on a bike, but this cake...", "Fair point, but listen...", "Tell me about it, but here's the thing..."
- [ ] `getRandomDismissal()` — no immediate repeat of same phrase
- [ ] Dismissal prepended to Tracey's next message naturally

### 2.4 Scenario Selection & Rotation
- [ ] `ScenarioStore` (Zustand): tracks `seen[]`, `current`, `history[]`
- [ ] Random picker: excludes last 3 seen scenarios
- [ ] "Next scenario" triggers on scenario complete — brief pause, then new scenario loads
- [ ] Seen list persisted to AsyncStorage (with storage version)

### 2.5 Content Sprint — Port Existing + Write New
- [x] **00 · The Tesco Thing** — S01E01 Day 1, self-scan incident, Dave PTSD misunderstanding, cliffhanger witness line.
*Port from `documentaion/Tracey/chat.jsx` first — voice already validated.*
- [ ] **01 · Magic Mike** — Brenda thinks he does card tricks ("rang the venue asking if he brings doves")
- [ ] **02 · Phone in Cake** — Mum's phone baked into Victoria sponge, now in A&E ("the cake is ringing Janet")
- [ ] **03 · Paintball** — Dave booked 14, just him and Tracey showed up, "im in a feild"
- [ ] **04 · Group Chat** — Tara slagged off in the chat she's in. By Brenda. Obviously.
- [ ] **05 · Dave's France Situation** — new
- [ ] **06 · Brenda at the Doctor** — new
- [ ] **07 · Holiday Booking Disaster** — wrong country, wrong year — new
- [ ] **08 · Maureen at Lidl** — escalation — new
- [ ] **09 · Workplace Incident** — unnamed colleague — new
- [ ] **10 · Something at the Wedding** — new
- [ ] **11–30** — continue across all PRD categories (booking disasters, lost phones, group chats, Dave schemes, Tara collateral)
- [ ] **31–50** — complete the launch library
- [ ] Each scenario reviewed: does it have a screenshotable moment? If not, rewrite.

---

## PHASE 3 — Push Notifications
*Notifications are a killer feature — not an afterthought.*
*Verify: Receive "Trace: dave's in france" on real device.*

- [ ] Install `expo-notifications`
- [ ] Request permissions on first launch — framed as "get texts from Tracey" (not "allow notifications")
- [ ] Register device token with Supabase
- [ ] Notification templates (narrative, not promotional):
  - [ ] "Trace: dave's in france"
  - [ ] "New Number: Trace"
  - [ ] "Trace: don't panic"
  - [ ] "Trace: call me immediately"
  - [ ] "Trace: youre not going to believe this"
  - [ ] "Trace: its fine. its absolutely fine."
- [ ] Scheduled daily notification — random time 9am–7pm user's timezone
- [ ] Re-engagement notification — fires 24h after last open
- [ ] Deep link: notification tap → opens app → loads specific scenario
- [ ] Test on real device (simulator does not receive push notifications) ← **must test on device**

---

## PHASE 4 — Auth & Supabase Backend
*Goal: User accounts exist. Free experience persists across sessions.*
*Verify: Sign in, kill app, reopen — same state.*

### 4.1 Supabase Project Setup
- [ ] Create Supabase project
- [ ] Install Supabase client: `expo install @supabase/supabase-js`
- [ ] Store Supabase URL + anon key in `.env` (never in source)
- [ ] Configure Supabase auth for Expo (custom storage using SecureStore)

### 4.2 Database Schema
- [ ] `users` table: `id, email, name, age_range, job, relationship_status, situation, interests, is_paid, subscription_status, subscription_id, trial_ends_at, created_at`
- [ ] `messages` table: `id, user_id, sender, content, scene_id, is_paid_response, created_at`
- [ ] `scenes` table: `id, character, title, duration_minutes, messages (JSONB), category`
- [ ] Row Level Security enabled on all tables

### 4.3 Auth Flow
- [ ] First launch → onboarding screen
- [ ] Apple Sign In (required for iOS apps with social login)
- [ ] Email magic link fallback
- [ ] Session persisted in SecureStore
- [ ] Guest/anonymous mode — full free experience, upgrade prompt on day 3
- [ ] Existing user: skip onboarding, go straight to chat

---

## PHASE 5 — Paid Tier: Your Tracey
*Goal: Tracey knows your name. She's still chaotic. She's just your specific chaos.*
*Verify: Send 5 messages as paid user — Tracey references your real name and job without feeling like a chatbot.*

### 5.1 Activate RevenueCat
- [ ] Wire RevenueCat to App Store Connect products
- [ ] Paywall screen: "Unlock Your Tracey" — £2.99/mo or £19.99/yr
- [ ] Purchase flow (Apple Pay)
- [ ] Restore purchases button
- [ ] `isPro` flips to `true` — app unlocks paid behaviour immediately
- [ ] Paywall trigger: day 7 after install (soft, dismissable)
- [ ] Secondary trigger: after scenario 10 (free users have seen enough to want more)

### 5.2 Paid Onboarding
- [ ] Post-subscribe onboarding: "Tracey's getting your number"
- [ ] Capture (keep it light, conversational, not form-like):
  - [ ] First name
  - [ ] What they do (job/role)
  - [ ] Current situation (relationship, life stage)
  - [ ] Biggest current frustration
  - [ ] One recurring joke or phrase
- [ ] Save to Supabase `users` table
- [ ] Confirmation screen: "Right, she's got you. Brace yourself."

### 5.3 Claude API Integration
- [ ] Claude API key stored server-side only (Supabase Edge Function — never in app bundle)
- [ ] Supabase Edge Function: `POST /tracey-response` — receives message history + user context, returns Tracey's reply
- [ ] System prompt (Tracey's voice):
  - Chaotic, self-focused, dismissive, affectionate underneath
  - Always pivots back to her own story
  - References user's real name, job, situation naturally
  - Never becomes: therapist, assistant, emotionally available, productivity tool
  - Typos and fragmented messages are intentional — do not correct
  - Ends most messages with "anyway" or pivots mid-thought
- [ ] User context injected into every API call
- [ ] Last 10 messages sent as conversation history
- [ ] 100 message/day quota — soft limit (counter in Supabase)
- [ ] Graceful fallback if API unavailable: cached dismissal phrase + pivot (never show error to user)
- [ ] Response streaming for perceived speed

### 5.4 Context Persistence
- [ ] Paid conversations stored in Supabase `messages` table
- [ ] Last conversation loaded on app open (feels like continuity)
- [ ] Tracey naturally references previous conversations ("anyway like I was saying about dave")

---

## PHASE 6 — Polish
*Verify: Show to 5 women aged 25–55. At least 3 laugh and want to screenshot something.*

### 6.1 App Icon
- [ ] Final icon: retro pop art, facepalming woman, bold "TUT!" — based on existing brand assets
- [ ] All required sizes generated (1024×1024 master, Expo generates the rest)
- [ ] Test on home screen — does it look right? Is it instantly British?

### 6.2 Splash Screen
- [ ] Matches app background (`palette.bg`)
- [ ] "TUT!" wordmark centred (Alfa Slab One, accent colour)
- [ ] No jarring transition between splash and app

### 6.3 Haptics
- [ ] Light haptic on message send
- [ ] Medium haptic on scenario complete ("end of episode" feel)

### 6.4 Status Bar
- [ ] Light content (white) on dark backgrounds, dark on light — matches brand palette

### 6.5 Paywall Teaser (Free Users)
- [ ] After scenario 5: subtle banner — "Unlock Your Tracey · £2.99/mo"
- [ ] Never intrusive — one tap to dismiss, stays gone for 3 days

---

## PHASE 7 — Pre-Submission Sweep
*The Day-0 guide's Phase 9 — mechanical, not emotional.*

- [ ] IAP flow tested end-to-end on real device (sandbox account)
- [ ] Restore purchases tested
- [ ] Accessibility audit: VoiceOver on, navigate entire free flow
- [ ] Privacy manifest (`PrivacyInfo.xcprivacy`) reviewed and accurate
- [ ] Legal URLs verified and reachable
- [ ] Splash screen matches app background colour exactly
- [ ] Dynamic Island / notch tested on iPhone 14 Pro or later
- [ ] Deep links tested (notification → correct scenario)
- [ ] 100 message quota tested (paid tier)
- [ ] API fallback tested (disconnect network mid-paid-conversation)
- [ ] No `console.log` in production build
- [ ] No test methods reachable in production

---

## PHASE 8 — Launch
*Goal: App Store approved, TestFlight running, first real users in.*

### 8.1 EAS Build Setup
- [ ] Configure EAS: `eas build:configure`
- [ ] Apple Developer account active (£99/yr)
- [ ] `app.json` finalised: bundle ID, version 1.0.0, build number 1
- [ ] Development build profile tested
- [ ] First production build: `eas build --platform ios --profile production`

### 8.2 App Store Listing
- [ ] **Name:** TUT!
- [ ] **Subtitle** (30 chars max): British comedy messaging
- [ ] **Description:** Written from PRD — lead with "A five-minute comedy experience that feels like your mate Tracey texting you her latest disaster." No mention of AI.
- [ ] **Keywords:** british, comedy, funny, chat, messaging, humour, sitcom, mate, banter, tracey
- [ ] **Screenshots** (iPhone 6.5" — 6 required):
  - [ ] Screenshot 1: Magic Mike scenario mid-conversation
  - [ ] Screenshot 2: Tracey's dismissal phrase landing
  - [ ] Screenshot 3: Paintball scenario ("im in a feild")
  - [ ] Screenshot 4: Notification lockscreen mockup
  - [ ] Screenshot 5: Paid tier onboarding ("Tracey's getting your number")
  - [ ] Screenshot 6: Group chat scenario ("Tara is in the chat")
  - [ ] *Source material: use existing magazine ad phone mockups from `documentaion/Tracey/`*
- [ ] **App Preview video** (optional but high-impact for comedy apps)
- [ ] **Privacy policy URL** verified
- [ ] **Support URL** verified
- [ ] **Category:** Entertainment
- [ ] **Age rating:** 12+ (mild profanity: "christ on a bike")
- [ ] **Price:** Free (with in-app purchase)

### 8.3 TestFlight Beta
- [ ] Upload first TestFlight build
- [ ] Invite 10–20 beta testers — priority: women 25–55, group chat users, British humour fans
- [ ] Feedback questions: What made you laugh? What felt flat? Did you screenshot anything? Did you want to send it to someone?
- [ ] Iterate on at least 3 scenarios based on feedback
- [ ] Fix any crashes before App Store submission

### 8.4 App Store Submission
- [ ] All metadata complete
- [ ] Privacy questionnaire answered (data collection, tracking)
- [ ] Submit for App Review
- [ ] Monitor review status
- [ ] Respond to any reviewer questions promptly
- [ ] Release 🎉

---

## PHASE 9 — Post-Launch (Ongoing)
- [ ] Monitor screenshot/share rate — primary KPI
- [ ] Monitor D1 retention (target: 60%+)
- [ ] Monitor D7 retention (target: 30%+)
- [ ] Monitor free-to-paid conversion (target: 15–25%)
- [ ] New scenario batch: +5–10 per week
- [ ] Dave character — Phase 2 product (do not build now)
- [ ] Group chat mode — Phase 2 product (do not build now)
- [ ] Android — Phase 2 (do not build now)

---

## Rules That Cannot Be Broken
- Tracey never becomes a therapist, emotional support, or wellness product
- Claude API is invisible — users must never feel like they're talking to AI
- Notifications are narrative, never promotional
- RevenueCat installed before product logic — features check `isPro` only
- Entitlement state lives in SecureStore, not AsyncStorage
- V1 ships Tracey only: no Dave, no group chat, no voice messages
- Every scenario must contain a screenshotable moment
- Ship comedy. Validate. Then scale.

---

## Quick Reference: Scenario Categories (PRD)
| Category | Target count |
|---|---|
| Booking disasters | 3–4 |
| Lost/broken phones | 2–3 |
| Group chat explosions | 3–4 |
| Brenda misunderstandings | 2–3 |
| Dave schemes | 2–3 |
| Holiday disasters | 2–3 |
| Workplace chaos | 2–3 |
| Tara collateral damage | 1–2 |
| Maureen escalations | 1–2 |
| Random absurdity | 5–10 |
| **Total** | **50–100** |

---

## Tech Stack Reference
| Layer | Tool |
|---|---|
| Framework | Expo (managed) + TypeScript |
| State | Zustand |
| Navigation | Expo Router |
| Backend | Supabase |
| AI | Claude API (paid tier, server-side only) |
| Subscriptions | RevenueCat |
| Fonts | Alfa Slab One, Anton, DM Sans, Georgia |
| Brand colours | See `documentaion/Tracey/app.jsx` → `PALETTES` |
