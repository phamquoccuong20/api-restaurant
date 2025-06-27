
const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table", // Liên kết với bảng table
    },
    orderType: {
      type: String,
      enum: ["dine-in", "takeaway"],
    },
    status: {
      type: String,
      enum: ["pending", "preparing", "served", "completed", "cancelled"],
      default: "pending",
    },
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

orderSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Order = mongoose.model("order", orderSchema);

module.exports = Order;
