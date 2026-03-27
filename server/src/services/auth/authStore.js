const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { demoWorkspace } = require("../../data/demoWorkspace");
const { envList } = require("../../../utils/envUtils");

const DEFAULT_PASSWORD = "Password@123";
const DEFAULT_SIGNUP_DESIGNATION_ID = "designation_software_engineer";
const DEFAULT_SIGNUP_TITLE = "Software Engineer";

let authUsers = [];
let hasSeededUsers = false;

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitiseUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    designationId: user.designationId,
    title: user.title,
  };
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    envList.JWT_SECRET,
    { expiresIn: envList.JWT_EXPIRES_IN }
  );
}

async function ensureSeededUsers() {
  if (hasSeededUsers) {
    return;
  }

  authUsers = await Promise.all(
    demoWorkspace.users.map(async (user) => ({
      ...user,
      passwordHash: await bcrypt.hash(DEFAULT_PASSWORD, 10),
    }))
  );

  hasSeededUsers = true;
}

async function loginUser({ email, password }) {
  await ensureSeededUsers();

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required");
  }

  const existingUser = authUsers.find(
    (user) => user.email.toLowerCase() === String(email).trim().toLowerCase()
  );

  if (!existingUser) {
    throw createHttpError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);

  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password");
  }

  return {
    token: createToken(existingUser),
    user: sanitiseUser(existingUser),
  };
}

async function registerUser({ fullName, email, password }) {
  await ensureSeededUsers();

  if (!fullName || !email || !password) {
    throw createHttpError(400, "Full name, email, and password are required");
  }

  if (String(password).trim().length < 8) {
    throw createHttpError(400, "Password must be at least 8 characters long");
  }

  const normalisedEmail = String(email).trim().toLowerCase();

  const existingUser = authUsers.find((user) => user.email === normalisedEmail);

  if (existingUser) {
    throw createHttpError(409, "An account already exists for this email");
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    fullName: String(fullName).trim(),
    email: normalisedEmail,
    designationId: DEFAULT_SIGNUP_DESIGNATION_ID,
    title: DEFAULT_SIGNUP_TITLE,
    passwordHash: await bcrypt.hash(password, 10),
  };

  authUsers = [newUser, ...authUsers];

  return {
    token: createToken(newUser),
    user: sanitiseUser(newUser),
  };
}

async function getCurrentUserFromToken(token) {
  await ensureSeededUsers();

  try {
    const payload = jwt.verify(token, envList.JWT_SECRET);
    const currentUser = authUsers.find((user) => user.id === payload.sub);

    if (!currentUser) {
      throw createHttpError(401, "Session is no longer valid");
    }

    return sanitiseUser(currentUser);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    throw createHttpError(401, "Invalid or expired token");
  }
}

module.exports = {
  DEFAULT_PASSWORD,
  getCurrentUserFromToken,
  loginUser,
  registerUser,
};
