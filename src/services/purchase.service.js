import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";
import { v4 as uuid } from "uuid";

const carts = new CartRepository();
const products = new ProductRepository();
const tickets = new TicketRepository();

export const checkoutCart = async ({ cartId, purchaserEmail }) => {
  const cart = await carts.findById(cartId);
  if (!cart) throw new Error("Carrito no encontrado");

  const purchased = [];
  const notPurchased = [];
  let amount = 0;

  for (const item of cart.products) {
    const p = await products.getProductById(item.product._id); // corregido a getProductById
    if (!p || p.stock < item.quantity) {
      notPurchased.push({
        product: item.product._id,
        requested: item.quantity,
        available: p ? p.stock : 0,
      });
      continue;
    }

    p.stock -= item.quantity;
    await products.updateProduct(p._id, { stock: p.stock }); // evitar usar p.save()

    const subtotal = item.quantity * p.price;
    amount += subtotal;
    purchased.push({
      product: p._id,
      quantity: item.quantity,
      unitPrice: p.price,
      subtotal,
    });
  }

  const ticket = await tickets.create({
    code: uuid(),
    amount,
    purchaser: purchaserEmail,
    itemsPurchased: purchased,
    itemsNotPurchased: notPurchased,
  });

  const remaining = notPurchased.map((n) => ({
    product: n.product,
    quantity: n.requested,
  }));
  await carts.setProducts(cartId, remaining);

  return { ticket, purchased, notPurchased, amount };
};
