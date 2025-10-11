const registroForm = document.querySelector("#form-registro");
registroForm.addEventListener("submit", (e) => {
  // para que no se recargue la pagina
  e.preventDefault();
  // campos del registro
  const username = document.querySelector("#nuevo-usuario").value.trim();
  const email = document.querySelector("#email").value.trim();
  const pass = document.querySelector("#contrasena").value.trim();
  // valida que no esten vacios los campos
  if (!username || !email || !pass) {
    return Swal.fire({
      icon: "error",
      title: "Campos vacíos",
      text: "Por favor completa todos los campos.",
      timer: 2000,
      timerProgressBar: true,
    });
  }
  // si el local ya tiene registro sino deja el array vacio
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find((u) => u.email === email)) {
    return Swal.fire({
      icon: "error",
      title: "Usuario ya registrado",
      text: "El correo electrónico ya tiene cuenta.",
      timer: 2000,
      timerProgressBar: true,
    });
  }
  // guarda el usuario
  users.push({ username, email, pass });
  localStorage.setItem("users", JSON.stringify(users));
  Swal.fire({
    icon: "success",
    title: "Registro exitoso",
    text: `Bienvenido ${username}!`,
    timer: 2000,
    timerProgressBar: true,
    willClose: () => {
      window.location.href = "login.html";
    },
  });
});
