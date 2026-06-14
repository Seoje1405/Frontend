---
name: Ongil (온길)
description: 멀리 있어도 곁에 있는 것 같은 복약 관리 서비스
colors:
  # Primary — Steadfast Blue family
  steadfast-blue: 'oklch(54% 0.21 256)'
  steadfast-blue-light: 'oklch(97% 0.015 256)'
  steadfast-blue-medium: 'oklch(94% 0.04 256)'
  steadfast-blue-deep: 'oklch(47% 0.2 256)'
  steadfast-blue-deeper: 'oklch(38% 0.17 256)'
  # Neutral — Ink scale (cool-gray, hue 255)
  canvas: 'oklch(99% 0.004 255)'
  surface-2: 'oklch(98.5% 0.006 255)'
  ink-muted: 'oklch(96% 0.006 255)'
  ink-border: 'oklch(91% 0.008 255)'
  ink-avatar: 'oklch(84% 0.008 255)'
  ink-icon-inactive: 'oklch(70% 0.007 255)'
  ink-subtle: 'oklch(52% 0.01 255)'
  ink-text: 'oklch(38% 0.011 255)'
  deep-ink: 'oklch(18% 0.012 255)'
  # Status and semantic
  status-done: 'oklch(52% 0.14 155)'
  status-done-bg: 'oklch(97% 0.025 155)'
  caution-amber: 'oklch(78% 0.17 80)'
  caution-bg: 'oklch(97% 0.025 80)'
  alert-red: 'oklch(53% 0.21 27)'
  alert-bg: 'oklch(97% 0.018 27)'
  # Medication color tags
  med-blue: 'oklch(47% 0.2 256)'
  med-blue-bg: 'oklch(94% 0.04 256)'
  med-purple: 'oklch(52% 0.18 290)'
  med-purple-bg: 'oklch(94% 0.04 290)'
  med-orange: 'oklch(58% 0.18 50)'
  med-orange-bg: 'oklch(95% 0.04 50)'
typography:
  display:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '1.875rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.025em'
  headline:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '1.4375rem'
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: '-0.02em'
  title:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '1.1875rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '-0.01em'
  body:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1.4
  small-label:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '0.6875rem'
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: '0.5rem'
  md: '0.625rem'
  lg: '0.75rem'
  xl: '1rem'
  2xl: '1.25rem'
  3xl: '1.375rem'
spacing:
  xs: '0.5rem'
  sm: '0.75rem'
  md: '1rem'
  lg: '1.5rem'
  xl: '2rem'
components:
  button-primary:
    backgroundColor: '{colors.steadfast-blue}'
    textColor: 'oklch(100% 0 0)'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
    height: '2.25rem'
  button-primary-hover:
    backgroundColor: '{colors.steadfast-blue-deep}'
  button-cta:
    backgroundColor: '{colors.steadfast-blue}'
    textColor: 'oklch(100% 0 0)'
    rounded: '{rounded.2xl}'
    padding: '0 1.5rem'
    height: '3.5rem'
    width: '100%'
  button-outline:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.deep-ink}'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
    height: '2.25rem'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.deep-ink}'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
    height: '2.25rem'
  button-icon:
    backgroundColor: 'transparent'
    rounded: '{rounded.md}'
    width: '2.25rem'
    height: '2.25rem'
  bottom-nav-disc:
    backgroundColor: '{colors.steadfast-blue}'
    textColor: 'oklch(100% 0 0)'
    rounded: '9999px'
    width: '2.75rem'
    height: '2.75rem'
---

# Design System: Ongil (온길)

## 1. Overview

**Creative North Star: "The Caring Distance"**

Ongil exists for adult children who need to know, right now, whether their parent took their medication today. This design system bridges that distance emotionally. The moment the app opens, the information lands — and within three seconds, the user should feel the quiet relief of "they're okay."

