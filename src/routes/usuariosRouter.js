import { Router } from "express";
import { usuariosModelo } from "../dao/models/usuario.model.js";
import { auth, authJWT, authorizeRoles } from "../middleware/auth.js";
import { hashPassword } from "../utils/hash.js";

export const router = Router();

// Listar usuarios (solo admin)
router.get('/', authJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await usuariosModelo.find().select('-password');
    res.json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al obtener usuarios' });
  }
});

// Obtener por id (autenticado)
router.get('/:id', authJWT, async (req, res) => {
  try {
    const user = await usuariosModelo.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
    res.json({ status: 'success', payload: user });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al obtener usuario' });
  }
});

// Crear (admin)
router.post('/', authJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: 'error', error: 'Campos obligatorios faltantes' });
    }

    const exists = await usuariosModelo.findOne({ email });
    if (exists) return res.status(409).json({ status: 'error', error: 'Email ya registrado' });

    const user = await usuariosModelo.create({
      first_name,
      last_name,
      email,
      age: age ?? 0,
      password: hashPassword(password),
      role: role ?? 'user'
    });

    res.status(201).json({ status: 'success', payload: { _id: user._id } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al crear usuario' });
  }
});

// Actualizar (admin)
router.put('/:id', authJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const update = { ...rest };
    if (password) update.password = hashPassword(password);

    const user = await usuariosModelo.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });

    res.json({ status: 'success', payload: { _id: user._id } });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al actualizar usuario' });
  }
});

// Eliminar (admin)
router.delete('/:id', authJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await usuariosModelo.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });

    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al eliminar usuario' });
  }
});