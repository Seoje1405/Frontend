---
name: Ongil (온길)
description: The warmest way to care for your parents' medication together
colors:
  steadfast-blue: 'oklch(54% 0.21 256)'
  steadfast-blue-light: 'oklch(97% 0.015 256)'
  steadfast-blue-medium: 'oklch(94% 0.04 256)'
  steadfast-blue-deep: 'oklch(47% 0.2 256)'
  deep-ink: 'oklch(18% 0.012 255)'
  ink-text: 'oklch(38% 0.011 255)'
  ink-subtle: 'oklch(52% 0.01 255)'
  ink-border: 'oklch(91% 0.008 255)'
  ink-muted: 'oklch(96% 0.006 255)'
  canvas: 'oklch(99% 0.004 255)'
  status-done: 'oklch(52% 0.14 155)'
  status-done-bg: 'oklch(97% 0.025 155)'
  caution-amber: 'oklch(78% 0.17 80)'
  caution-bg: 'oklch(97% 0.025 80)'
  alert-red: 'oklch(53% 0.21 27)'
  alert-bg: 'oklch(97% 0.018 27)'
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
  label:
    fontFamily: "'Pretendard Variable', Pretendard, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 500
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
    padding: '0 2rem'
    height: '3.5rem'
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
---

# Design System: Ongil (온길)

## 1. Overview

**Creative North Star: "The Caring Distance"**

Ongil exists for adult children who need to know, right now, whether their parent took their medication today. This design system bridges that distance emotionally. The moment the app opens, the information lands — and within three seconds, the user should feel the quiet relief of "they're okay."

The aesthetic is grounded in warm certainty. Trust is not built through decoration; it is built through clarity. A single Steadfast Blue used sparingly, a clean Ink neutral palette, a single typeface optimized for mobile, shadows only as functional signals — every decision follows the same principle: information first. Success is when the user forgets they are using an app.

This system explicitly rejects: hospital and pharma UI (white backgrounds with blue icons, clinical institution feel), senior-app patterns (oversized text, primary-color buttons, aggressively simplified UI), SaaS dashboard aesthetics (charts, metrics, data-analysis tool feel), and KakaoTalk/Naver clones (generic Korean platform style, indistinguishable from big-tech apps). Ongil is not a medical device, not a senior-facing app, not a productivity tool. It is a caring family member's tool.

**Key Characteristics:**

- Single Primary action color: Steadfast Blue (oklch(54% 0.21 256)); everything else is Ink Neutral
- Single typeface: Pretendard Variable; mobile-optimized scale (11px–30px)
- Flat by default; shadows are functional signals only (3-level vocabulary)
- 390px max-width mobile layout; spacing rhythm creates visual hierarchy
- Color codes map directly to time-of-day (morning/noon/night) and status (done/caution/danger)

## 2. Colors: The Steadfast Palette

A single chromatic family (Blue), two functional signal colors (Amber, Red), and a quiet Ink Neutral. Not colorful. That restraint is the source of trust.

### Primary

- **Steadfast Blue** (oklch(54% 0.21 256)): Default buttons, links, active state indicators, morning medication time indicator. Appears on ≤10% of any given screen.
- **Steadfast Blue Light** (oklch(97% 0.015 256)): Secondary button backgrounds, accent backgrounds, active state backgrounds. A diluted echo of Steadfast Blue.
- **Steadfast Blue Medium** (oklch(94% 0.04 256)): Medication color-coding (blue family) backgrounds, icon container backgrounds.
- **Steadfast Blue Deep** (oklch(47% 0.2 256)): Brand link color, medication color-coding (blue) text. The hover state of the primary button.

### Neutral

- **Deep Ink** (oklch(18% 0.012 255)): Headings, core body text. Not pure black — a very dark neutral cooled toward hue 255.
- **Ink Text** (oklch(38% 0.011 255)): Secondary body text, form labels.
- **Ink Subtle** (oklch(52% 0.01 255)): Placeholders, inactive states, supplementary information.
- **Ink Border** (oklch(91% 0.008 255)): Borders, dividers, input stroke.
- **Ink Muted** (oklch(96% 0.006 255)): Background layer 2. The page surface that contains cards.
- **Canvas** (oklch(99% 0.004 255)): Primary content area background (--surface). Not pure white — an off-white with a faint cool tint toward hue 255.

