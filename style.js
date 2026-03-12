// ------------------------------------------------------------
// FEELFORM OS — BASIC ENGINE SCRIPT
// Handles:
// 1. Tab switching
// 2. Memory entries
// 3. Session cards
// ------------------------------------------------------------

// TAB SWITCHING
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


// MEMORY INPUT HANDLER
const noteInput   = document.getElementById("ff-note-input");
const eventInput  = document.getElementById("ff-event-input");
const signalInput = document.getElementById("ff-signal-input");

const notesBox   = document.getElementById("ff-notes");
const eventsBox  = document.getElementById("ff-events");
const signalsBox = document.getElementById("ff-signals");
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
      <div class="ff-memory-session-card">
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
