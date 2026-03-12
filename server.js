import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

// -----------------------------------------------------
// CORS — REQUIRED FOR GITHUB PAGES FRONTEND
// -----------------------------------------------------
app.use(
  cors({
    origin: [
      "https://harrydavidbowyer-ai.github.io", // GitHub Pages frontend
      "http://localhost:3000"                  // local dev
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

// -----------------------------------------------------
// Middleware
// -----------------------------------------------------
app.use(express.json());

// -----------------------------------------------------
// In-memory Memory Engine
// -----------------------------------------------------
let memory = {
  sessions: [],
  identity: [],
  trajectory: [],
  meta: {
    total_cycles: 0,
    last_cycle: null
  }
};

// -----------------------------------------------------
// ORIGINAL ROUTES
// -----------------------------------------------------

// POST /api/session
app.post("/api/session", (req, res) => {
  const cycle = req.body;

  memory.sessions.push(cycle);

  if (cycle.identity) {
    memory.identity.push(cycle.identity);
  }

  const chain = `${cycle.pulse} → ${cycle.reflection} → ${cycle.identity}`;
  memory.trajectory.push(chain);

  memory.meta.total_cycles = memory.sessions.length;
  memory.meta.last_cycle = cycle;

  res.json({ status: "ok", stored: cycle });
});

// GET /api/memory
app.get("/api/memory", (req, res) => {
  res.json(memory);
});

// -----------------------------------------------------
// MIRROR ROUTES FOR FRONTEND COMPATIBILITY
// These match what your index.html is calling
// -----------------------------------------------------

// GET /cycles  → return sessions array
app.get("/cycles", (req, res) => {
  res.json(memory.sessions);
});

// POST /cycles  → store a new cycle
app.post("/cycles", (req, res) => {
  const cycle = req.body;

  memory.sessions.push(cycle);

  if (cycle.identity) {
    memory.identity.push(cycle.identity);
  }

  const chain = `${cycle.pulse} → ${cycle.reflection} → ${cycle.identity}`;
  memory.trajectory.push(chain);

  memory.meta.total_cycles = memory.sessions.length;
  memory.meta.last_cycle = cycle;

  res.json({ status: "ok", stored: cycle });
});

// -----------------------------------------------------
// Root route
// -----------------------------------------------------
app.get("/", (req, res) => {
  res.send("FeelForm Memory Engine is running.");
});

// -----------------------------------------------------
// Start server
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`Memory Engine running on port ${PORT}`);
});
