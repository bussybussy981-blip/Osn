const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const deviceRoutes = require("./routes/device");
const messageRoutes = require("./routes/message");
const featureRoutes = require("./routes/features");
const { requireAuth, getAuthUserFromRequest } = require("./utils/auth");
const { connectSavedSessions } = require("./whatsapp/socket");

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.get("/logo.png", (req, res) => {
  res.sendFile(path.join(__dirname, "logo.png"));
});

app.get("/login-motion.mp4", (req, res) => {
  res.sendFile(path.join(__dirname, "login-motion.mp4"));
});

app.get("/login", (req, res) => {
  const authUser = getAuthUserFromRequest(req);

  if (authUser) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register", (req, res) => {
  const authUser = getAuthUserFromRequest(req);

  if (authUser) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/", (req, res) => {
  const authUser = getAuthUserFromRequest(req);

  if (!authUser) {
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/device", requireAuth, deviceRoutes);
app.use("/api/message", requireAuth, messageRoutes);
app.use("/api/features", requireAuth, featureRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
  connectSavedSessions().catch((error) => {
    console.error("Saved session auto-connect failed", error);
  });
});
