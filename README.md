# Perfect Circle Helper

A small experimental Chrome extension that draws a smooth circle for you in browser drawing games.

> **Unofficial fan project.** Not affiliated with or endorsed by neal.fun or its creator. Made for people who suck (like me thats why i made this).

## What it does

1. Open a supported drawing game on neal.fun.
2. Hover your mouse over the dot in the middle.
3. Press **C** once.
4. The extension draws a clockwise circle around the dot, then stops.

A green dashed outline briefly shows where the circle is going to be drawn (the red dot marks the starting point).

## Installation

The extension isn't on the Chrome Web Store, so you load it manually:

1. Download or clone this repository so you have a folder containing `manifest.json`, `background.js` and `content.js`.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the folder.
5. Reload the neal.fun page. You should see a message at the top saying the extension is loaded.

## Usage tips

- Press **C once** and don't hold the key.
- Wait for the "done" message before moving your mouse or clicking anything.
- Put the cursor as close to the center dot as you can. The extension tries to find the dot and snap to it, but your cursor position is the fallback.
- While it draws, Chrome shows a **"started debugging this browser"** bar. This is normal (see below) and disappears when the circle is finished.

## How it works

Games like this tend to ignore synthetic mouse events created by page scripts. To get around that, the extension uses Chrome's **debugger API** (`chrome.debugger`) to send real mouse input:

- `content.js` runs on neal.fun pages. It listens for the **C** key, finds the dot and play area, and works out the circle's center and radius.
- `background.js` attaches the debugger to the tab, sends the mouse press, 120 small mouse moves, and the release, then detaches.
- Chrome shows the debugging bar whenever the debugger is attached. That's why the permission is required and why the bar appears.

## Permissions

| Permission | Why |
| --- | --- |
| `debugger` | Sends real mouse input to the tab so the game accepts the drawing. |
| Access to `https://neal.fun/*` | Runs the content script on neal.fun pages only. |

The extension does not collect, store or send any data.

## Known limitations

- **Experimental.** It was built and tested on the "I'm Not a Robot" Perfect Circle level (level 17). Other pages, including the standalone Perfect Circle game, may need tweaks.
- **Speed, size and direction** are fixed: about 1.5 seconds, a radius of up to 150 px, and clockwise. If a game wants something else, edit the constants in `background.js` (`STEPS`, the `sleep` between moves, `TURNS`) and `content.js` (the radius `r`).
- **Page layout changes** (for example if the game redesigns its page) can break the dot and play-area detection.
- Because it uses the debugger permission, it is **very unlikely to be accepted on the Chrome Web Store**.

## Troubleshooting

- **Nothing happens when I press C.** Check that the extension is enabled in `chrome://extensions`, reload the extension, then press F5 on the page.
- **It highlights text instead of drawing.** The circle probably started outside the game area. Make sure your cursor is over the dot before pressing C.
- **I see "error: ..." at the top.** Open an issue and include the exact text.

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
