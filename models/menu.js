const { required } = require("joi");
const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image_url: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

menuSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Menu = mongoose.model("menu", menuSchema);

module.exports = Menu;
