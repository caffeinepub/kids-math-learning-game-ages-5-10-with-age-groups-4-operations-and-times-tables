# Specification

## Summary
**Goal:** Restore the age-group selection flow, re-apply the kid-friendly pastel theme, bring back animated mascots, and ensure sticker rewards plus a sticker-board view work and persist.

**Planned changes:**
- Restore reliable routing/guard behavior so users without an age group can always reach and use the Age Select screen, and ensure all age-group cards (5–6, 7–8, 9–10) render and navigate to Activity Select.
- Re-apply the intended soft pastel styling across key screens (Home, Age Select, Activity Select, Play, Round Summary, Progress) and fix unintended bold typography regressions while keeping text legible and high-contrast.
- Ensure the Mascot component loads the expected static mascot images and that its animations (idle float, cheer bounce-in, encourage wiggle) visibly run on Home, Age Select, Progress, and Round Summary, with graceful fallback if an asset is missing.
- Restore/ensure sticker rewards: award exactly one sticker upon reaching Round Summary, show the earned sticker on Round Summary, persist earned stickers via localStorage, and add a sticker-board UI in Progress with visible empty slots and fallback when images fail to load.
- Apply a single consistent theme pass (colors, rounded shapes, spacing/shadows, playful typography) across Home, Age Select, Round Summary rewards moment, and Progress sticker board to avoid mismatched/unstyled screens.

**User-visible outcome:** Children can select an age group whenever needed, see a cohesive pastel kid-friendly UI with animated mascots, earn a sticker after each completed level, and view collected stickers on a persistent sticker board.
