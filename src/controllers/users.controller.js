import UserRepository from "../repositories/UserRepository.js";
import UserCurrentDTO from "../dto/userCurrent.dto.js";

const usersRepo = new UserRepository();

export default class UserController {
  // 🔹 Listar todos los usuarios (solo admin)
  static getUsers = async (req, res, next) => {
    try {
      const users = await usersRepo.findAll(); // podrías agregar paginación
      return res.json({ status: "success", payload: users });
    } catch (err) {
      next(err);
    }
  };

  // 🔹 Obtener usuario por ID
  static getUserById = async (req, res, next) => {
    try {
      const { uid } = req.params;
      const user = await usersRepo.findById(uid);
      if (!user) return res.status(404).json({ status: "error", error: "Usuario no encontrado" });

      // Solo admin o el mismo usuario puede ver datos
      if (req.user.role !== "admin" && req.user._id.toString() !== uid) {
        return res.status(403).json({ status: "error", error: "No autorizado" });
      }

      return res.json({ status: "success", payload: new UserCurrentDTO(user) });
    } catch (err) {
      next(err);
    }
  };

  // 🔹 Actualizar usuario
  static updateUser = async (req, res, next) => {
    try {
      const { uid } = req.params;
      const updateData = req.body;

      // Solo admin o dueño
      if (req.user.role !== "admin" && req.user._id.toString() !== uid) {
        return res.status(403).json({ status: "error", error: "No autorizado" });
      }

      // Evitar cambiar rol si no es admin
      if (updateData.role && req.user.role !== "admin") delete updateData.role;

      const updatedUser = await usersRepo.updateById(uid, updateData);
      if (!updatedUser) return res.status(404).json({ status: "error", error: "Usuario no encontrado" });

      return res.json({ status: "success", payload: new UserCurrentDTO(updatedUser) });
    } catch (err) {
      next(err);
    }
  };

  // 🔹 Eliminar usuario (solo admin)
  static deleteUser = async (req, res, next) => {
    try {
      const { uid } = req.params;

      if (req.user.role !== "admin") {
        return res.status(403).json({ status: "error", error: "No autorizado" });
      }

      const deletedUser = await usersRepo.deleteById(uid);
      if (!deletedUser) return res.status(404).json({ status: "error", error: "Usuario no encontrado" });

      return res.json({ status: "success", message: "Usuario eliminado correctamente" });
    } catch (err) {
      next(err);
    }
  };
}
