import passport from 'passport';

export const auth = (req, res, next) => {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ status: "error", error: "No hay usuario autenticado" });
  }
  next();
};


export const authJWT = passport.authenticate("jwt", { session: false });

// Autorización por roles (requiere que el usuario ya esté autenticado)
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: "error", error: "No autenticado" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ status: "error", error: "No autorizado" });
  }
  next();
};
