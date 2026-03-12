/* ----------------------------------------------------
   FEELFORM OS — SCRIPT.JS
   Navigation + Synthetic Sound Engine
---------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------
     AUDIO ENGINE
  ---------------------------------------------------- */

  const FFSound = {
    enabled: false,
    ctx: null,
    master: null,

    init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.6;
        this.master.connect(this.ctx.destination);
      }
    },

    unlock() {
      // Required for Safari/iOS
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    },

    toggle() {
      this.enabled = !this.enabled;
      const btn = document.querySelector("#sound-toggle");
      if (btn) btn.textContent = this.enabled ? "Sound: ON" : "Sound: OFF";
    },

    play(type = "ui") {
      if (!this.enabled) return;
      if (!this.ctx) this.init();
      this.unlock();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Default tone
      let freq = 220;
      let attack = 0.01;
      let release = 0.25;

      // Tone variations
      if (type === "nav") {
        freq = 320;
        release = 0.18;
      }
      if (type === "open") {
        freq = 180;
        release = 0.35;
      }
      if (type === "dot") {
        freq = 260;
        release = 0.12;
      }

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + release);

      osc.connect(gain);
      gain.connect(this.master);

      osc.start();
      osc.stop(this.ctx.currentTime + release);
    }
  };

  /* ----------------------------------------------------
     SOUND TOGGLE BUTTON
  ---------------------------------------------------- */

  const soundToggle = document.querySelector("#sound-toggle");
  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      FFSound.toggle();
      FFSound.play("ui");
    });
  }

  /* ----------------------------------------------------
     NAVIGATION LOGIC
  ---------------------------------------------------- */

  const navLinks = document.querySelectorAll(".console-nav a");
  const panels = document.querySelectorAll(".panel");
  const dots = document.querySelectorAll(".nav-dot");

  // NAV LINKS
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.getAttribute("data-target");

      panels.forEach(panel => {
        panel.style.display = panel.id === target ? "block" : "none";
      });

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      FFSound.play("nav");
    });
  });

  // NAV DOTS
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = dot.getAttribute("data-target");

      panels.forEach(panel => {
        panel.style.display = panel.id === target ? "block" : "none";
      });

      dots.forEach(d => d.classList.remove("active"));
      dot.classList.add("active");

      FFSound.play("dot");
    });
  });

  // DEFAULT PANEL
  if (panels.length > 0) {
    panels.forEach((p, i) => p.style.display = i === 0 ? "block" : "none");
  }

});
