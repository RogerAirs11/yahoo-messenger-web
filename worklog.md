---
Task ID: 10
Agent: Super Z (main)
Task: User feedback — IMVironments must be based on REAL visual evidence from Yahoo (not invented art); keep old ones as legacy; white glow/border on chat text over dark IMVs; XP icons/logos compared against the real deal via screenshots; pull at start, push at end.

Work Log:
- Pulled origin/main (up to date at fc0e546, clean tree — no sandbox reroll)
- EVIDENCE HUNT (image-search API down 400s, wayback CDX + direct curl to web.archive.org TCP-blocked from sandbox):
  * Used z-ai page_reader (server-side) on web.archive.org captures → recovered the REAL messenger.yahoo.com/imvironments gallery (2011) + category pages + per-IMV view pages with OFFICIAL Yahoo descriptions
  * Discovered l.yimg.com (Yahoo's own CDN) IS STILL LIVE → downloaded the GENUINE IMVironment artwork from Yahoo directly: imv_leaves.gif (Autumn Leaves), imv_fish.gif (Fishtank), imv_snow.gif (Snowflake), imv_hearts.gif (Falling Hearts), imv_precious.gif, purpleleaves_gallery.jpg, emoticats_gallery.jpg, doodle_gallery.gif + the official imv_window.jpg (how an IMV renders in the real IM window) → all saved to public/assets/imv/
  * Sampled EXACT colors from the real art with PIL (scripts/sample_imv_colors.py): Leaves #ffefad cream + #e7d69c ground + faint #a3a084 tree sketch; Fish #b3d8fc pale water + #adc2ba sage; Snow #b3d8fc + white; Hearts #ffcccc frame + #fdbec1 panel; Purple #e7cfe7 + #52205b trees
  * Official Yahoo text confirms behaviors: Autumn Leaves "watch leaves fall... Buzz blows them with the wind (Ctrl+G)"; Snowflake "hit buzz and watch the snowballs fly!"; Falling Hearts "buzz gives your loved one a virtual kiss"; Purple Leaves "gently falling leaves flutter in the breeze"
- NEW FILE src/components/ym2/ImvReal.tsx: faithful flat-vector recreations of 5 REAL IMVs (AutumnLeaves/Fishtank/Snowflake/FallingHearts/PurpleLeaves) using the sampled palette, real compositions (tree sketch right + tan ground for Leaves; seaweed silhouettes + small fish for Fishtank; snowman w/ "Y!" bubble bottom-right for Snowflake; two-tone pink panel for Hearts; white bottom clouds + purple tree silhouettes for PurpleLeaves). Idle motions gentle; BUZZes exactly as Yahoo described (wind sweep w/ imv-windleaf/windspin/windband/liftoff, snowball fight w/ new imv-snowball-lr/rl + imv-snowpuff, kiss stamp w/ imv-kiss + heart burst, purple gust w/ lavender wind bands)
- Imvironments.tsx: ImvId extended (leaves/fishtank/snowflake/purpleleaves added; autumn/aquarium/beach/fireworks/winter kept as LEGACY); IMV_BG real entries; IMV_GROUPS picker grouped by Yahoo's REAL category names (Animals & Nature / Love & Friendship / Purple / Interactive Fun / Classic (Legacy)); IMV_DARK set for text-glow; OLD Hearts component removed (replaced); Doodle restyled to the real one (crayon row along top, vertical right tool rail with "Doodle/Eraser/Clear" labels + swatches, faint example sketches)
- ChatWindow.tsx: IMV picker now shows the GENUINE Yahoo thumbnails (44x27) beside names + official Yahoo description as tooltip, grouped under real categories; message pane gets ym-msg-glow (white text-shadow halo) when a dark legacy scene (aquarium/fireworks/winter) is active
- sounds.ts: aliases so leaves→autumn, fishtank→aquarium, snowflake→winter, purpleleaves→autumn real recordings (buzz + ambient)
- globals.css: +imv-clouddrift/snowball-lr/snowball-rl/snowpuff/treesway/windband-pl/streak-pl/heartburst keyframes + .ym-msg-glow
- XP ICONS: previous set turned out to be Win9x-style (CRT monitor My Computer) — fetched the GENUINE Luna XP icons:
  * softwarehistorysociety/XPIcons (1024px originals): MyComputer, MyDocuments, MyNetworkPlaces, InternetExplorer6, RecycleBin empty/full, MyMusic, MyPictures, ControlPanel, HelpandSupport, Search, Run, Volume, Restart, Standby, UserAccounts, WindowsMediaPlayer10 → downscaled crisp 48/32/16
  * bartekl1/windows-ui-assets "Icons/Windows XP/ico/shell32.dll": visually identified true XP indices via contact sheets (16=My Computer, 19=My Network Places, 191/192=Recycle, 235=My Documents, 224/225/237, 34, 24, 23, 21, 9=hdd, 12=cd-drive) → fetched hdd + cd-drive
  * scripts/xp_icon_sheet*.py build visual contact sheets; scripts/fetch_real_xp_icons.py + fetch_xpicons_hq.py are the pipeline
- YmApp.tsx: desktop icons now GENUINE XP at real 48px Medium size, authentic XP order (My Documents, My Network Places [NEW], My Computer, Internet Explorer, Recycle Bin); My Computer window CD Drive now uses the real CD icon (was wrong globe)
- Taskbar.tsx: Quick Launch = IE + Show Desktop + Windows Media Player (real WMP10 icon); tray volume now the real XP speaker PNG
- VERIFIED via agent-browser (scripts/v8_*.png): boot logo, logonui welcome, desktop w/ genuine icons on Bliss, Luna start menu w/ all-real icons, My Computer explorer chrome, IMV picker w/ genuine Yahoo thumbs grouped by real categories, Autumn Leaves idle (cream/tan/sketch tree/slow leaves) + BUZZ wind sweep, Fishtank, Snowflake idle + snowball buzz, Falling Hearts + kiss stamp buzz, Purple Leaves, Fireworks legacy w/ WHITE TEXT GLOW on chat text; 0 page errors; tsc clean for src
- Committed + pushed (this commit)

Stage Summary:
- The IMVironment set is now grounded in PRIMARY visual evidence: the actual Yahoo IMVironment artwork recovered from Yahoo's still-live CDN + the archived official gallery, with official Yahoo behavior descriptions driving idle + BUZZ animations; old artistic set kept under Classic (Legacy)
- Chat text is readable everywhere: real scenes are light (dark text like the original client) and dark legacy scenes get a white glow/border around text
- The XP shell now uses the GENUINE Luna icons end-to-end (desktop, start menu, quick launch, explorer drives, tray) at the real sizes/order
