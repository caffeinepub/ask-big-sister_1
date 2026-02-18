# Specification

## Summary
**Goal:** Convert the Stone Match board area to a 3D game board while enforcing strict one-stone-per-tile, match-3-only rules.

**Planned changes:**
- Update match-3 board/state logic to guarantee exactly one stone per tile and only clear contiguous horizontal/vertical matches of 3+ same-color stones.
- Replace the 2D grid-of-images board rendering on `/game` with a real-time 3D board using Three.js via React Three Fiber (8x8 tiles with one 3D stone per tile, colors mapped to existing stone/tile types).
- Add 3D interaction feedback (selected highlight) and basic animations for swaps and clears/cascades, disabling input while animations run.
- Keep the existing 2D UI shell (score, New Game, instructions, background) and ensure the embedded 3D board is responsive and does not overflow on small screens.

**User-visible outcome:** On the game page, players see and interact with a 3D 8x8 Stone Match board where each tile holds one stone, swaps animate, matches only clear for 3+ same-color lines, and the existing score/controls/instructions remain available.
