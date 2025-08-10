import { usuarios } from "../data/usuarios.js";

export class UsuariosManager {
  static get() {
    return usuarios;
  }

  static create(user) {
    let id = 1;
    if (usuarios.length > 0) {
      id = Math.max(...usuarios.map((d) => d.id)) + 1; // los ... son aquí el operador spread
    }

    let nuevoUsuario = {
      id,
      ...user,
    };

    usuarios.push(nuevoUsuario);

    return nuevoUsuario;
  }
}
