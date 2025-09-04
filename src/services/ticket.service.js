import TicketRepository from "../repositories/ticket.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import Product from "../dao/models/product.model.js";

class TicketService {
  constructor() {
    this.ticketRepo = new TicketRepository();
    this.cartRepo = new CartRepository();
  }

  async createTicket(user) {
    const cartId = user.cart;
    if (!cartId) throw new Error("Usuario no tiene carrito");

    const cart = await this.cartRepo.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    let amount = 0;
    const itemsPurchased = [];
    const itemsNotPurchased = [];

    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);
      if (product.stock >= item.quantity) {
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
        itemsPurchased.push({
          product: product._id,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal: product.price * item.quantity,
        });
        amount += product.price * item.quantity;
      } else {
        itemsNotPurchased.push({
          product: product._id,
          requested: item.quantity,
          available: product.stock,
        });
      }
    }

    const ticket = await this.ticketRepo.create({
      code: `TICKET-${Date.now()}`,
      purchaser: user.email,
      amount,
      itemsPurchased,
      itemsNotPurchased,
    });

    // Vaciar productos comprados del carrito
    const remainingProducts = cart.products.filter(
      (item) => !itemsPurchased.some((p) => p.product.toString() === item.product._id.toString())
    );
    await this.cartRepo.setProducts(cartId, remainingProducts);

    return ticket;
  }

  async getTickets() {
    return this.ticketRepo.getAll();
  }

  async getTicketById(ticketId) {
    const ticket = await this.ticketRepo.getById(ticketId);
    if (!ticket) throw new Error("Ticket no encontrado");
    return ticket;
  }
}

export const ticketService = new TicketService();