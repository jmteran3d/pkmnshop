import { productRepository } from "../repositories/product.repository.js";

class ProductService {
  async getProducts(query) {
    return productRepository.getProducts({}, query);
  }

  async createProduct(data) {
    if (!data.title || !data.code) throw new Error("Faltan campos obligatorios");
    return productRepository.createProduct(data);
  }

  async updateProduct(id, data) {
    return productRepository.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return productRepository.deleteProduct(id);
  }
}

export const productService = new ProductService();
