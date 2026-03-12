// ------------------------------------------------------------
// FEELFORM OS — BEHAVIOR PACK 1
// Adds:
// 1. Tab switching
// 2. Memory engine
// 3. Micro‑parallax
// 4. Solar‑flare breathing
// 5. Session bloom animation
// ------------------------------------------------------------


// ------------------------------------------------------------
// TAB SWITCHING
// ------------------------------------------------------------
document.querySelectorAll(".ff-console-tab").forEach(tab => {
  tab.addEventListener("click", () => {

    // deactivate all tabs
    document.querySelectorAll(".ff-console-tab")
      .forEach(t => t.classList.remove("ff-active"));

    // activate clicked tab
    tab.classList.add("ff-active");

    // hide all panels
    document.querySelectorAll(".ff-console-panel")
      .forEach(p => p.classList.remove("ff-active"));

    // show matching panel
    const panelId = "panel-" + tab.textContent.trim().toLowerCase();
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add("ff-active");
  });
});


// ------------------------------------------------------------
// MEMORY ENGINE
// ------------------------------------------------------------
const noteInput   = document.getElementById("ff-note-input");
const eventInput  = document.getElementById("ff-event-input");
const signalInput = document.getElementById("ff-signal-input");

const notesBox    = document.getElementById("ff-notes");
const eventsBox   = document.getElementById("ff-events");
const signalsBox  = document.getElementById("ff-signals");
const sessionsBox = document.getElementById("ff-sessions");

document.getElementById("ff-add").addEventListener("click", () => {
  const note   = noteInput.value.trim();
  const event  = eventInput.value.trim();
  const signal = signalInput.value.trim();

  // Add to memory panels
  if (note)   notesBox.innerHTML   += `<div>${note}</div>`;
  if (event)  eventsBox.innerHTML  += `<div>${event}</div>`;
  if (signal) signalsBox.innerHTML += `<div>${signal}</div>`;

  // Add to sessions timeline
  if (note || event || signal) {
    const time = new Date().toLocaleTimeString();
    const text = note || event || signal;

    sessionsBox.innerHTML += `
      <div class="ff-memory-session-card ff-bloom">
        <div>${time}</div>
        <div>${text}</div>
      </div>
    `;
  }

  // Clear inputs
  noteInput.value = "";
  eventInput.value = "";
  signalInput.value = "";
});


// ------------------------------------------------------------
// MICRO‑PARALLAX (hover-based subtle movement)
// ------------------------------------------------------------
const root = document.getElementById("ff-root");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 4;
  const y = (e.clientY / window.innerHeight - 0.5) * 4;

  root.style.transform = `translate(${x}px, ${y}px)`;
});


// ------------------------------------------------------------
// SOLAR‑FLARE BREATHING (slow scale + glow)
// ------------------------------------------------------------
let t = 0;
function solarBreath() {
  t += 0.005;

  const scale = 1 + Math.sin(t) * 0.01;
  const glow  = 0.25 + Math.sin(t * 0.5) * 0.15;

  root.style.boxShadow =
    `inset 0 0 80px rgba(248,181,0,${glow})`;

  root.style.transform += ` scale(${scale})`;

  requestAnimationFrame(solarBreath);
}
solarBreath();


// ------------------------------------------------------------
// SESSION BLOOM (soft pop-in animation)
// ------------------------------------------------------------
const observer = new MutationObserver(() => {
  document.querySelectorAll(".ff-memory-session-card.ff-bloom")
    .forEach(card => {
      card.style.opacity = "0";
      card.style.transform = "scale(0.9)";
      requestAnimationFrame(() => {
        card.style.transition = "0.35s ease";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
        card.classList.remove("ff-bloom");
      });
    });
});

observer.observe(sessionsBox, { childList: true });
