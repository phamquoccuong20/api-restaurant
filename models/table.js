const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"],
      default: "AVAILABLE",
    },
    location: {
      type: String,
      enum: ["INSIDE", "OUTSIDE", "BALCONY"],
      default: "INSIDE",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

tableSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
