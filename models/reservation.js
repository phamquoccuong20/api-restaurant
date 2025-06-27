const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    reservationDate: { type: Date, required: true },
    reservationTime: { type: String, required: true },
    duration: { type: Number, default: 2 },
    numberOfGuests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },
    specialRequests: { type: String },
    contactPhone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

reservationSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Reservation = mongoose.model("reservation", reservationSchema);

module.exports = Reservation;
