import { cartService } from "../services/cart.service.js";

export const CartsController = {
  getCart: async (req, res, next) => {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      res.json({ status: "success", payload: cart });
    } catch (err) {
      next(err);
    }
  },

  createCart: async (req, res, next) => {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({ status: "success", payload: newCart });
    } catch (err) {
      next(err);
    }
  },

  addProductToCart: async (req, res, next) => {
    try {
      if (req.user.role !== "user") return res.status(403).json({ status: "error", error: "Solo usuarios pueden agregar productos" });

      const updated = await cartService.addProductToCart(req.params.cid, req.params.pid, req.body.quantity);
      res.json({ status: "success", payload: updated });
    } catch (err) {
      next(err);
    }
  },

  removeProductFromCart: async (req, res, next) => {
    try {
      const updated = await cartService.removeProductFromCart(req.params.cid, req.params.pid);
      res.json({ status: "success", payload: updated });
    } catch (err) {
      next(err);
    }
  },

  clearCart: async (req, res, next) => {
    try {
      const cleared = await cartService.clearCart(req.params.cid);
      res.json({ status: "success", payload: cleared });
    } catch (err) {
      next(err);
    }
  },
};
