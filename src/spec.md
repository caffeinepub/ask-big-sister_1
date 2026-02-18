# Specification

## Summary
**Goal:** Fix Stone Match 2D match-3 gameplay stability, scoring accuracy, and rendering robustness during normal and rapid user interaction.

**Planned changes:**
- Stabilize match-3 state updates and interaction handling so swaps, selection, and animation/move resolution are deterministic under rapid clicking.
- Ensure board rendering always reflects the latest computed board state after each completed move (including cascades) and clears selection reliably.
- Correct match accounting and scoring so each unique cleared tile is counted exactly once across initial clears and cascades (including overlapping T/L matches), and scoring only increases for valid moves.
- Harden the render path to avoid attempting to render invalid/transient tile types and ensure tile images always resolve to a valid asset (with safe handling for temporary states).

**User-visible outcome:** The match-3 game plays smoothly without freezing or desync under rapid clicks; scoring is consistently correct; and tiles render reliably without broken images or visual corruption.
