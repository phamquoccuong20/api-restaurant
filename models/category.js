const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }


categorySchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
