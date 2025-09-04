import Product from "../dao/models/product.model.js";

class ProductRepository {
  async getProducts(filter = {}, options = {}) {
    return Product.paginate(filter, options);
  }

  async getProductById(id) {
    return Product.findById(id).lean();
  }

  async createProduct(data) {
    return Product.create(data);
  }

  async updateProduct(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id) {
    return Product.findByIdAndDelete(id);
  }
}

export const productRepository = new ProductRepository();
