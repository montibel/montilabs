# DESIGN.md — Tutorial Banca Digital (Fintech)

## 1. Visual Theme

Dark fintech — deep near-black backgrounds (`#08090F`, `#0F172A`) with a single teal/cyan accent (`#06B6D4`) that signals action and progress. The phone device is the hero of every scene; everything else — text, captions, ambient glow — exists to frame it. Hierarchy is achieved through weight and luminosity, never through color changes. Green/red are strictly reserved for financial data states (income vs. expense). The mood is premium mobile banking: confident, clean, forward-looking.

---

## 2. Quick Reference

### Colors

- **Deep Black** (`#08090F`): Primary background — full-bleed scene base
- **Deep Navy** (`#0F172A`): Phone screen background, secondary surface
- **Dark Slate** (`#1E293B`): Card backgrounds inside phone UI
- **Teal Cyan** (`#06B6D4`): Primary accent — step labels, progress dots, glows, CTAs
  - On Deep Black: 5.9:1 ✅ — usable for text and UI
  - On Deep Navy: 5.4:1 ✅
- **Pure White** (`#FFFFFF`): Headlines, primary text
  - On Deep Black: 21:1 ✅
- **Light Slate** (`#F1F5F9`): Body text, secondary labels
  - On Deep Black: 18.7:1 ✅ — On Dark Slate: 13.1:1 ✅
- **Muted Blue-Gray** (`#94A3B8`): Metadata, timestamps, helper text
  - On Deep Black: 5.3:1 ✅ — On Deep Navy: 4.9:1 ✅
- **Success Green** (`#10B981`): Income amounts only — never as text on dark bg without sufficient size
  - On Deep Black: 5.7:1 ✅ (large text only)
- **Expense Red** (`#EF4444`): Expense amounts only
  - On Deep Black: 4.5:1 ✅ (large text ≥18px)
- **Blue** (`#3B82F6`): Gradient accent for buttons inside phone UI

### Fonts

- **Display / Headlines:** `"Inter"` 800 — step titles, hero text
  - File: `capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf`
- **UI Labels / Step numbers:** `"Inter"` 700
  - File: `capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf`
- **Body / Captions:** `"Inter"` 600 / 400
  - 600: `capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf`
  - 400: `capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf`
- **Fallback:** `-apple-system, BlinkMacSystemFont, Arial, sans-serif`

**`@font-face` block (copy verbatim into every composition):**

```css
@font-face {
  font-family: "Inter";
  src: url("../../capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf") format("truetype");
  font-weight: 800;
  font-display: block;
}
@font-face {
  font-family: "Inter";
  src: url("../../capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf") format("truetype");
  font-weight: 700;
  font-display: block;
}
@font-face {
  font-family: "Inter";
  src: url("../../capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf") format("truetype");
  font-weight: 600;
  font-display: block;
}
@font-face {
  font-family: "Inter";
  src: url("../../capture/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf") format("truetype");
  font-weight: 400;
  font-display: block;
}
```

---

## 3. Component Stylings

#### Phone Device Frame

- **Outer shell:** `linear-gradient(160deg, #2a2a2e, #18181b)`, `border-radius: 13.5%`
- **Screen:** `#0f172a` background, `border-radius: 11%`
- **Aspect ratio:** `280 / 580` (portrait)
- **Size in video:** dominant — fills ~48% of frame height, centered or slightly right
- **Glow:** `box-shadow: 0 0 80px rgba(6,182,212,0.15), 0 40px 100px rgba(0,0,0,0.6)` — subtle teal halo

#### Step Label Chip

- **Background:** `rgba(6,182,212,0.12)`
- **Border:** `1px solid rgba(6,182,212,0.3)`
- **Text:** `#06B6D4`, Inter 700, 11px, letter-spacing 0.12em, UPPERCASE
- **Padding:** `6px 14px`, `border-radius: 20px`

#### Step Title

- **Font:** Inter 800, 36–48px, `#FFFFFF`
- **Letter-spacing:** -0.025em
- **Line-height:** 1.15

#### Step Body

- **Font:** Inter 400, 16px, `#94A3B8`
- **Line-height:** 1.6

#### Progress Dots

- **Active:** `#06B6D4`, scale 1.4×
- **Done:** `rgba(6,182,212,0.35)`
- **Inactive:** `rgba(255,255,255,0.15)`
- **Size:** 7px diameter, gap 8px

#### Ambient Glow (background)

- Soft radial glow behind phone: `radial-gradient(ellipse at 65% 50%, rgba(6,182,212,0.08) 0%, transparent 60%)`
- Never a hard vignette — always feathered

---

## 4. Spacing & Layout

#### Spacing scale

**Base unit:** `8px`

| Token | Value  | Used for                              |
|-------|--------|---------------------------------------|
| xs    | `4px`  | Dot gaps, tight inline spacing        |
| sm    | `8px`  | Label-to-title gap                    |
| md    | `16px` | Title-to-body gap                     |
| lg    | `32px` | Caption block padding                 |
| xl    | `60px` | Section separation                    |

#### Border-radius scale

- `4px`: Small badges
- `8px`: Transaction cards inside phone
- `12px`: Action quick-access items
- `20px`: Step label chips
- `9999px`: PIN dots, progress indicators
- `13.5%`: Phone outer shell

#### Whitespace philosophy

Generous dark space is the primary visual element. The phone is centered with at minimum 15% breathing room on all sides. Caption text sits in the bottom third, never competing with the phone. Never crowd the frame — the dark background is active design.

---

## 5. Iteration Guide

1. **Phone is always the hero.** It occupies center stage at 45–50% of frame height. Every other element (caption text, glows, dots) serves to frame it — nothing competes.

2. **Teal `#06B6D4` is the only accent color.** Step numbers, progress dots, label chips, interactive highlights inside the phone — all teal. No other color signals "active" or "important."

3. **Typography uses Inter exclusively.** Headlines 800/36–48px in `#FFFFFF`. Step labels 700/11px `#06B6D4` uppercase. Body 400/16px `#94A3B8`. No mixing weights or families.

4. **Backgrounds are always `#08090F` or `#0F172A`.** Never add color washes, gradients, or bright fills to the scene background. Ambient teal glow is the only background element.

5. **Transitions are fast and cinematic.** Phone slides in from right (or scales up from 0.9). Caption text rises from below. No fades to black — crossfades or wipes only between steps. Each step holds 3–4 seconds.

6. **Green/red in phone UI only.** `#10B981` for income, `#EF4444` for expenses — these appear only inside the phone screen, never in caption overlays.

7. **No logo or branding watermarks in the video itself.** This is a product demo, not a brand reel.
