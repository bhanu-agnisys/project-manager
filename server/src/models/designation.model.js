const mongoose = require("mongoose");
const { PERMISSION_VALUES } = require("../config/permissions");

const designationSchema = new mongoose.Schema(
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
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    permissions: {
      type: [String],
      enum: PERMISSION_VALUES,
      default: [],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

designationSchema.index({ key: 1 }, { unique: true });
designationSchema.index({ name: 1 });

const Designation = mongoose.model("Designation", designationSchema);

module.exports = { Designation };
