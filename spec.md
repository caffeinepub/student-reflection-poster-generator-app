# Specification

## Summary
**Goal:** Help users troubleshoot post-publish access issues (“Canister ID Not Resolved”) and ensure all generated template/branding images load correctly in the published app.

**Planned changes:**
- Add a “Trouble opening the app?” help entry point on the unauthenticated AuthGate screen that explains “Canister ID Not Resolved” as a gateway/domain resolution issue and provides English troubleshooting steps.
- Add a “Copy app link” action on AuthGate that shows the current hostname/origin, copies `window.location.origin`, and provides success/error toasts with manual copy fallback.
- Add an authenticated entry point (e.g., AppLayout footer) to open the same “Trouble opening the app?” help content used on AuthGate.
- Ensure generated static assets referenced by the template catalog and branding are included under `frontend/public/assets/generated` and load without 404s (templates + logo mark).

**User-visible outcome:** Users can access a consistent troubleshooting help panel from both the landing screen and inside the app, can copy/share the exact app URL they are using, and template previews plus the header logo render without broken images.