The aesthetic is grounded in warm certainty. Trust is not built through decoration; it is built through clarity. A single Steadfast Blue used sparingly, a clean Ink neutral palette, a single typeface optimized for mobile, shadows only as functional signals — every decision follows the same principle: information first. Success is when the user forgets they are using an app.

This system explicitly rejects: hospital and pharma UI (white backgrounds with blue icons, clinical institution feel), senior-app patterns (oversized text, primary-color buttons, aggressively simplified UI), SaaS dashboard aesthetics (charts, metrics, data-analysis tool feel), and KakaoTalk/Naver clones (generic Korean platform style, indistinguishable from big-tech apps). Ongil is not a medical device, not a senior-facing app, not a productivity tool. It is a caring family member's tool.

The implementation layer is shadcn/ui primitives (Button, Card, Dialog, Drawer, Sheet) restyled to these tokens via Tailwind CSS v4's `@theme inline`. The View Transitions API is active for app shell continuity: the header and bottom nav persist visually across navigations. iOS safe area insets protect content from notch and home indicator overlap.

**Key Characteristics:**

- Single primary action color: Steadfast Blue (oklch(54% 0.21 256)); everything else is Ink Neutral
- Single typeface: Pretendard Variable; mobile-optimized 8-step scale (11px–30px)
- Flat by default; three shadow levels for tappable and floating elements only
- Three-layer surface hierarchy: Card White (100%) → Canvas (99%) → Surface-2 (98.5%)
- 390px max-width mobile layout; spacing rhythm creates visual hierarchy
- Color codes map directly to time-of-day (morning/noon/night) and status (done/caution/danger)
- Seven-level z-index vocabulary for predictable layer stacking
- `kr-wrap` utility enforces Korean word-break rules across all paragraph and list text

## 2. Colors: The Steadfast Palette

A single chromatic family (Blue), two functional signal colors (Amber, Red), and a quiet Ink Neutral. Not colorful. That restraint is the source of trust.

### Primary

- **Steadfast Blue** (oklch(54% 0.21 256)): Default buttons, links, active state indicators, morning medication time indicator, active navigation icons, selected calendar day background. Appears on ≤10% of any given screen.
- **Steadfast Blue Light** (oklch(97% 0.015 256)): Secondary button backgrounds, accent backgrounds, hover state fills, active state backgrounds. A diluted echo of Steadfast Blue.
- **Steadfast Blue Medium** (oklch(94% 0.04 256)): Medication color-coding (blue family) backgrounds, icon container backgrounds.
- **Steadfast Blue Deep** (oklch(47% 0.2 256)): Brand link color, account switcher text, chevron icon color, medication color-coding (blue) text. The hover state of the primary button.
- **Steadfast Blue Deeper** (oklch(38% 0.17 256)): Text color on Steadfast Blue Light accent backgrounds (e.g., accent chip labels, accent-foreground).

### Neutral

The Ink scale runs from near-black to near-white, every step tinted toward hue 255. Use the correct layer for the correct surface depth.

- **Card White** (oklch(100% 0 0)): Card interiors only. Pure white is reserved strictly for card backgrounds — never for page surfaces or app shell.
- **Canvas** (oklch(99% 0.004 255)): The primary content area. The 390px max-width zone. Faintly cooler than pure white.
- **Surface-2 / App Shell** (oklch(98.5% 0.006 255)): Page background outside the content zone, header bar background, bottom navigation background. Slightly deeper than Canvas, creating the "lifted paper" effect: content rises off the shell.
- **Ink Muted** (oklch(96% 0.006 255)): Secondary content backgrounds, muted section fills.
- **Ink Border** (oklch(91% 0.008 255)): Borders, dividers, input stroke, hairline separators.
- **Ink Avatar** (oklch(84% 0.008 255)): Avatar and icon container placeholder fills.
- **Ink Icon Inactive** (oklch(70% 0.007 255)): Inactive bottom navigation tab icons and labels.
- **Ink Subtle** (oklch(52% 0.01 255)): Placeholders, inactive state text, supplementary information.
- **Ink Text** (oklch(38% 0.011 255)): Secondary body text, form labels, icon-only action buttons (e.g., notification bell).
- **Deep Ink** (oklch(18% 0.012 255)): Headings, core body text. Not pure black — a very dark neutral cooled toward hue 255.

