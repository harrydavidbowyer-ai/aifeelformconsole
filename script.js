/* ----------------------------------------------------
   FEELFORM CONSOLE — CORE UI LOGIC
---------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------
     PANEL SWITCHING
  ---------------------------------------------------- */
  const navLinks = document.querySelectorAll(".console-nav a");
  const navDots = document.querySelectorAll(".nav-dot");
  const panels = document.querySelectorAll(".panel");

  function showPanel(targetId) {
    panels.forEach((panel) => {
      panel.style.display = panel.id === targetId ? "block" : "none";
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-target") === targetId);
    });

    navDots.forEach((dot) => {
      dot.classList.toggle("active", dot.getAttribute("data-target") === targetId);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-target");
      showPanel(target);
    });
  });

  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = dot.getAttribute("data-target");
      showPanel(target);
    });
  });

  // Default panel
  showPanel("identity");

  /* ----------------------------------------------------
     SOUND ENGINE
  ---------------------------------------------------- */
  const soundToggle = document.getElementById("sound-toggle");
  let soundEnabled = false;

  const clickSound = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7c1f3e3c52.mp3?filename=click-124467.mp3"
  );

  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = `Sound: ${soundEnabled ? "ON" : "OFF"}`;
  });

  document.querySelectorAll(".console-nav a, .nav-dot").forEach((el) => {
    el.addEventListener("click", () => {
      if (soundEnabled) clickSound.play();
    });
  });

}); // END DOMContentLoaded



/* ----------------------------------------------------
   FEELFORM CYCLE ENGINE — v1.0
   (Collects all Console inputs, generates a cycle,
    sends it to backend, updates Memory Engine)
---------------------------------------------------- */

async function completeCycle() {

  // 1. COLLECT IDENTITY INPUTS
  const identityName = document.querySelector("#identity input[placeholder='Enter name']").value || "";
  const identityRole = document.querySelector("#identity input[placeholder='Enter role']").value || "";
  const altitude = document.querySelector("#identity input[type='range']").value || 0;
  const mode = document.querySelector("#identity select").value || "";

  // 2. COLLECT REFLECTION INPUTS
  const feeling = document.querySelector("#reflection input[placeholder='What are you feeling?']").value || "";
  const warmth = document.querySelectorAll("#reflection input[type='range']")[0].value || 0;
  const density = document.querySelectorAll("#reflection input[type='range']")[1].value || 0;
  const nearness = document.querySelectorAll("#reflection input[type='range']")[2].value || 0;
  const clarity = document.querySelectorAll("#reflection input[type='range']")[3].value || 0;

  // 3. DECISION INPUTS (placeholder logic)
  const vectorA = "Orientation toward clarity";
  const vectorB = "Orientation toward expansion";
  const vectorC = "Orientation toward depth";
  const angle = 0;

  // 4. RITUAL STATE
  const intensity = (Number(warmth) + Number(density) + Number(nearness) + Number(clarity)) / 4;

  // 5. BUILD THE CYCLE OBJECT
  const cycle = {
    identity: {
      name: identityName,
      role: identityRole,
      altitude,
      mode
    },
    reflection: {
      feeling,
      warmth,
      density,
      nearness,
      clarity
    },
    decision: {
      vectorA,
      vectorB,
      vectorC,
      angle
    },
    ritual: {
      intensity
    },
    pulse: feeling,
    timestamp: Date.now()
  };

  // 6. SEND TO BACKEND
  await fetch("https://feelform-memory-engine-mq5j.onrender.com/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cycle)
  });

  // 7. UPDATE MEMORY ENGINE
  renderCinematicMemory();
}



/* ----------------------------------------------------
   CINEMATIC MEMORY ENGINE — SOLAR–FLARE v4.1
---------------------------------------------------- */

const MEMORY_URL = "https://feelform-memory-engine-mq5j.onrender.com/api/memory";

/* LOAD MEMORY */
async function loadCinematicMemory() {
  try {
    const res = await fetch(MEMORY_URL);
    return await res.json();
  } catch (err) {
    console.error("Memory Engine error:", err);
    return null;
  }
}

/* RENDER META HUD */
function renderMeta(memory) {
  const meta = document.querySelector("#memory-meta");
  meta.innerHTML = `
    <p><strong>Cycles:</strong> ${memory.meta.total_cycles}</p>
    <p><strong>Last ignition:</strong> ${
      memory.meta.last_cycle
        ? new Date(memory.meta.last_cycle.timestamp).toLocaleString()
        : "—"
    }</p>
  `;
}

/* RENDER CONSTELLATION (Δ ○ ∴) */
function renderConstellation(memory) {
  const el = document.querySelector("#memory-constellation");

  const cycles = memory.meta.total_cycles;
  const last = memory.meta.last_cycle;
  const prev = memory.sessions[memory.sessions.length - 2];

  let glyph = "○";

  if (prev) {
    const changed =
      last.pulse !== prev.pulse ||
      last.reflection !== prev.reflection ||
      last.identity !== prev.identity;

    if (changed) glyph = "Δ";
  }

  if (cycles % 3 === 0 && cycles > 0) glyph = "∴";

  el.textContent = glyph;

  el.classList.remove("drift");
  setTimeout(() => el.classList.add("drift"), 50);
}

/* RENDER IDENTITY DRIFT TIMELINE */
function renderIdentity(memory) {
  const container = document.querySelector("#memory-identity");
  container.innerHTML = "";

  memory.identity.forEach((id, i) => {
    const node = document.createElement("div");
    node.classList.add("node");
    if (i === memory.identity.length - 1) node.classList.add("recent");
    container.appendChild(node);
  });
}

/* RENDER TRAJECTORY CHAINS */
function renderTrajectory(memory) {
  const container = document.querySelector("#memory-trajectory");
  container.innerHTML = memory.trajectory
    .map((t) => `<div>${t}</div>`)
    .join("");
}

/* RENDER SESSION CARDS */
function renderSessionCards(memory) {
  const container = document.querySelector("#memory-sessions");
  container.innerHTML = memory.sessions
    .map(
      (s) => `
      <div class="session-card">
        <p><strong>Pulse:</strong> ${s.pulse}</p>
        <p><strong>Reflection:</strong> ${s.reflection}</p>
        <p><strong>Identity:</strong> ${s.identity}</p>
        <p style="opacity:0.6; font-size:0.8rem;">
          ${new Date(s.timestamp).toLocaleString()}
        </p>
      </div>
    `
    )
    .join("");
}

/* MASTER RENDERER */
async function renderCinematicMemory() {
  const memory = await loadCinematicMemory();
  if (!memory) return;

  renderMeta(memory);
  renderConstellation(memory);
  renderIdentity(memory);
  renderTrajectory(memory);
  renderSessionCards(memory);
}

/* LOAD WHEN MEMORY PANEL IS OPENED */
document.querySelectorAll(".console-nav a, .nav-dot").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.getAttribute("data-target");
    if (target === "memory") {
      renderCinematicMemory();
    }
  });
});
