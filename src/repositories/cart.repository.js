import Cart from "../dao/models/cart.model.js";
export default class CartRepository {
  findById(id) { return Cart.findById(id).populate("products.product").lean(); }
  create() { return Cart.create({ products: [] }); }
  setProducts(cartId, products) { return Cart.findByIdAndUpdate(cartId, { products }, { new: true }); }
}
