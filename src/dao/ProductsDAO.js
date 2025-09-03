import Product from "./models/product.model";

export class ProductsDAO {
  static async get(filter = {}, options = {}) {
    return await Product.paginate(filter, options);
  }

  static async getById(id) {
    return await Product.findById(id);
  }

  static async create(product) {
    return await Product.create(product);
  }

  static async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}
