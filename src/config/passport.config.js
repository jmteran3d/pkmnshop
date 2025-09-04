import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import local from "passport-local";
import bcrypt from "bcrypt";
import { usuariosModelo } from "../dao/models/usuario.model.js";
import { env } from './env.js';

// Extrae JWT desde cookie httpOnly o Authorization header
const cookieExtractor = (req) => req?.cookies?.[env.COOKIE_NAME] || null;

export const iniciarPassport = () => {
  const extractors = [cookieExtractor, ExtractJwt.fromAuthHeaderAsBearerToken()];

  // Estrategia registro
  passport.use(
    "registro",
    new local.Strategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          if (!first_name || !last_name) return done(null, false);

          const hashedPassword = bcrypt.hashSync(password, 10);
          const nuevoUsuario = await usuariosModelo.create({
            first_name,
            last_name,
            email: username,
            password: hashedPassword,
          });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia login
  passport.use(
    "login",
    new local.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const usuario = await usuariosModelo.findOne({ email: username }).lean();
          if (!usuario) return done(null, false);

          if (!bcrypt.compareSync(password, usuario.password)) return done(null, false);

          // eliminar campos sensibles
          const safeUser = {
            _id: usuario._id,
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            role: usuario.role,
            cart: usuario.cart,
          };

          return done(null, safeUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia JWT
  passport.use(
    "jwt",
    new JwtStrategy(
      { secretOrKey: env.JWT_SECRET, jwtFromRequest: ExtractJwt.fromExtractors(extractors) },
      async (payload, done) => {
        try {
          const usuario = await usuariosModelo.findById(payload.uid)
            .select("_id first_name last_name email role cart")
            .lean();

          if (!usuario) return done(null, false, { message: "Usuario no encontrado" });

          return done(null, usuario);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Solo si usas sesiones
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};
