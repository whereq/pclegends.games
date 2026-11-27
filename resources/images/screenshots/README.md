# WhereQ-DOSBox — user-guide screenshots

Nine frames for the latest user guide, taken on **2026-11-27** from the
**release-signed WhereQ-DOSBox 1.0.0.19 APK** — the artifact people download
from the GitHub Release, not a local build.

`manifest.json` beside this file describes every frame (phase, file, caption,
url, orientation) in the same shape as the house capture set.

## The facts a guide needs

| | |
|---|---|
| **App** | WhereQ-DOSBox **1.0.0.19** (versionCode 1000019, minSdk 23 / Android 6.0) |
| **APK** | `whereq-dosbox-1.0.0.19.apk`, sha256 `39a6c53f9951247c706f08185e54cf7558ae137250866a1d41f27d6ba1ccb568` |
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
2. **04 — launch it.** **Play** starts the entry point the page names, `LR.COM`.
3. **05 — into Game Mode.** Type the Konami code on the **on-screen keyboard**:
   ↑ ↑ ↓ ↓ ← → ← →, then **B** and **A** (they have to be capital, so Caps Lock
   goes on first with a double-tap on Shift). The game keeps running behind the
   pads; this is where the d-pad, the mouse buttons and the trackball live.
4. **06 — back out again.** The **reverse** Konami code on the Game Mode pad:
   ↑ ↑ ↓ ↓ ← → ← →, then **X** and **Y**. The game is still running underneath.
5. **07 → 08 — it keeps running in the background.** WhereQ-DOSBox holds a
   `specialUse` foreground service, so the emulator stays resident while you
   are in another app. The notification says *"Playing tou-jin-zi — tap to
   return"*, and tapping it brings you back to the exact frame you left.

## Two things worth saying plainly

- **Game Mode is entered and left with the Konami code, and both directions
  use the pads** — the detector behind it listens for taps on the on-screen
  keyboard and the Game Mode pad, not for key events.
- **The background notification is the difference from A-DOS.** A-DOS has no
  foreground service: it runs in the foreground, and answers the same problem
  with its save state instead.

## The frames

| File | What it shows | Size |
|---|---|---|
| `01-files-panel.png` | the Files panel on a fresh install, and the **Install a bundle (.zip)** button | 2400×1080 |
| `02-picker-download.png` | the system file picker, on Downloads, with `tou-jin-zi.zip` | 1080×2400 |
| `03-bundle-installed.png` | the bundle installed — `LR.COM`, and **Play / States / Launch… / Remove** | 2400×1080 |
| `04-game-running.png` | 偷金子 running, framed by the on-screen keyboard | 2400×1080 |
| `05-game-mode-on.png` | Game Mode (HYBRID) over the running game | 2400×1080 |
| `06-game-mode-off.png` | back to the plain keyboard pads | 2400×1080 |
| `07-running-in-background.png` | the ongoing notification in the shade | 1080×2400 |
| `08-tap-to-return.png` | back in the game, same frame, same score | 2400×1080 |
| `09-dos-prompt.png` | the DOSBox welcome banner and the `C:\>` prompt | 2400×1080 |

The PNGs are palette-quantised to 256 colours, which is lossless to the eye
here (RMS ≤ 1.3 of 255) and takes the set from 1.4 MB to 551 KB.
