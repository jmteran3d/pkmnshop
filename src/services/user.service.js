import UserRepository from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash.js";

class UserService {
  async getById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  async getByEmail(email) {
    return UserRepository.findByEmail(email);
  }

  async createUser(userData) {
    if (!userData.password) throw new Error("Password obligatorio");
    userData.password = hashPassword(userData.password);
    return UserRepository.create(userData);
  }

  async updateUser(id, updateData) {
    return UserRepository.updateById(id, updateData);
  }

  async deleteUser(id) {
    return UserRepository.deleteById(id);
  }
}

export const userService = new UserService();