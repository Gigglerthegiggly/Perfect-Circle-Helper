// Perfect Circle Helper v2.2
// Hover your mouse over the dot, then press "C" once (don't hold it).

let mx = null, my = null;
let busy = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

window.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
}, true);

function toast(msg, ms = 2500) {
  let el = document.getElementById("circle-helper-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "circle-helper-toast";
    el.style.cssText =
      "position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:2147483647;" +
      "background:#222;color:#fff;padding:8px 14px;border-radius:6px;font:14px sans-serif;" +
      "pointer-events:none;opacity:.95;max-width:90vw";
    document.documentElement.appendChild(el);
  }
  el.textContent = "Circle Helper: " + msg;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.remove(), ms);
}

// Green dashed outline of where the circle will be drawn (red dot = start)
function showOverlay(cx, cy, r) {
  const old = document.getElementById("circle-helper-overlay");
  if (old) old.remove();
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "circle-helper-overlay";
  svg.style.cssText =
    "position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147483646;pointer-events:none";
  svg.innerHTML =
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="lime" stroke-width="3" stroke-dasharray="6 6"/>` +
    `<circle cx="${cx}" cy="${cy}" r="4" fill="lime"/>` +
    `<circle cx="${cx}" cy="${cy - r}" r="6" fill="red"/>`;
  document.documentElement.appendChild(svg);
  setTimeout(() => svg.remove(), 6000);
}

// Best effort: find the small white round dot nearest to the cursor
function findDot(cx, cy) {
  let best = null, bestDist = 60;
  for (const el of document.querySelectorAll("body *")) {
    const b = el.getBoundingClientRect();
    if (b.width < 6 || b.width > 40 || Math.abs(b.width - b.height) > 2) continue;
    const cs = getComputedStyle(el);
    if (cs.backgroundColor !== "rgb(255, 255, 255)") continue;
    const br = cs.borderRadius || "0";
    const round = br.includes("%") ? parseFloat(br) >= 50 : parseFloat(br) >= b.width / 2 - 1;
    if (!round) continue;
    const ex = b.left + b.width / 2, ey = b.top + b.height / 2;
    const d = Math.hypot(ex - cx, ey - cy);
    if (d < bestDist) { bestDist = d; best = [ex, ey]; }
  }
  return best;
}

// Find the play area: nearest ancestor of the element under (x, y) of a plausible size
function findArea(x, y) {
  let el = document.elementFromPoint(x, y);
  while (el && el !== document.body && el !== document.documentElement) {
    const b = el.getBoundingClientRect();
    if (b.width >= 300 && b.width <= 700 && b.height >= 300 && b.height <= 800) return b;
    el = el.parentElement;
  }
  return null;
}

async function run() {
  if (busy) return;
  busy = true;
  try {
    const preProbe = document.querySelector("canvas"); // may be null; only used to detect page shift
    const marker = document.elementFromPoint(mx ?? innerWidth / 2, my ?? innerHeight / 2) || document.body;
    const pre = marker.getBoundingClientRect();
    let cx = mx ?? innerWidth / 2;
    let cy = my ?? innerHeight / 2;

    toast("attaching...", 4000);
    let res = await chrome.runtime.sendMessage({ type: "attach" });
    if (!res || !res.ok) throw new Error((res && res.error) || "attach failed");

    // Chrome shows a "debugging" bar that pushes the page down. Wait, then
    // correct the center by however far the page moved.
    await sleep(700);
    const post = marker.getBoundingClientRect();
    const dx = post.left - pre.left;
    const dy = post.top - pre.top;
    cx += dx;
    cy += dy;

    const dot = findDot(cx, cy);
    if (dot) { cx = dot[0]; cy = dot[1]; }

    const area = findArea(cx, cy);
    let r = 150;
    if (area) {
      r = Math.min(150, Math.min(cx - area.left, area.right - cx, cy - area.top, area.bottom - cy) - 20);
    }
    r = Math.max(50, r);

    showOverlay(cx, cy, r);
    const info =
      `center ${Math.round(cx)},${Math.round(cy)} r=${Math.round(r)} shift=${Math.round(dx)},${Math.round(dy)} ` +
      `dot=${dot ? "found" : "not found"} area=${area ? Math.round(area.width) + "x" + Math.round(area.height) : "not found"}`;
    console.log("[Circle Helper]", info);
    toast("drawing... " + info, 8000);
    await sleep(900); // time to see the green outline

    res = await chrome.runtime.sendMessage({ type: "draw", cx, cy, r });
    if (!res || !res.ok) throw new Error((res && res.error) || "draw failed");

    await sleep(300);
    toast("done. " + info, 10000);
  } catch (err) {
    console.error("[Circle Helper]", err);
    toast("error: " + (err && err.message ? err.message : err), 8000);
  } finally {
    busy = false;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (e.key.toLowerCase() !== "c" || e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
  run();
}, true);

toast("v2.2 loaded - hover the dot and press C once");
