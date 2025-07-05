const mongoose = require('mongoose');
const mongoose_delete = require("mongoose-delete");

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Liên kết với đơn hàng
    required: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  payment_type: {
    type: String,
    enum: ['cash', 'card', 'momo', 'zalo_pay', 'bank_transfer'],
    required: true,
  },
  paid_at: {
    type: Date,
    default: Date.now,
  },
});


paymentSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;

