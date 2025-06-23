const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const roleSchema = require("./role").schema;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    dateOfBirth: { type: Date, required: false },
    password: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    role: { type: String, enum: ["ADMIN", "STAFF", "USER"], default: "USER" },
    refresh_token: String,
    avatar: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }, 
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("user", userSchema);

module.exports = User;
