export default class UserCurrentDTO {
  constructor(user) {
    this.firstName = user.first_name;   // corregido
    this.lastName = user.last_name;     // corregido
    this.email = user.email;
    this.username = user.email.split("@")[0];
    this.role = user.role;
    this.cart = user.cart; // aquí puedes devolver solo el ID si prefieres
  }
}