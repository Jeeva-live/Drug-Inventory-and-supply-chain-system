const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const vendorRoutes = require("./routes/vendors.routes");
const alertRoutes = require("./routes/alerts.routes");
const qrRoutes = require("./routes/qr.routes");
const aiRoutes = require("./routes/ai.routes");
const usersRoutes = require("./routes/users.routes");
const statsRoutes = require("./routes/stats.routes");
const settingsRoutes = require("./routes/settings.routes");
const alertEngine = require("./services/alert.engine");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/settings", settingsRoutes);

module.exports = app;
