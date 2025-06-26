const { required } = require("joi");
const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const itemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },
    quantity: Number,
    note: String,

    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

itemSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Item = mongoose.model("item", itemSchema);

module.exports = Item;
