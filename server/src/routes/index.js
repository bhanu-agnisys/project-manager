const express = require("express");
const authRoutes = require("./auth.routes");
const metaRoutes = require("./meta.routes");
const workspaceRoutes = require("./workspace.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/meta", metaRoutes);
router.use("/workspace", workspaceRoutes);

module.exports = router;
