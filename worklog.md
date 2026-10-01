# Worklog

---
Task ID: 1
Agent: Super Z (main)
Task: Rebuild Yahoo Messenger 9/10 web app with pixel-faithful UI, real assets, GitHub source-of-truth

Work Log:
- Verified sandbox state: dev server running (port 3000), all 11 reference images present in upload/, .zscripts intact
- Analyzed 6 NEW high-res pasted reference images (buddy list w/ Sarah Bacon header, IM windows w/ audibles strip, Michael Muchmore list w/ offline contacts)
- Created GitHub repo RogerAirs11/yahoo-messenger-web, pushed baseline (token scrubbed from scripts after push-protection block)
- Asset hunt: found alexpreli/yahoo-emoticons-discord repo -> downloaded 118 ORIGINAL Yahoo emoticon GIFs + official code mapping from bundled xlsx + 114 ORIGINAL audible MP4s (13 categories, 43MB) to public/assets/
- Downloaded 72 real profile photos (randomuser.me) + AI-generated 6 Yahoo-Avatar-style cartoon avatars (z-ai image CLI)
- Full code rebuild:
  - src/lib/ym/data.tsx — real roster from refs (Sarah Bacon, Michael Muchmore, "I'm mobile", "Stepped Out", "Eric Burke ate my inbox", now-playing "The Choir"), real audible catalog, era ads (DISH Network, DealTime), news headlines
  - src/lib/ym/emoticons.tsx — 118 emoticons w/ canonical YM codes incl. hidden ones, greedy text parser rendering real GIFs inline
  - src/lib/ym/store.ts — real audible sends (catIdx/clipIdx), demo-host protection, status logic
  - src/components/ym/ — Window.tsx (draggable XP chrome + shake), MenuBar.tsx (functional dropdowns+submenus), icons.tsx (SVG status/toolbar/brand icons), LoginWindow.tsx (Y!+orb logo, language dropdown), BuddyList.tsx (purple header, status dropdown, tabs, search, WEB SEARCH bar), ImWindow.tsx (call toolbar, audibles strip w/ real MP4 thumbs, B/I/U+font/size/color bars, BUZZ bell, ad+news bars), Popups.tsx (emoticon/color pickers), Desktop.tsx (XP taskbar, signing dialog, ambient life)
  - globals.css — full YM9 purple design system (Tahoma 11px, XP scrollbars/sunken fields)
- Browser-verified: login -> signing -> buddy list -> auto-IM from Michael ("How's it going?"), sent msg w/ emoticon GIFs, BUZZ!!! red text + shake, audible video bubbles both directions, emoticon picker popup, multi-window z-order, taskbar buttons; lint clean, zero dev.log errors

Stage Summary:
- App is pixel-faithful to the 11 reference screenshots with 100% real Yahoo assets (emoticons + audibles)
- GitHub repo is source of truth: https://github.com/RogerAirs11/yahoo-messenger-web
- IMPORTANT for next turns: run `git pull origin main` BEFORE any work; commit+push after every turn
- GH_TOKEN available from user (classic ghp_... token); repo remote already configured with it
- Known minor items: IMVironments button is alert-only stub, video/voice calls are alert stubs (era-appropriate), "Sign in automatically" checkbox non-functional by design
