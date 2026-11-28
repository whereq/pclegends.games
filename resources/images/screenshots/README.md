# WhereQ-DOSBox — the complete user-guide screenshots

Thirty-three frames for the user guide, taken on **2026-11-27** from the
**release-signed WhereQ-DOSBox 1.0.0.20 APK** — the artifact people download
from the GitHub Release, not a local build.

This set replaces the thirty-two before it. It is the whole app: the import,
the launch, Game Mode and the way out of it, **the save states and the way
back into them**, the durable saves, the settings, the keyboard layers, the
launcher, the app info page, the background notification and the narrow
screen.

What 1.0.0.20 added is in here too: the **green SAVE button** on the gamepad
(frame 13), **five** save slots instead of three, and the **exact clock time**
a slot carries once it is a day old (frames 19 and 26). The game runs behind
the gamepad now, which is what the SAVE button saves.

`manifest.json` beside this file describes every frame (phase, file, caption,
url, orientation) in the house shape.

## The facts a guide needs

| | |
|---|---|
| **App** | WhereQ-DOSBox **1.0.0.20** (versionCode 1000020, minSdk 23 / Android 6.0) |
| **APK** | `whereq-dosbox-1.0.0.20.apk`, sha256 `63b9da1bdf3687e47c9e889851c1d0bf15f26958b365f3cd726838235b0181c9` |
| **Device** | Android emulator, API 37, x86_64, 2400×1080 landscape, density 420 |
| **Game** | **偷金子** (`tou-jin-zi`) — Lode Runner. The bundle is `tou-jin-zi.zip`, 49 883 bytes, 2 files: `LR.COM` (entry point) and `LODERUN.DAT` |
| **Where the bundle comes from** | `https://dos-bin.zczc.cz/%E5%81%B7%E9%87%91%E5%AD%90.zip` — the same download the [PC Legends page for 偷金子](https://pclegends.games/dos-games/tou-jin-zi/) offers |

The frames are the demo game **on purpose**: it is the game the PC Legends
main page shows, so a reader who follows the guide lands on the same game they
saw on the site.

## The flow the frames tell

1. **01 → 03 — import a bundle.** The gold **File** key opens the Files panel.
   **Install a bundle (.zip)** opens the Android file picker; pick
   `tou-jin-zi.zip` in Downloads; the bundle installs and stays installed.
2. **04 → 05 — launch it.** **Play** starts the entry point the page names,
   `LR.COM`. Android asks once for notification permission — the foreground
   service needs it.
3. **06 → 07 — the machine underneath.** The Files panel over the running
   game, and the DOSBox banner and the `C:\>` prompt.
4. **08 → 14 — Game Mode, and back out.** Type the Konami code on the
   **on-screen keyboard**: ↑ ↑ ↓ ↓ ← → ← →, then **B** and **A** (they have
   to be capital, so Caps Lock goes on first with a double-tap on Shift).
   Long-press the gold profile button to switch between the Hybrid, Action
   and Point & click layouts, and to remap the buttons. The green **SAVE**
   button in the top bar saves the running game without leaving the gamepad;
   a long press opens the Save states sheet over it. Leave with the
   **reverse** Konami code on the Game Mode pad: ↑ ↑ ↓ ↓ ← → ← →, then **X**
   and **Y**. There is deliberately no KBD button.
5. **15 → 19 — save a state and load it back.** The **States** button opens
   the sheet: five slots. **Save** freezes the whole machine into slot 1;
   the sheet then says how long ago that was, and **Load** puts it back.
   Two more saves, made *yesterday*, show the exact clock time — *Yesterday
   10:00* and *Yesterday 20:00* — so two saves from the same day can be told
   apart. The Files panel carries a **Resume** line naming the slot and its
   age.
6. **16 → 17 — keep the saves safe.** The app asks, once, for a folder of
   your own to mirror the slots into. Android will not hand an app the whole
   Download folder, so the app asks for a folder it made — **DOSSaves** —
   and then for access to it.
7. **20 → 22 — the settings.** **Config → Saves folder** shows the folder
   you chose, and says plainly what happens when there is none.
8. **23 → 26 — after a reinstall.** The folder is still on the phone after
   the app is uninstalled. Hand the same folder over again and the app finds
   the game, offers to restore it, and the restored slots **still know when
   they were made**.
9. **27 → 33 — the rest of the app.** The keyboard's punctuation and function
   layers, the launcher icon, the App info page, the ongoing notification
   that keeps the machine resident in the background, the tap that brings
   you back to the running game, and the app on an 18:9 screen.

## Two things worth saying plainly

- **Game Mode is entered and left with the Konami code, and both directions
  use the pads** — the detector behind it listens for taps on the on-screen
  keyboard and the Game Mode pad, not for key events. The exit code needs a
  profile that has a D-pad, so **Point & click** cannot take it: switch back
  to **Hybrid** first.
- **The background notification is the difference from A-DOS.** A-DOS has no
  foreground service: it runs in the foreground, and answers the same problem
  with its save state instead.

## The frames

| File | What it shows | Size |
|---|---|---|
| `01-files-panel-empty.png` | the Files panel on a fresh install, and the **Install a bundle (.zip)** button | 2400×1080 |
| `02-picker-download.png` | the system file picker, on Downloads, with `tou-jin-zi.zip` | 1080×2400 |
| `03-bundle-installed.png` | the bundle installed — `LR.COM`, and **Play / States / Launch… / Remove** | 2400×1080 |
| `04-notification-permission.png` | Android's notification permission prompt | 2400×1080 |
| `05-game-running.png` | 偷金子 running, framed by the on-screen keyboard | 2400×1080 |
| `06-files-panel-resume.png` | the Files panel over the running game, with **Resume tou-jin-zi** | 2400×1080 |
| `07-dos-prompt.png` | the DOSBox welcome banner and the `C:\>` prompt | 2400×1080 |
| `08-game-mode-hybrid.png` | Game Mode (HYBRID), with the green **SAVE** button in the top bar | 2400×1080 |
| `09-game-mode-profile-picker.png` | the Game profile picker | 2400×1080 |
| `10-game-mode-action.png` | Game Mode (ACTION) — d-pad and face buttons | 2400×1080 |
| `11-game-mode-point.png` | Game Mode (POINT & CLICK) — mouse buttons, no d-pad | 2400×1080 |
| `12-game-mode-remap.png` | remap mode — the changeable buttons outlined in gold | 2400×1080 |
| `13-game-mode-save-sheet.png` | the Save states sheet opened from the gamepad, over the running game | 2400×1080 |
| `14-game-mode-off.png` | back to the plain keyboard pads | 2400×1080 |
| `15-states-empty.png` | the Save states sheet, five empty slots | 2400×1080 |
| `16-saves-offer.png` | the **Keep your saves safe?** prompt | 2400×1080 |
| `17-folder-permission.png` | the Android access dialog for DOSSaves | 1080×2400 |
| `18-files-panel-resume-slot.png` | **Resume tou-jin-zi · slot 1 · just now** | 2400×1080 |
| `19-states-slot.png` | **Slot 1 · 12 minutes ago**, and two saves from yesterday with their clock times | 2400×1080 |
| `20-settings.png` | the Settings dialog | 2400×1080 |
| `21-saves-folder.png` | the Saves folder dialog, with a folder set | 2400×1080 |
| `22-saves-folder-unset.png` | the Saves folder dialog, with no folder set | 2400×1080 |
| `23-durable-folder-contents.png` | the folder after the app was uninstalled | 1080×2400 |
| `24-restore-games-offer.png` | the **Restore games** prompt | 2400×1080 |
| `25-games-restored.png` | **Restored 1 game(s). Your saves are ready.** | 2400×1080 |
| `26-states-restored-slot.png` | the restored slots, still saying when they were made | 2400×1080 |
| `27-keyboard-symbols.png` | the punctuation layer | 2400×1080 |
| `28-keyboard-functions.png` | the function layer, F1–F12 | 2400×1080 |
| `29-launcher-home.png` | the app's own icon on the launcher | 1080×2400 |
| `30-app-info.png` | the Android App info page | 1080×2400 |
| `31-running-in-background.png` | the ongoing notification in the shade | 1080×2400 |
| `32-tap-to-return.png` | back in the game after tapping the notification | 2400×1080 |
| `33-narrow-18x9.png` | the app on an 18:9 display | 2160×1080 |

## The pictures

The PNGs are palette-quantised to 256 colours, which is lossless to the eye
here and takes the set from 6.5 MB to 2.1 MB. Twenty-seven of the thirty-three
frames land at RMS ≤ 1.3 of 255. The six over the bar are the four Game Mode
frames — the game runs behind the gamepad now, and its cyan and magenta
dither at that size — and the two that carry a photograph: the launcher
wallpaper and the blurred wallpaper behind the notification shade, at 1.86 and
2.13.

The other copy of each frame lives in `static/img/resources/`, so the site
can serve them from its own domain. The two copies are byte-identical.
