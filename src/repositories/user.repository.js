import User from "../dao/models/usuario.model.js";
export default class UserRepository {
  findByEmail(email) { return User.findOne({ email }).lean(); }
  findById(id) { return User.findById(id); }
  create(data) { return User.create(data); }
  updatePassword(id, hash) { return User.findByIdAndUpdate(id, { password: hash }); }
}
