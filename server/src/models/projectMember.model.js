const mongoose = require("mongoose");
const {
  PROJECT_MEMBER_ROLE_VALUES,
} = require("../config/projectMembershipRoles");

const projectMemberSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: PROJECT_MEMBER_ROLE_VALUES,
      default: "viewer",
    },
    addedVia: {
      type: String,
      enum: ["team", "manual"],
      required: true,
    },
    sourceTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
  },
  { timestamps: true }
);

projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });
projectMemberSchema.index({ projectId: 1, role: 1 });

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

module.exports = { ProjectMember };
