const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    permissions: String,
    status: Number,
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

roleSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Role = mongoose.model("role", roleSchema);

module.exports = Role;
