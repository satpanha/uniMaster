# Visual QA Report — Screenshots Audit

Date: 2025-12-30

Summary
-------
I ran an automated layout audit and captured screenshots for the dashboard and key pages at mobile/tablet/desktop/wide breakpoints. Screenshots are in `screenshots/` (28 files). Programmatic checks looked for horizontal overflow, missing images, and very long unbroken text.

Key Findings
------------
- Missing avatar caused repeated 404s in dev logs; fixed by adding `public/avatars/user.svg` and updating Topbar/Sidebar to reference it (no more 404s).
- Horizontal overflow detected on smaller breakpoints for several pages (mobile/tablet/desktop):
  - `/dashboard` (desktop overflow by 21px)
  - `/dashboard/athletes` (mobile/tablet/desktop)
  - `/dashboard/medals` (mobile/tablet/desktop)
  - `/dashboard/provinces` (mobile/tablet/desktop)
  - `/dashboard/events/event-1` (mobile/tablet/desktop)
  - `/dashboard/events/event-1/athletes` (mobile)
- No missing images after the avatar fix (audit found no zero-width images after the change).
- A Next.js runtime warning appeared for the route `app/(dashboard)/dashboard/events/[eventId]/athletes/page.tsx` where `params.eventId` was accessed in client-side code; I fixed this by copying `params.eventId` to a local `eventId` and using that value in effects/requests.

What I changed
--------------
- Added `public/avatars/user.svg` (simple placeholder SVG) to resolve 404s.
- Updated `components/common/Topbar.tsx` and `components/common/Sidebar.tsx` to use `/avatars/user.svg`.
- Modified `.two-col-layout` rules in `app/globals.css` to use `grid-template-columns: 1fr min(400px,36%)` and added a responsive breakpoint to collapse to a single column at <=1024px. This reduced many overflow cases.
- Fixed `EventAthletesPage` to use a local `eventId` variable instead of accessing `params.eventId` directly in hooks.
- Added `tools/qa-audit.js` (Playwright-based checks) and this report `tools/qa-report.md`.

Suggested Next Steps / Fixes
---------------------------
1. Investigate table/grid components (Athletes/Medals/Provinces) for fixed-width columns or long content causing overflow. Suggested fixes:
   - Ensure tables wrap text or use responsive column hiding on mobile.
   - Use `min-width: 0` on flex/grid children to allow shrinking (e.g., `table-container { min-width:0; }`).
2. Add additional responsive rules for larger components that could take more space (e.g., DataTable cell truncation with ellipsis and tooltip for full text).
3. Add automated Playwright visual comparison (golden images) as CI step to detect regressions.
4. Open a PR with these changes (I committed them to `fix/add-avatar` locally). If you'd like, I can open the PR for you — I couldn't push the branch because no remote is configured in this environment.

Screenshots to review (representative examples)
-----------------------------------------------
- `screenshots/dashboard_mobile.png`
- `screenshots/dashboard_events_tablet.png`
- `screenshots/dashboard_athletes_mobile.png`
- `screenshots/dashboard_medals_desktop.png`
- `screenshots/dashboard_provinces_mobile.png`
- `screenshots/dashboard_events_event-1_mobile.png`

If you'd like, I can now:
- Open a draft PR (needs a configured Git remote) with the changes + include these screenshots in the PR description, or
- Continue by implementing specific responsive fixes for the DataTable or other components (pick one or more pages to prioritize).
