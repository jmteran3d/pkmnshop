import { productService } from "../services/product.service.js";

export const ProductsController = {
  getProducts: async (req, res, next) => {
    try {
      const products = await productService.getProducts(req.query);
      res.json({ status: "success", payload: products });
    } catch (err) {
      next(err);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      // Solo admin
      if (req.user.role !== "admin") return res.status(403).json({ status: "error", error: "No autorizado" });

      const product = await productService.createProduct(req.body);
      res.status(201).json({ status: "success", payload: product });
    } catch (err) {
      next(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ status: "error", error: "No autorizado" });

      const updated = await productService.updateProduct(req.params.id, req.body);
      res.json({ status: "success", payload: updated });
    } catch (err) {
      next(err);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ status: "error", error: "No autorizado" });

      await productService.deleteProduct(req.params.id);
      res.json({ status: "success", message: "Producto eliminado" });
    } catch (err) {
      next(err);
    }
  },
};
