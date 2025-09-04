import CartRepository from "../repositories/cart.repository.js";
import Product from "../dao/models/product.model.js";

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getCartById(cartId) {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  async createCart() {
    return this.cartRepository.create();
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const product = await Product.findById(productId).lean();
    if (!product) throw new Error("Producto no encontrado");

    const existingIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId.toString()
    );

    if (existingIndex >= 0) {
      cart.products[existingIndex].quantity += quantity;
    } else {
      cart.products.push({ product: product._id, quantity });
    }

    return this.cartRepository.setProducts(cartId, cart.products);
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    const filtered = cart.products.filter(
      (item) => item.product._id.toString() !== productId.toString()
    );
    return this.cartRepository.setProducts(cartId, filtered);
  }

  async clearCart(cartId) {
    return this.cartRepository.setProducts(cartId, []);
  }
}

export const cartService = new CartService();