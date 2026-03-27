const express = require("express");
const {
  getCurrentUserFromToken,
  loginUser,
  registerUser,
} = require("../services/auth/authStore");

const router = express.Router();

function getBearerToken(req) {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

router.post("/signup", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body || {};
    const session = await registerUser({ fullName, email, password });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const session = await loginUser({ email, password });
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      res.status(401).json({ error: "Missing bearer token" });
      return;
    }

    const user = await getCurrentUserFromToken(token);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
