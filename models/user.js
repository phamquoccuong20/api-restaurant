const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    dateOfBirth: { type: Date, required: false },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["ADMIN", "STAFF", "USER"], default: "STAFF" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    refreshToken: String,
    avatar: String,
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("user", userSchema);

module.exports = User;