### Tertiary: Status and Semantic

- **Completion Green** (oklch(52% 0.14 155)) / BG (oklch(97% 0.025 155)): Medication taken. The color of relief. The visual implementation of PRODUCT.md's "make completion visible."
- **Caution Amber** (oklch(78% 0.17 80)) / BG (oklch(97% 0.025 80)): Noon medication time indicator, caution states.
- **Alert Red** (oklch(53% 0.21 27)) / BG (oklch(97% 0.018 27)): Missed dose alerts, night medication time indicator, destructive actions.

### Named Rules

**The One Voice Rule.** Steadfast Blue appears on ≤10% of any given screen. One button, one status, one link. More than that is already too many. Its rarity is what makes it trustworthy.

**The Tinted Neutral Rule.** Pure white (oklch(100% 0 0)) is reserved for card backgrounds only. Every page surface uses a neutral cooled toward hue 255. There are three distinct surface levels; use the right one for the right layer.

**The Lifted Paper Rule.** Canvas (99%) sits inside Surface-2 (98.5%): the content zone is lighter than the app shell. This half-step of contrast creates depth between the content area and its frame without any shadow or border. If you flatten them to the same value, the depth disappears.

## 3. Typography: The Single Voice

**Body Font:** Pretendard Variable (local variable font, weight range 45–920)
**Fallback:** 'Pretendard', sans-serif

**Character:** One typeface only. As a variable font, weight transitions are smooth, and it is built for Korean readability. Hierarchy is created through size, weight, and color alone. There is no second typeface.

### Hierarchy

Eight steps optimized for a 393pt mobile viewport:

- **Display** (700, 1.875rem/30px, lh 1.2, ls -0.025em): Onboarding screens, the single message of a key screen. Used sparingly.
- **Headline** (700, 1.4375rem/23px, lh 1.3, ls -0.02em): Page titles, section headers. A 1.625rem/26px variant (same weight and tracking) is available for prominent section headers when the headline-to-display gap is too large.
- **Title** (600, 1.1875rem/19px, lh 1.4, ls -0.01em): Card titles, important status labels.
- **Body** (400, 0.9375rem/15px, lh 1.55): Primary body text. Optimized for readability on a 390px mobile viewport.
- **Caption** (400, 0.8125rem/13px, lh 1.45): Secondary descriptive text, card subtitle text, supplementary metadata below a primary value.
- **Label** (500, 0.75rem/12px, lh 1.4): Status badges, timestamps, chip text.
- **Small Label** (400–500, 0.6875rem/11px, lh 1.4): Bottom navigation labels, calendar day-of-week indicators, highly supplementary context text.

### Named Rules

**The Single Typeface Rule.** Pretendard only. Never add a second typeface.

**The Negative Tracking Rule.** All text at 1.1875rem (19px) and above gets negative letter-spacing: title -0.01em; headline -0.02em; display -0.025em. Prevents large text from feeling loose.

**The Korean Wrap Rule.** Paragraphs, list items, and definition lists get `word-break: keep-all; overflow-wrap: anywhere` via the `kr-wrap` utility class. Korean text must not break mid-word. Apply `kr-wrap` explicitly rather than relying on browser defaults.

## 4. Elevation

This system is flat by default. The three-layer tonal surface hierarchy (Surface-2 → Canvas → Card White) creates baseline depth without any shadows. Shadows appear only on elements that are physically tappable or floating above the surface — never as decoration.

### Shadow Vocabulary

