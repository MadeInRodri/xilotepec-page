const loginForm = document.querySelector("#loginForm");
loginForm.addEventListener("submit", (e) => {
  // para que no se recargue la pagina
  e.preventDefault();
  // campos del login
  const email = document.querySelector("#email").value.trim();
  const pass = document.querySelector("#password").value.trim();
  // base de datos del storage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  // valida si el usuario esta bien escrita
  const validUser = users.find(
    (u) => (u.email === email || u.username === email) && u.pass === pass
  );
  if (!validUser) {
    return Swal.fire({
      icon: "error",
      title: "Error de acceso",
      text: "Usuario o contraseña incorrectos.",
      timer: 2000,
      timerProgressBar: true,
    });
  }
  Swal.fire({
    icon: "success",
    title: "Bienvenido",
    text: `Hola ${validUser.username}!`,
    timer: 2000,
    timerProgressBar: true,
  });
  window.location.href = "cart.html"; // aqui le cambias donde se redirige
});
