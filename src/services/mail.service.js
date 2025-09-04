import { transporter } from "../config/mailer.js";

export const sendResetPasswordMail = async ({ to, resetUrl }) => {
  const html = `
    <div>
      <h2>Restablecer contraseña</h2>
      <p>Este enlace expirará en 1 hora.</p>
      <a href="${resetUrl}" style="padding:10px 16px;border-radius:8px;background:#4f46e5;color:#fff;text-decoration:none">
        Restablecer contraseña
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Ecommerce" <${process.env.MAIL_USER}>`,
      to,
      subject: "Restablecer contraseña",
      html,
    });
    console.log(`Correo de restablecimiento enviado a ${to}`);
  } catch (error) {
    console.error(`Error al enviar correo a ${to}:`, error.message);
    throw new Error("No se pudo enviar el correo de restablecimiento de contraseña");
  }
};