- **shadow-card** (`0 1px 4px oklch(16% 0.04 255 / 0.08), 0 0 1px oklch(16% 0.04 255 / 0.06)`): Information cards, content containers. Nearly imperceptible separation from the canvas surface.
- **shadow-raised** (`0 4px 16px oklch(16% 0.04 255 / 0.12), 0 1px 4px oklch(16% 0.04 255 / 0.08)`): Modals, sheets, drawers. Signals a layer clearly elevated above the background.
- **shadow-fab** (`0 4px 12px oklch(54% 0.21 256 / 0.3)`): Floating action buttons, CTA buttons, the bottom nav registration disc, selected calendar day buttons. Carries a Steadfast Blue tint in the shadow to draw attention.

### Z-Index Vocabulary

Seven named layers for predictable stacking. Every z-index in the codebase must reference one of these names.

- **z-base (0)**: Default in-flow elements.
- **z-raised (10)**: Slightly elevated in-page elements (popovers, inline tooltips).
- **z-dropdown (100)**: Menus, autocomplete suggestions.
- **z-sticky (200)**: App header, sticky page headers.
- **z-overlay (300)**: Semi-transparent page overlays behind modals.
- **z-modal (400)**: Modal dialogs, full-screen sheets, drawers.
- **z-toast (500)**: Toast notifications. Always top of stack.

### View Transitions

`@view-transition { navigation: auto }` is active globally. Two shell elements carry named transitions: `app-header` (`view-transition-name: app-header`) and `bottom-nav` (`view-transition-name: bottom-nav`). New component-level transitions must use unique names; these two are reserved.

### Named Rules

**The Functional Shadow Rule.** There are exactly three shadows: shadow-card, shadow-raised, shadow-fab. No arbitrary shadows are added. Do not apply shadow-card to elements that are not cards.

## 5. Components

### Buttons

Gently rounded but never soft. Primary is Steadfast Blue alone; everything else steps quietly back.

- **Shape:** Default rounded-md (0.625rem/10px); CTA uses rounded-2xl (1.25rem/20px)
- **Primary:** Steadfast Blue background, white text, h-9 (2.25rem), px-4 py-2; transitions to Steadfast Blue Deep on hover
- **CTA (full-width Primary):** rounded-2xl, h-14 (3.5rem), w-full, shadow-fab, font-bold; one per screen maximum
- **Destructive:** Alert Red background, white text
- **Outline:** Ink Border stroke (1px), Canvas background; Steadfast Blue Light background on hover
- **Ghost:** No background; Steadfast Blue Light background on hover
- **Icon:** Square h-9 w-9 (2.25rem × 2.25rem), rounded-md; no background by default; used for icon-only actions
- **Small (sm):** h-8 (2rem), px-3, text-xs, rounded-md; for compact inline actions where h-9 is too tall
- **Focus:** ring-1 (Steadfast Blue 1px ring), shown on focus-visible only

### Cards / Containers

The basic unit for containing information. Nesting is prohibited.

- **Corner Style:** rounded-xl (0.75rem/12px)
- **Background:** oklch(100% 0 0) card white
- **Shadow:** shadow-card at rest; shadow-raised is for modals and drawers only
- **Border:** None on the card itself; internal dividers use Ink Border (oklch(91% 0.008 255))
- **Internal Padding:** p-6 (1.5rem) default; p-4 (1rem) allowed in compact mobile layouts

### Current Status Card (홈 복약 현황 카드)

홈 화면 최상단에 오늘 복약 현황을 요약하는 히어로 카드. **의도된 다크 배경 변형**으로, 일반 Card White 규칙의 유일한 예외다. 배경의 어두운 색이 Canvas로부터의 분리를 자체적으로 형성하므로 shadow를 사용하지 않는다.

