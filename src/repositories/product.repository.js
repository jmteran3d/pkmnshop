import { ProductsDAO } from "../dao/ProductsDAO.js";

class ProductRepository {
  async getProducts(filter, options) {
    return await ProductsDAO.get(filter, options);
  }

  async getProductById(id) {
    return await ProductsDAO.getById(id);
  }

  async createProduct(data) {
    return await ProductsDAO.create(data);
  }

  async updateProduct(id, data) {
    return await ProductsDAO.update(id, data);
  }

  async deleteProduct(id) {
    return await ProductsDAO.delete(id);
  }
}

export const productRepository = new ProductRepository();