### Tertiary: Status and Semantic

- **Completion Green** (oklch(52% 0.14 155)) / BG (oklch(97% 0.025 155)): Medication taken. The color of relief. The visual implementation of PRODUCT.md's "make completion visible."
- **Caution Amber** (oklch(78% 0.17 80)) / BG (oklch(97% 0.025 80)): Noon medication time indicator, caution states.
- **Alert Red** (oklch(53% 0.21 27)) / BG (oklch(97% 0.018 27)): Missed dose alerts, night medication time indicator, destructive actions.

### Named Rules

**The One Voice Rule.** Steadfast Blue appears on ≤10% of any given screen. One button, one status, one link. More than that is already too many. Its rarity is what makes it trustworthy.

**The Tinted Neutral Rule.** Pure white (oklch(100% 0 0)) is reserved for card backgrounds only. Every page surface and background uses a neutral cooled toward hue 255.

## 3. Typography: The Single Voice

**Body Font:** Pretendard Variable (local variable font, weight range 45–920)
**Fallback:** 'Pretendard', sans-serif

**Character:** One typeface only. As a variable font, weight transitions are smooth, and it is built for Korean readability. Hierarchy is created through size, weight, and color alone. There is no second typeface.

### Hierarchy

- **Display** (700, 1.875rem/30px, lh 1.2, ls -0.025em): Onboarding screens, the single message of a key screen. Used sparingly.
- **Headline** (700, 1.4375rem/23px, lh 1.3, ls -0.02em): Page titles, section headers.
- **Title** (600, 1.1875rem/19px, lh 1.4, ls -0.01em): Card titles, important status labels.
- **Body** (400, 0.9375rem/15px, lh 1.55): Primary body text. Optimized for readability on a 390px mobile viewport.
- **Label** (500, 0.75rem/12px, lh 1.4): Status badges, metadata, timestamps.
- **Small Label** (400–500, 0.6875rem/11px, lh 1.4): Highly supplementary context text.

### Named Rules

**The Single Typeface Rule.** Pretendard only. Never add a second typeface.

**The Negative Tracking Rule.** All text at 1.1875rem (19px) and above gets negative letter-spacing: title -0.01em; headline -0.02em; display -0.025em. Prevents large text from feeling loose.

## 4. Elevation

This system is flat by default. Tonal background layering (Ink Muted → Canvas → Card White) creates baseline depth, and shadows are applied only to elements that can be physically lifted. A shadow means "this can be tapped" or "this is floating" — not decoration.

### Shadow Vocabulary

- **shadow-card** (`0 1px 4px oklch(16% 0.04 255 / 0.08), 0 0 1px oklch(16% 0.04 255 / 0.06)`): Information cards, content containers. Nearly imperceptible separation.
- **shadow-raised** (`0 4px 16px oklch(16% 0.04 255 / 0.12), 0 1px 4px oklch(16% 0.04 255 / 0.08)`): Modals, sheets, drawers. Signals a layer clearly elevated above the background.
- **shadow-fab** (`0 4px 12px oklch(54% 0.21 256 / 0.3)`): Floating action buttons, primary CTAs. Carries a Steadfast Blue tint in the shadow to draw attention.

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
- **Focus:** ring-1 (Steadfast Blue 1px ring), shown on focus-visible only

### Cards / Containers

The basic unit for containing information. Nesting is prohibited.

- **Corner Style:** rounded-xl (0.75rem/12px)
- **Background:** oklch(100% 0 0) card white or Canvas (oklch(99% 0.004 255))
- **Shadow:** shadow-card at rest; shadow-raised is for modals and drawers only
- **Border:** None on the card itself; internal dividers use Ink Border (oklch(91% 0.008 255))
- **Internal Padding:** p-6 (1.5rem) default; p-4 (1rem) allowed in compact mobile layouts

### Inputs / Fields

- **Style:** Ink Border stroke (1px), Canvas background, rounded-md (0.625rem)
- **Focus:** border-color transitions to Steadfast Blue, ring-1 ring-primary (Steadfast Blue 1px)
- **Disabled:** opacity-50, pointer-events-none
- **Error:** Alert Red border + ring

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
