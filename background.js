// Perfect Circle Helper v2.0 - background service worker
// Uses the Chrome debugger API to send real (trusted) mouse input.

const attached = new Set();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

chrome.debugger.onDetach.addListener((source) => {
  attached.delete(source.tabId);
});

async function attach(tabId) {
  if (attached.has(tabId)) return;
  await chrome.debugger.attach({ tabId }, "1.3");
  attached.add(tabId);
}

async function detach(tabId) {
  if (!attached.has(tabId)) return;
  attached.delete(tabId);
  try {
    await chrome.debugger.detach({ tabId });
  } catch (e) {
    /* already detached */
  }
}

async function draw(tabId, { cx, cy, r }) {
  const target = { tabId };
  const mouse = (type, x, y, buttons) =>
    chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", {
      type,
      x,
      y,
      button: type === "mouseMoved" && !buttons ? "none" : "left",
      buttons,
      clickCount: type === "mouseMoved" ? 0 : 1,
    });

  const STEPS = 120;
  const TURNS = 1.015; // slight overlap so the loop closes
  const point = (i) => {
    const a = -Math.PI / 2 + (i / STEPS) * TURNS * 2 * Math.PI; // start at top, clockwise
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };

  try {
    let [x, y] = point(0);
    await mouse("mouseMoved", x, y, 0);
    await sleep(80);
    await mouse("mousePressed", x, y, 1);
    await sleep(80);
    for (let i = 1; i <= STEPS; i++) {
      [x, y] = point(i);
      await mouse("mouseMoved", x, y, 1);
      await sleep(12);
    }
    await mouse("mouseReleased", x, y, 0);
  } finally {
    await detach(tabId);
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab && sender.tab.id;
  if (tabId === undefined) return;

  const reply = (p) =>
    p
      .then(() => sendResponse({ ok: true }))
      .catch((e) => sendResponse({ ok: false, error: String((e && e.message) || e) }));

  if (msg.type === "attach") {
    reply(attach(tabId));
    return true;
  }
  if (msg.type === "draw") {
    reply(draw(tabId, msg));
    return true;
  }
});
