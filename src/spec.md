# Specification

## Summary
**Goal:** Add a bright, stone-themed 2D match-3 game screen to the existing app.

**Planned changes:**
- Create a new `/game` route that renders an in-browser 2D match-3 board (grid-based) with bright cut-stone tiles.
- Implement core match-3 mechanics: adjacent swap (mouse/touch), detect 3+ matches, clear matched tiles, drop tiles to fill gaps, and refill with new random tiles (including cascades).
- Add a simple HUD with score, restart/new game control, and short English instructions.
- Add navigation entry points (e.g., header and/or home page) to reach the new game screen.
- Apply a consistent bright gem/stone visual style and use generated static image assets (tile images and optional background) served from `frontend/public/assets/generated`.

**User-visible outcome:** Users can navigate to a new game page, swap adjacent stone tiles to make matches, watch tiles clear and cascade, and see their score update with the ability to restart at any time.
