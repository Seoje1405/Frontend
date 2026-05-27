# Product

## Register

product

## Users

**Primary User: Caregiver (adult child)**
An adult child who wants to manage their parent's medication schedule but cannot check in person every day. Comfortable with smartphone apps, they check in during spare moments — commuting, a quick break at work. They want the relief of knowing "I'm taking care of them" amid the worry and guilt about their parent's health.

**Secondary User: Parent (recipient)**
Does not use the app directly — only receives phone call reminders. The benchmark is phone-answering ability, not smartphone proficiency.

## Product Purpose

A service where caregivers register their parent's medications and verify adherence through meal-time-based phone call reminders. Success metric: the caregiver knows whether their parent took their medication today without even opening the app. When they do open it, they should grasp the current status at a glance and take any needed action immediately.

## Brand Personality

Warmth · Trust · Simplicity

A service from a child to their parent. A caregiving tool, not a medical instrument. Not cold like a hospital — warm like a holiday greeting — while keeping information accurate and free of clutter.

## Anti-references

- **Hospital app feel** — Cold, rigid medical UI like Samsung Seoul Hospital or National Health Insurance apps. White + blue palette, excessive information density, institutional tone.
- **Elderly app feel** — The target user is the adult child caregiver, not the parent. Large text, high contrast, oversimplified silver-care UI is forbidden. Anything that treats the user like a senior citizen.
- **SaaS / dashboard feel** — The cold efficiency of B2B productivity tools like Linear or Notion. Charts, metrics, sidebars. This is a personal caregiving space.

## Design Principles

1. **The Feel of Care** — The entire interface should convey "a child giving this to their parent." Functionally perfect but emotionally cold is a failure.
2. **One Thing, Right Now** — Today's medication status, the action needed now. Historical data and analytics stay in the background. The home screen is a today-board, not a dashboard.
3. **Quiet Confidence** — Medication and medical information should be clear without amplifying anxiety. Guidance over warnings, soft emphasis over red alerts.
4. **One Hand, One Glance** — Caregivers check the app briefly while commuting or at work. All critical information should be reachable without scrolling or with a single gesture.
5. **Precise Without Clutter** — Drug name, dosage frequency, time of day. Nothing decorative, nothing missing. One label beats a paragraph of explanation.

## Accessibility & Inclusion

- Target: WCAG AA (mobile-first)
- `prefers-reduced-motion` supported (already in globals.css)
- `viewport-fit: cover` — handles notch / home indicator areas
- No special elderly accessibility requirements — target user is the adult child caregiver
- Korean-only, single-language service