- **Background:** `--card-current` (Steadfast Blue Deeper: `oklch(38% 0.17 256)`) — 배경이 Canvas보다 어두워 그림자 없이도 계층이 형성됨
- **Primary Text:** `--card-current-text` (`var(--ink-50)`, `oklch(98.5% 0.006 255)`) — 메인 숫자 및 상태 접미사
- **Muted Text:** `--card-current-text-muted` (`var(--ink-300)`, `oklch(84% 0.008 255)`) — 환자명 캡션, 다음 복용 안내
- **Progress Track:** `--card-current-track` (`oklch(100% 0 0 / 20%)`) — 진행 바 배경
- **Progress Fill:** `status-done-bright` (`oklch(79% 0.19 151)`) — 완료 수량 표시
- **Shadow:** 없음 — 다크 배경이 Canvas(99%)로부터의 시각적 분리를 자체 제공
- **Corner:** rounded-xl (0.75rem); **Padding:** p-6 (1.5rem)
- **Semantic:** `<article aria-label="{patientName}님 복약 현황">` — 스크린 리더 랜드마크

**구조 (위에서 아래):**

1. 환자명 캡션 — `text-sm text-card-current-text-muted`
2. 복약 수 + 상태 접미사 — Display(text-4xl, 700) + Title(text-xl, 600), 모두 `text-card-current-text`
3. 진행 바 — `role="progressbar"` with `aria-valuenow/min/max/label`
4. 다음 복용 안내 (pending/partial 상태에서만) — `text-sm text-card-current-text-muted`

### Inputs / Fields

- **Style:** Ink Border stroke (1px), Canvas background, rounded-md (0.625rem)
- **Focus:** border-color transitions to Steadfast Blue, ring-1 ring-primary (Steadfast Blue 1px)
- **Disabled:** opacity-50, pointer-events-none
- **Error:** Alert Red border + ring

### App Header

The persistent top navigation bar. Anchored at z-sticky (200), spanning the full viewport width.

- **Background:** Surface-2 (oklch(98.5% 0.006 255)); visually continuous with the app shell layer
- **Border:** 1px bottom border in Ink Border; no shadow
- **Padding:** px-4.5 (1.125rem) horizontal; pt accounts for `env(safe-area-inset-top)` + 1rem; pb-3 (0.75rem)
- **Account Switcher (left):** Avatar circle in Ink Avatar (oklch(84% 0.008 255)); account name in Steadfast Blue Deep; chevron in Steadfast Blue Deep; min-h-[44px] tap target; hover opacity-80
- **Notification Bell (right):** Bell icon in Ink Text (oklch(38% 0.011 255)); -m-2.5 p-2.5 expands tap target to 44px; hover opacity-80
- **View Transition:** `view-transition-name: app-header`

### Bottom Navigation

Five-tab persistent bottom navigation. Anchored to the bottom of the viewport.

- **Background:** Card white (oklch(100% 0 0)); 1px top border in Ink Border
- **Bottom Padding:** `max(0.75rem, env(safe-area-inset-bottom))` for home indicator clearance on iOS
- **Tab (default):** Icon 26px strokeWidth 1.9; Small Label (0.6875rem) font-semibold; inactive: Ink Icon Inactive; active and hover: Steadfast Blue; transition on color
- **Disc CTA (center — 등록하기):** Filled circle size-11 (2.75rem), Steadfast Blue background, shadow-fab, white icon 21px strokeWidth 2.4; label in Small Label, Steadfast Blue, font-bold. The only element in the nav that carries shadow-fab.
- **Tap Targets:** min-h-11 min-w-14 (44px × 56px) for all tabs
- **Focus:** ring-2 ring-primary on all tab items via focus-visible
- **View Transition:** `view-transition-name: bottom-nav`

### Week Strip

A 7-day calendar row for date selection. Implements roving tabindex for keyboard arrow-key navigation.

- **Container:** Horizontal flex, gap-1.5, px-4, pt-4, pb-2.5
- **Day Button (default):** flex-1, rounded-xl, 1px border in Ink Border, Card White background; hover: border-primary, Steadfast Blue Light background
- **Day Button (today, unselected):** ring-1 ring-inset ring-primary/40; day name and date in Steadfast Blue
- **Day Button (selected):** Steadfast Blue background, border-primary, shadow-fab; all text and dot in white
- **Day Name:** Small Label (0.6875rem), font-semibold; Ink Subtle → Steadfast Blue (today/hover) → white (selected)
- **Date Number:** Body size (0.9375rem), font-bold; Deep Ink → Steadfast Blue (today/hover) → white (selected)
- **Medication Dot:** 4px circle (size-1). Always rendered (prevents layout shift). White when selected; Steadfast Blue when the date has a medication schedule; transparent otherwise.
- **Keyboard:** ArrowLeft / ArrowRight move selection. Only the selected button has tabIndex=0 (roving tabindex).
- **ARIA:** role="radiogroup" on container; role="radio" aria-checked on each button; aria-current="date" on today.

