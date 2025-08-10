export const auth = (req, res, next) => {
  let { user, password } = req.query;
  if (user != "admin" || password != "123456") {
    res.setHeader("Content-Type", "application/json");
    return res.status(403).json({ error: `No autorizado` });
  }

  next();
};
