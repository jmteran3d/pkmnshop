# Backend Ecommerce - Proyecto Final

## 📌 Descripción

Este proyecto es un backend completo de ecommerce desarrollado con **Node.js**, **Express**, **MongoDB** y **Passport.js**, siguiendo una arquitectura profesional basada en **DAO, Repository, Services y DTOs**.  

Incluye:

- Autenticación con **JWT** y cookies HTTP-only.  
- Gestión de **usuarios, productos, carritos y tickets**.  
- Middleware de **autorización por roles** (`admin` y `user`).  
- Sistema de **recuperación de contraseña** con enlace expirable (TTL).  
- **Seguridad avanzada**: Helmet, CORS, rate limiting.  
- Persistencia en MongoDB, con modelos optimizados para escalabilidad.  

Este proyecto cumple con la consigna final de **Backend 2**, listo para producción.

---

## ⚙️ Tecnologías

- Node.js v20+  
- Express.js  
- MongoDB & Mongoose  
- Passport.js (Local & JWT)  
- bcrypt  
- nodemailer  
- jsonwebtoken  
- Helmet, CORS, express-rate-limit  
- Handlebars (para vistas)  

---

## 📝 Instalación

1. Clonar el repositorio

2. Instalar dependencias:
npm install

3. Configurar variables de entorno en .env

4. Iniciar servidor
npm start
Servidor corriendo en: http://localhost:3000

🔑 Rutas Principales
Usuarios
Método	Ruta	Roles	Descripción
GET	/api/usuarios	admin	Listar todos los usuarios
GET	/api/usuarios/:id	admin	Obtener usuario por ID
PUT	/api/usuarios/:id	admin	Actualizar usuario
DELETE	/api/usuarios/:id	admin	Eliminar usuario
Sesiones
Método	Ruta	Roles	Descripción
POST	/api/sessions/register	-	Registro de usuario
POST	/api/sessions/login	-	Login con JWT y cookie
GET	/api/sessions/current	user/admin	Obtener datos del usuario logueado
POST	/api/sessions/logout	user/admin	Cerrar sesión
POST	/api/sessions/request-reset	-	Solicitar recuperación de contraseña
POST	/api/sessions/reset-password	-	Restablecer contraseña (token expira)
Productos
Método	Ruta	Roles	Descripción
GET	/api/products	user/admin	Listar productos
POST	/api/products	admin	Crear producto
PUT	/api/products/:id	admin	Actualizar producto
DELETE	/api/products/:id	admin	Eliminar producto
Carritos
Método	Ruta	Roles	Descripción
POST	/api/carts	user/admin	Crear carrito
GET	/api/carts/:cid	user/admin	Consultar carrito
POST	/api/carts/:cid/products/:pid	user	Agregar producto
DELETE	/api/carts/:cid/products/:pid	user	Eliminar producto
DELETE	/api/carts/:cid	user	Vaciar carrito
Tickets
Método	Ruta	Roles	Descripción
POST	/api/tickets	user	Generar ticket (checkout)
GET	/api/tickets	admin	Listar todos los tickets
GET	/api/tickets/:tid	admin/user	Obtener ticket por ID
🛡️ Seguridad y Middleware

JWT: Autenticación sin estado, token en cookie HTTP-only.

Roles: admin y user para autorización de rutas.

TTL token recuperación: El token de reset de contraseña expira automáticamente.

Helmet: Protege contra vulnerabilidades HTTP.

CORS: Configurable para dominios permitidos.

Rate limiting: Limita la cantidad de requests por IP.

Logger: Registra rutas ejecutadas y fecha/hora.

📦 Arquitectura
src/
├─ config/        # DB, Passport, Mailer
├─ controllers/   # Lógica de endpoints
├─ dao/           # Modelos y DAOs
├─ dto/           # DTOs para usuarios y otros
├─ repositories/  # Patrón Repository
├─ services/      # Lógica de negocio
├─ routes/        # Rutas API y vistas
├─ middleware/    # auth, roles, logger
├─ utils/         # hash, token, etc.

⚡ Notas

El backend está listo para producción, pero se recomienda desplegar en entorno seguro (HTTPS).

Configurar las variables de entorno correctamente, especialmente MAIL_USER y MAIL_PASS para el envío de correos.

Se utiliza MongoDB Atlas u otra instancia externa para persistencia de datos.

📝 Autor

Jesús Manuel Terán Dávila
¿Dudas o sugerencias? ¡Estoy en LinkedIn! 👉 linkedin.com/in/jmteran3d