const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["planning", "in_progress", "completed", "scrapped"],
      default: "planning",
    },
    teams: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Team",
      default: [],
    },
    canvas: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

projectSchema.index({ key: 1 }, { unique: true });
projectSchema.index({ status: 1 });

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
