const mongoose = require('mongoose');
const { Schema } = mongoose;

const importHistorySchema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    import_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("ImportHistory", importHistorySchema);
