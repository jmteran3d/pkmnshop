import PasswordReset from "../dao/models/passwordReset.model.js";
export default class PasswordResetRepository {
  create(data) { return PasswordReset.create(data); }
  findByToken(token) { return PasswordReset.findOne({ token }).lean(); }
  deleteById(id) { return PasswordReset.findByIdAndDelete(id); }
}