### Status Badges

The core component for communicating medication status at a glance. Always used as a color + text label pair.

- **Done:** Completion Green text / Completion Green BG; rounded-full; text-xs; font-medium
- **Active (pending):** Steadfast Blue text / Steadfast Blue Light background
- **Caution:** Caution Amber text / Caution BG background
- **Danger / Missed:** Alert Red text / Alert BG background

### Meal Time Indicators

Morning (Steadfast Blue) · Noon (Caution Amber) · Night (Alert Red). Color codes distinguish time slots intuitively. Color is never used alone: text labels ("아침", "점심", "저녁") are always displayed alongside (WCAG 2.1 AA).

### Medication Color Tags

Color-coding for drug categories: Blue (oklch(47% 0.2 256) / oklch(94% 0.04 256)), Purple (oklch(52% 0.18 290) / oklch(94% 0.04 290)), Orange (oklch(58% 0.18 50) / oklch(95% 0.04 50)). Each color is a paired foreground/background set. Maximum three colors. These carry no medical meaning — they are identifiers only.

## 6. Do's and Don'ts

### Do:

- **Do** use Steadfast Blue (oklch(54% 0.21 256)) on a single primary action per screen. Its rarity is what makes it trustworthy.
- **Do** represent a completed dose with Completion Green (oklch(52% 0.14 155)) and a missed dose with Alert Red (oklch(53% 0.21 27)). Color codes only work when they are consistent.
- **Do** build text hierarchy through Pretendard size, weight, and color variation only. There is no second typeface.
- **Do** use only h-9 (2.25rem) for standard buttons and h-14 (3.5rem) for CTAs. No arbitrary in-between sizes.
- **Do** choose from shadow-card, shadow-raised, or shadow-fab based on context. These are the only three shadows.
- **Do** pair every status color with a text label (WCAG 2.1 AA — never communicate meaning through color alone).
- **Do** apply negative letter-spacing to all text at 1.1875rem (19px) and above.
- **Do** use `kr-wrap` on all paragraph, list, and definition text. Korean must not break mid-word.
- **Do** account for iOS safe area insets: use `env(safe-area-inset-top)` in the header and `env(safe-area-inset-bottom)` in the bottom nav.
- **Do** assign a unique `view-transition-name` to any element that participates in cross-page transitions. The names `app-header` and `bottom-nav` are reserved.
- **Do** add new z-index values only by naming them in the seven-level vocabulary; update this spec when a new layer is added.

### Don't:

- **Don't** recreate hospital or pharma UI with white backgrounds and blue icons. This is an explicitly rejected reference.
- **Don't** use oversized text or rows of primary-color buttons as in senior-app patterns.
- **Don't** borrow the aesthetic of SaaS dashboards — charts, metrics, data-analysis tool feel.
- **Don't** follow the generic Korean platform style of KakaoTalk or Naver. Ongil's quiet warmth is its own.
- **Don't** nest cards. A card inside a card is always wrong.
- **Don't** use border-left greater than 1px as a colored accent stripe.
- **Don't** combine background-clip: text with a gradient. Solid-color text only.
- **Don't** repeat identically sized cards with icon + heading + description in an endless grid.
- **Don't** reach for a modal as the first choice. Exhaust inline or progressive disclosure alternatives first.
- **Don't** use purposeless glassmorphism (blur + translucent cards).
- **Don't** use z-index values outside the seven-level vocabulary. Undocumented stacking values cause collisions that are painful to debug.
