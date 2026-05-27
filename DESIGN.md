---
name: Ongil (온길)
description: A warm, nurturing medication management service for families.
colors:
  primary: 'oklch(54% 0.21 256)'
  primary-deep: 'oklch(43% 0.20 257)'
  primary-dim: 'oklch(94% 0.04 256)'
  bg: 'oklch(98.5% 0.006 255)'
  surface: 'oklch(99% 0.004 255)'
  ink-strong: 'oklch(18% 0.012 255)'
  ink-mid: 'oklch(38% 0.011 255)'
  ink-soft: 'oklch(52% 0.01 255)'
  ink-3: 'oklch(70% 0.007 255)'
  line: 'oklch(89% 0.009 255)'
  danger: 'oklch(53% 0.21 27)'
typography:
  display:
    fontFamily: 'Geist Sans, Pretendard, sans-serif'
    fontSize: '28px'
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: 'Geist Sans, Pretendard, sans-serif'
    fontSize: '20px'
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: 'Geist Sans, Pretendard, sans-serif'
    fontSize: '15px'
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: 'Geist Sans, Pretendard, sans-serif'
    fontSize: '13px'
    fontWeight: 500
    lineHeight: 1.4
rounded:
  md: '20px'
  lg: '24px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    rounded: '{rounded.md}'
    padding: '16px 24px'
  button-primary-hover:
    backgroundColor: '{colors.primary-deep}'
  input-standard:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.md}'
    padding: '14px 16px'
---

# Design System: Ongil (온길)

## 1. Overview

**Creative North Star: "The Digital Care-Package"**

Ongil is designed to feel like a warm, personal gift from a child to their parent. It rejects the cold, institutional sterility of typical medical applications in favor of a nurturing and supportive environment. The interface is optimized for one-handed use, ensuring caregivers can check in on their parents' health with a single glance during their busy day.

**Key Characteristics:**

- **Nurturing Warmth:** Soft, tinted neutrals and a focused primary accent.
- **Immediate Clarity:** One primary focal point per screen.
- **Thumb-Optimized:** All critical actions are within easy reach.
- **Quiet Confidence:** Calm, reassuring feedback without anxiety-inducing alerts.

## 2. Colors

The palette is anchored by a calming primary blue and supported by warm, tinted neutrals that avoid the harshness of pure white.

### Primary

- **Ongil Blue** (oklch(54% 0.21 256)): Used for primary actions, focus states, and key brand moments. It should cover ≤10% of any given screen.

### Neutral

- **Warm Canvas** (oklch(98.5% 0.006 255)): The main application background.
- **Ink Strong** (oklch(18% 0.012 255)): Used for primary headlines and titles.
- **Ink Mid** (oklch(38% 0.011 255)): Used for secondary body text.

**The Rarity Rule.** The primary accent is used sparingly. Its rarity is what gives it authority and warmth without feeling clinical.

## 3. Typography

**Display Font:** Geist Sans (with Pretendard fallback)
**Body Font:** Geist Sans

The typography is clean and modern, prioritizing legibility and a friendly tone.

### Hierarchy

- **Display** (700, 28px, 1.25): Used for main page headers. Max 1 per page.
- **Title** (600, 20px, 1.3): Used for section headers and card titles.
- **Body** (400, 15px, 1.55): Used for all primary reading content.
- **Label** (500, 13px, 1.4): Used for meta-information, time labels, and small UI elements.

## 4. Elevation

Ongil uses a **Soft Ambient** elevation philosophy. While the UI is mostly flat and tonal, diffuse shadows are used to provide depth for overlay elements like bottom sheets, modals, and primary action buttons.

### Shadow Vocabulary

- **Sheet Shadow** (`box-shadow: 0 -4px 24px oklch(0% 0 0 / 0.08)`): Used for bottom sheets and floating menus.
- **Action Shadow** (`box-shadow: 0 4px 12px oklch(54% 0.21 256 / 0.15)`): Used to give primary buttons a gentle lift.

## 5. Components

Interaction elements in Ongil are designed to feel tactile and personal, with "Soft & Pill-like" rounding.

### Buttons

- **Shape:** Highly rounded pill-like corners (20px radius).
- **Primary:** High-contrast Ongil Blue background with white text.
- **Hover / Focus:** Shifts to a deeper primary shade with a soft outer glow.

### Inputs / Fields

- **Style:** Subtle border (oklch(89% 0.009 255)) on a warm surface.
- **Focus:** Border shifts to primary blue with a 1px inner ring.

## 6. Do's and Don'ts

### Do:

- **Do** use OKLCH for all color definitions to maintain perceptual uniformity.
- **Do** ensure all primary buttons are full-width (`w-full`) for easy thumb access.
- **Do** limit weight combinations to `[400+600]` or `[400+700]`.

### Don't:

- **Don't** use pure black (#000) or pure white (#FFF).
- **Don't** use "Silver Care" presets or jumbo text that might patronize the user.
- **Don't** use cold, clinical blue-and-white grids typical of hospital apps.
- **Don't** use side-stripe borders as accents; use tonal backgrounds instead.
