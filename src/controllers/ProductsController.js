import { productService } from "../services/product.service.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts(req.query);
    res.json({ status: "success", payload: products });
  } catch (error) {
    next(error); // delego el manejo de errores al middleware central
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
};
