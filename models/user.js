const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const roleSchema = require("./role").schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"], // Trạng thái còn làm hay đã nghỉ
      default: "active",
    },
    role_id: {
      type: String,
      enum: ["ADMIN", "STAFF"],
      default: "ADMIN",
    },
    refresh_token: String,
    avatar: String,

    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("user", userSchema);

module.exports = User;
