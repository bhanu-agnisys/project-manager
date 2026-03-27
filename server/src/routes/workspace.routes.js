const express = require("express");
const { demoWorkspace } = require("../data/demoWorkspace");

const router = express.Router();

router.get("/demo", (req, res) => {
  res.status(200).json({
    workspace: demoWorkspace,
    generatedAt: new Date().toISOString(),
  });
});

module.exports = router;
