# Specification

## Summary
**Goal:** Add a “Connect Wallet” feature that lets signed-in users link, view, edit, and remove a wallet address stored on their Ask Big Sister profile (not a live wallet connection).

**Planned changes:**
- Add a visible “Connect Wallet” entry point in the navigation/profile area for signed-in users.
- Create a Connect Wallet screen that explains it links a wallet address to the user profile/session (no third-party wallet integration).
- Extend the backend user profile model to store an optional wallet address string per authenticated user.
- Add backend methods for the current signed-in user to read, update, and clear their wallet address with access limited to self.
- Implement frontend CRUD flow using the new backend APIs, including basic validation (non-empty/valid format) and clear English error messages.

**User-visible outcome:** Signed-in users can open “Connect Wallet” to see their linked wallet address (if any), add or edit it, or remove it; validation and backend errors are shown clearly in English and the UI remains usable.
