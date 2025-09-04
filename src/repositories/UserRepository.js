import { usuariosModelo } from "../dao/models/usuario.model.js";

export default class UserRepository {
  async findById(id) {
    return usuariosModelo.findById(id).lean();
  }

  async findByEmail(email) {
    return usuariosModelo.findOne({ email }).lean();
  }

  async create(userData) {
    return usuariosModelo.create(userData);
  }

  async updateById(id, updateData) {
    return usuariosModelo.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return usuariosModelo.findByIdAndDelete(id);
  }
}
