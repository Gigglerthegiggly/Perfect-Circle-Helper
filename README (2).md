# Perfect Circle Helper

A small experimental Chrome extension that draws a smooth, human-like circle for you in browser drawing games.

> **Unofficial fan project.** Not affiliated with or endorsed by neal.fun or its creator. Made for fun and learning.

## What it does

1. Open a supported drawing game on neal.fun.
2. Hover your mouse over the dot in the middle.
3. Press **C** once (or use the floating ◯ button; ⚙ opens settings).
4. The extension draws a circle around the dot, then stops.

## Features (v3.1)

- **Settings popup.** Click the extension icon to change everything below.
- **Auto accuracy target.** If the page says something like "Draw a circle that is 94% accurate", the extension reads that number and aims for it by adding a small, smooth wobble to the circle. You can also choose *Perfect (100%)* or set a manual accuracy.
- **Human-like pacing.** The pen starts slow, speeds up in the middle and slows down at the end, with a touch of jitter.
- **Adjustable** drawing time, maximum circle size and direction (clockwise or counterclockwise).
- **Custom hotkey.** Click the hotkey box in the popup and press any letter or number.
- **Path preview.** A dashed blue outline (with a red start dot) briefly shows what is about to be drawn.
- **Floating buttons on the page.** The ◯ button draws (click it, then move your cursor onto the dot during a 3 second countdown). The ⚙ button next to it opens a settings panel right on the page, with the same options as the toolbar popup. Both stay in sync.
- **Last run summary** in the popup, handy for debugging.

## Installation

The extension isn't on the Chrome Web Store, so you load it manually:

1. Download the latest ZIP from the Releases page and **unzip it** (Chrome can't load a ZIP directly). The folder must contain `manifest.json` at its top level.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the unzipped folder.
5. Reload the neal.fun page. You should see a message at the top saying the extension is loaded.

## Usage tips

- Press the hotkey **once** and don't hold it.
- Wait for the "done" message before moving your mouse or clicking anything.
- Put the cursor as close to the center dot as you can. The extension tries to find the dot and snap to it, but your cursor position is the fallback.
- While it draws, Chrome shows a **"started debugging this browser"** bar. This is normal (see below) and disappears when the circle is finished.
- If a level wants *at least* a given accuracy, try *Perfect (100%)*. If it wants *about* that accuracy, use *Match the page's target*.

## How it works

Games like this tend to ignore synthetic mouse events created by page scripts. To get around that, the extension uses Chrome's **debugger API** (`chrome.debugger`) to send real mouse input:

- `content.js` runs on neal.fun pages. It listens for the hotkey, reads the accuracy target, finds the dot and play area, and builds the list of points for the circle.
- `background.js` attaches the debugger to the tab, replays those points as a mouse press, many small mouse moves and a release, then detaches.
- `popup.html` and `popup.js` are the settings popup. Settings are stored with `chrome.storage.sync`.
- Chrome shows the debugging bar whenever the debugger is attached. That's why the permission is required and why the bar appears.

## Permissions

| Permission | Why |
| --- | --- |
| `debugger` | Sends real mouse input to the tab so the game accepts the drawing. |
| `storage` | Saves your settings. |
| Access to `https://neal.fun/*` | Runs the content script on neal.fun pages only. |

The extension does not collect or send any data. Settings stay in your browser.

## Known limitations

- **Experimental.** Built and tested on the "I'm Not a Robot" Perfect Circle level (level 17). Other pages, including the standalone Perfect Circle game, may need tweaks.
- **Accuracy is approximate.** The wobble is a guess at how the game scores circles, so the result can land a little above or below the target.
- **Page layout changes** (for example if the game redesigns its page) can break the dot and play-area detection.
- Because it uses the debugger permission, it is **very unlikely to be accepted on the Chrome Web Store**.

## Troubleshooting

- **Nothing happens when I press the hotkey.** Check that the extension is enabled in `chrome://extensions`, reload the extension, then press F5 on the page.
- **It highlights text instead of drawing.** The circle probably started outside the game area. Make sure your cursor is over the dot before pressing the hotkey.
- **I see "error: ..." at the top.** Open an issue and include the exact text.
- **The settings don't seem to apply.** Reload the game page.
- **I hid the floating buttons and want them back.** Click the extension icon in the toolbar and turn on *Floating button on page*.

## Disclaimer

This is a toy project. Please don't use it to spoil the game for others, and enjoy the games the way they were meant to be played too.

## License

MIT. See below.

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
