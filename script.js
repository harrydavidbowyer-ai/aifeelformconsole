/* ----------------------------------------------------
   FEELFORM SYNTHETIC SOUND ENGINE — v2.0
---------------------------------------------------- */

const FFSound = {
  enabled: false,
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  unlock() {
    this.init();
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  play(freq = 440, duration = 0.12, type = "sine") {
    if (!this.enabled) return;

    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  click() {
    this.play(420, 0.08, "triangle");
  },

  ignite() {
    this.play(180, 0.25, "sine");
    setTimeout(() => this.play(360, 0.25, "sine"), 80);
    setTimeout(() => this.play(720, 0.25, "sine"), 160);
  }
};



/* ----------------------------------------------------
   FEELFORM CONSOLE — CORE UI LOGIC
---------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* Unlock audio on first interaction */
  document.body.addEventListener("click", () => {
    FFSound.unlock();
  }, { once: true });

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
      if (FFSound.enabled) FFSound.click();
    });
  });

  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = dot.getAttribute("data-target");
      showPanel(target);
      if (FFSound.enabled) FFSound.click();
    });
  });

  // Default panel
  showPanel("identity");

  /* ----------------------------------------------------
     SOUND TOGGLE
  ---------------------------------------------------- */
  const soundToggle = document.getElementById("sound-toggle");

  soundToggle.addEventListener("click", () => {
    FFSound.enabled = !FFSound.enabled;
    soundToggle.textContent = `Sound: ${FFSound.enabled ? "ON" : "OFF"}`;
    FFSound.unlock();
  });

}); // END DOMContentLoaded



/* ----------------------------------------------------
   DECISION GEOMETRY ENGINE — v1.0
---------------------------------------------------- */

function computeDecisionGeometry({ clarity, expansion, depth }) {

  const A = clarity / 100;
  const B = expansion / 100;
  const C = depth / 100;

  const magnitude = Math.sqrt(A*A + B*B + C*C);
  const angle = Math.atan2(B, A) * (180 / Math.PI);

  let dominant = "Clarity";
  if (B > A && B > C) dominant = "Expansion";
  if (C > A && C > B) dominant = "Depth";

  return {
    A,
    B,
    C,
    magnitude,
    angle: Math.round(angle),
    dominant
  };
}



/* ----------------------------------------------------
   SOLAR–FLARE IGNITION
---------------------------------------------------- */

function igniteSolarFlare() {
  const flare = document.getElementById("solar-flare-ignition");

  flare.classList.add("active");

  if (FFSound.enabled) FFSound.ignite();

  setTimeout(() => {
    flare.classList.remove("active");
  }, 600);
}



/* ----------------------------------------------------
   FEELFORM CYCLE ENGINE — v1.0
---------------------------------------------------- */

async function completeCycle() {

  const identityName = document.querySelector("#identity input[placeholder='Enter name']").value || "";
  const identityRole = document.querySelector("#identity input[placeholder='Enter role']").value || "";
  const altitude = document.querySelector("#identity input[type='range']").value || 0;
  const mode = document.querySelector("#identity select").value || "";

  const feeling = document.querySelector("#reflection input[placeholder='What are you feeling?']").value || "";
  const warmth = document.querySelectorAll("#reflection input[type='range']")[0].value || 0;
  const density = document.querySelectorAll("#reflection input[type='range']")[1].value || 0;
  const nearness = document.querySelectorAll("#reflection input[type='range']")[2].value || 0;
  const clarity = document.querySelectorAll("#reflection input[type='range']")[3].value || 0;

  const geometry = computeDecisionGeometry({
    clarity: Number(clarity),
    expansion: Number(warmth),
    depth: Number(density)
  });

  const intensity = (Number(warmth) + Number(density) + Number(nearness) + Number(clarity)) / 4;

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
      vectorA: geometry.A,
      vectorB: geometry.B,
      vectorC: geometry.C,
      angle: geometry.angle,
      magnitude: geometry.magnitude,
      dominant: geometry.dominant
    },
    ritual: {
      intensity
    },
    pulse: feeling,
    timestamp: Date.now()
  };

  await fetch("https://feelform-memory-engine-mq5j.onrender.com/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cycle)
  });

  igniteSolarFlare();

  renderCinematicMemory();

  document.getElementById("vecA").textContent = geometry.A.toFixed(2);
  document.getElementById("vecB").textContent = geometry.B.toFixed(2);
  document.getElementById("vecC").textContent = geometry.C.toFixed(2);

  document.getElementById("decision-angle").textContent = geometry.angle + "°";
  document.getElementById("decision-magnitude").textContent = geometry.magnitude.toFixed(2);
  document.getElementById("decision-dominant").textContent = geometry.dominant;
}



/* ----------------------------------------------------
   CINEMATIC MEMORY ENGINE — SOLAR–FLARE v4.1
---------------------------------------------------- */

const MEMORY_URL = "https://feelform-memory-engine-mq5j.onrender.com/api/memory";

async function loadCinematicMemory() {
  try {
    const res = await fetch(MEMORY_URL);
    return await res.json();
  } catch (err) {
    console.error("Memory Engine error:", err);
    return null;
  }
}

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

function renderTrajectory(memory) {
  const container = document.querySelector("#memory-trajectory");
  container.innerHTML = memory.trajectory
    .map((t) => `<div>${t}</div>`)
    .join("");
}

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

async function renderCinematicMemory() {
  const memory = await loadCinematicMemory();
  if (!memory) return;

  renderMeta(memory);
  renderConstellation(memory);
  renderIdentity(memory);
  renderTrajectory(memory);
  renderSessionCards(memory);
}

document.querySelectorAll(".console-nav a, .nav-dot").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.getAttribute("data-target");
    if (target === "memory") {
      renderCinematicMemory();
    }
  });
});
