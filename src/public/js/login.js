const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");

const divMensaje = document.getElementById("mensaje");

btnLogin.addEventListener("click", async (e) => {
  e.preventDefault();

  let email = inputEmail.value.trim();
  let password = inputPassword.value.trim();
  if (!email || !password) {
    divMensaje.textContent = `Complete los datos...!!!`;
    setTimeout(() => {
      divMensaje.textContent = "";
    }, 3000);

    return;
  }

  let response = await fetch("/api/sessions/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  let data = await response.json();
  if (response.status >= 400) {
    divMensaje.textContent = `Error: ${data.error}`;
    setTimeout(() => {
      divMensaje.textContent = "";
    }, 3000);
  } else {
    window.location.href = "/perfil";
  }
});
