# Specification

## Summary
**Goal:** Fix Internet Identity login state inconsistencies after reload and eliminate Stone Match 3D board “glitching” during swaps/cascades.

**Planned changes:**
- Update `frontend/src/App.tsx` (and related UI/routing logic) to use a single, correct “authenticated” definition based on a non-anonymous identity, so login state persists correctly across page reloads while keeping the profile setup gate behavior.
- Update `frontend/src/hooks/useQueries.ts` to only run profile/wallet React Query calls when truly authenticated; handle unauthorized/unauthenticated errors cleanly and clear protected cached data on logout to avoid loops or persistent error states.
- Update `frontend/src/game/three/StoneMatch3DBoard.tsx` (and related match-3 state management) to stabilize stone rendering during swaps/cascades (avoid remounting from unstable keys) and disable user input while moves are animating/resolving.

**User-visible outcome:** After logging in, refreshing the page keeps the user recognized as logged in; profile setup gating still works; unauthenticated users no longer see repeated auth-related query errors; and the Stone Match 3D board no longer flickers/duplicates/teleports during cascades, with inputs ignored while animations resolve.
