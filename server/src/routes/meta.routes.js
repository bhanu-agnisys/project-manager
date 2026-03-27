const express = require("express");
const {
  PERMISSION_GROUPS,
  PERMISSION_VALUES,
} = require("../config/permissions");
const {
  PROJECT_MEMBER_ROLE_VALUES,
} = require("../config/projectMembershipRoles");

const router = express.Router();

router.get("/permissions", (req, res) => {
  res.status(200).json({
    permissions: PERMISSION_VALUES,
    groups: PERMISSION_GROUPS,
    projectRoles: PROJECT_MEMBER_ROLE_VALUES,
  });
});

module.exports = router;
