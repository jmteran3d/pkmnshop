export const logger = (req, res, next) => {
  console.log(
    `Se ejecuto la ruta ${req.url} - metodo: ${
      req.method
    } el ${new Date().toLocaleDateString()}`
  );

  next();
};
