import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, index: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,                   // total pagado de los ítems con stock
  purchaser: String,                // email del comprador
  itemsPurchased: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    unitPrice: Number,
    subtotal: Number
  }],
  itemsNotPurchased: [{             // sin stock suficiente
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    requested: Number,
    available: Number
  }]
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
