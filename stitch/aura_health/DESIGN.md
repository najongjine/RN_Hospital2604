# Design System Specification: The Clinical Sanctuary

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Clinic"**

Traditional medical software feels rigid, cold, and anxiety-inducing—defined by harsh borders and aggressive "action" colors. This design system rejects the "template" aesthetic in favor of a **High-End Editorial** experience. We aim to create a "Clinical Sanctuary": an interface that feels like walking into a high-end, light-filled boutique clinic.

The system breaks away from standard grids through **intentional asymmetry** and **tonal layering**. By utilizing sophisticated spacing and varied typographic scales, we convey authority and trust without the need for traditional structural "clutter." Every element should feel like it is floating in a pressurized, clean environment, emphasizing "breathing room" as a functional requirement for patient clarity.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a spectrum of restorative teals and clinical greys, designed to lower the user's heart rate while maintaining high professional standards.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined exclusively through background color shifts.
- To separate a header from a body, transition from `surface` to `surface-container-low`.
- To define a sidebar, use a `surface-container` against a `surface-bright` main stage.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, semi-translucent paper.
- **Level 0 (Base):** `surface` (#f6fafa) - The foundation of the application.
- **Level 1 (Sections):** `surface-container-low` (#eef5f5) - Used for broad content areas.
- **Level 2 (Cards/Modules):** `surface-container-lowest` (#ffffff) - Used to make primary content "pop" against the background.
- **Level 3 (Interactive Elements):** `surface-container-high` (#e1eaea) - For subtle emphasis on hover or secondary utility areas.

### The "Glass & Gradient" Rule
To elevate the "Modern" requirement, main CTAs and Hero sections should utilize **Signature Textures**. 
- **CTA Depth:** Apply a subtle linear gradient from `primary` (#006a71) to `primary_dim` (#005d63) to give buttons a soft, tactile presence.
- **Floating Elements:** Use Glassmorphism for floating overlays (like navigation bars or modals). Apply `surface` at 80% opacity with a `20px` backdrop-blur to allow the content beneath to bleed through organically.

---

## 3. Typography
The system uses a pairing of **Manrope** (Display/Headlines) and **Public Sans** (Body/Labels). This combination balances editorial authority with technical legibility.

- **The Authority (Manrope):** Used for `display` and `headline` tiers. Manrope’s geometric yet warm nature feels modern and trustworthy. Use `headline-lg` (2rem) for page titles to establish an immediate sense of calm expertise.
- **The Functional (Public Sans):** Used for `title`, `body`, and `label` tiers. This font was designed for government-level legibility. 
- **Intentional Scale:** We utilize a high-contrast scale. A `display-lg` (3.5rem) title might sit next to a `body-md` (0.875rem) description, creating a sophisticated, magazine-style layout that guides the eye naturally.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than artificial geometry.

### The Layering Principle
Avoid "Drop Shadows" for standard cards. Instead, place a `surface-container-lowest` card (Pure White) on a `surface` background. The contrast in tone provides all the "lift" required.

### Ambient Shadows
When a component must float (e.g., a critical notification or a FAB), use an **Ambient Shadow**:
- **Color:** A tinted version of `on-surface` (e.g., `#2a3435` at 6% opacity).
- **Blur:** 24px - 40px to create a soft, natural glow rather than a hard edge.

### The "Ghost Border" Fallback
If accessibility requirements demand a container border, use a **Ghost Border**:
- **Token:** `outline-variant` (#a9b4b5) at **15% opacity**. This provides a faint guide for the eye without breaking the minimalist "No-Line" philosophy.

---

## 5. Components

### Buttons
- **Primary:** `primary` background with `on-primary` text. Use `xl` (1.5rem) rounded corners. For high-end feel, add a subtle inner shadow (white, 10% opacity) at the top edge.
- **Secondary:** `secondary-container` background with `on-secondary-container` text. No border.
- **Tertiary:** No background. Use `primary` text. Transitions to `surface-container-low` on hover.

### Input Fields
- **Styling:** Never use a 4-sided box. Use a `surface-container-low` background with a `sm` (0.25rem) corner radius. 
- **Active State:** Change background to `surface-container-lowest` and add a 2px `primary` underline. This mimics the "clinical chart" feel while remaining modern.

### Cards & Lists
- **The Forbid Rule:** Divider lines are strictly prohibited. 
- **Separation:** Use `md` (0.75rem) vertical padding and background color toggling. In a list, every second item should sit on a `surface-container-lowest` "pill" to separate it from the `surface` background.

### The "Vitals" Component (New)
A specialized medical component for displaying data like Heart Rate or Blood Pressure.
- **Style:** Large `headline-lg` value in `primary`, with a `label-sm` unit label in `secondary`. These should be housed in a `surface-container-lowest` card with `xl` (1.5rem) corners and a 20% opacity `primary` tint.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical margins. For example, a header might have a 40px left margin but a 120px right margin to create an editorial feel.
- **Do** use `xl` (1.5rem) rounded corners for all major containers to soften the "medical" environment.
- **Do** prioritize `body-lg` for patient-facing instructions to ensure maximum readability.

### Don't
- **Don't** use 100% black text. Always use `on-surface` (#2a3435) to keep the contrast soft and accessible.
- **Don't** use "Alert Red" for everything negative. Use `error` (#a83836) sparingly; consider `secondary` or `outline` for non-critical empty states to avoid "warning fatigue."
- **Don't** clutter the screen. If a screen has more than 5 primary interaction points, move the secondary ones into a `surface-variant` overflow menu.

---

## 7. Spacing Scale
Maintain the "Sanctuary" feel through generous spacing:
- **Section Spacing:** 80px (Use `surface` shifts to define these).
- **Content Gaps:** 24px (Consistent with `xl` corner radius).
- **Inline Gaps:** 12px (For related labels and inputs).

*Every pixel of white space is a breath for the patient. Guard it fiercely.*