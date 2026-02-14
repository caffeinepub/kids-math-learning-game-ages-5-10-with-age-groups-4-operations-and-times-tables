# Specification

## Summary
**Goal:** Let kids choose a difficulty level for Operations and Times Tables Practice, and add sticker rewards with a sticker chart that persists and works for both anonymous and logged-in users.

**Planned changes:**
- Add a difficulty selector (Easy/Medium/Hard/Math Wizard) to the Operations flow before starting a round; show the selected difficulty during gameplay and include it in the round result data used by the Round Summary screen.
- Apply difficulty to Operations question generation/round configuration across addition, subtraction, multiplication, and division (while still respecting existing age-group ranges).
- Add the same difficulty selector to Times Tables Practice; apply difficulty to practice configuration; show the selected difficulty during practice and keep the completion summary working (stars/score unchanged).
- Implement sticker rewards: award one sticker when an Operations round reaches the Round Summary screen; persist anonymous rewards in localStorage; add a Sticker Chart section on the Progress page showing earned stickers while keeping existing progress UI intact.
- Extend backend progress storage/APIs for authenticated users to record completed level events and earned stickers, and include difficulty with submitted results so progress/rewards can be tracked by difficulty.
- Add generated sticker images as static assets under `frontend/public/assets/generated` and use them in the Round Summary reward moment and the Progress page sticker chart, with a simple non-crashing fallback if an image fails to load.

**User-visible outcome:** Kids can pick a difficulty before playing Operations or Times Tables Practice, see that difficulty during play, and earn fun sticker rewards for completed Operations rounds, viewable later in a sticker chart (persisting across sessions and accounts).
