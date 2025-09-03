export default class UserCurrentDTO {
  constructor(user) {
    this.firstName=user.nombre;
    this.lastName=user.apellido;
    this.email = user.email;
    this.username=user.email.split("@")[0];
    this.role = user.role;
    this.cart = user.cart; // si quieres, sólo el id del carrito
  }
}
