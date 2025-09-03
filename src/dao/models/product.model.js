import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: String,
  description: { type: String, index: "text" },
  thumbnail: { type: String, default: "/images/default.jpg" },
  code: { type: String, unique: true, required: true },
  price: Number,
  stock: Number,
  category: { type: String, index: true },
  status: { type: Boolean, default: true },
  owner: { type: String, default: "admin" }, // opcional
  created_at: { type: Date, default: Date.now() }
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;