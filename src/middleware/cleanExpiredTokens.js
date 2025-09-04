import PasswordReset from "../dao/models/passwordReset.model.js";

export const cleanExpiredTokens = async (req, res, next) => {
  try {
    const now = new Date();
    // Borra tokens creados hace más de 1 hora
    await PasswordReset.deleteMany({ createdAt: { $lt: new Date(now - 60 * 60 * 1000) } });
    next();
  } catch (err) {
    next(err);
  }
};
