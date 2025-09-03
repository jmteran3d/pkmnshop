import { productRepository } from "../repositories/product.repository.js";

class ProductService {
  async getProducts(query) {
    return await productRepository.getProducts({}, query);
  }

  async createProduct(data) {
    if (!data.title || !data.code) {
      throw new Error("Faltan campos obligatorios");
    }
    return await productRepository.createProduct(data);
  }

  async updateProduct(id, data) {
    return await productRepository.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return await productRepository.deleteProduct(id);
  }
}

export const productService = new ProductService();
