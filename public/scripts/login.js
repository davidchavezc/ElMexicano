document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();


      const user = e.target.querySelector('input[name="usuario"]')?.value.trim();
      const password = e.target.querySelector('input[name="contraseña"]')?.value.trim();

      const errorMessage = document.getElementById("error-message"); // Se asegura de que el mensaje de error tenga un contenedor para mostrar

      // Limpiar el mensaje de error previo
      errorMessage.style.display = "none";
      errorMessage.textContent = "";

      if (!user || !password) {
        errorMessage.textContent = "Por favor, completa todos los campos.";
        errorMessage.style.display = "block"; // Muestra el mensaje
        return;
      }

      try {
          const res = await fetch("/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  usuario_empleado: user,
                  contrasena_empleado: password,
              }),
          });

          if (!res.ok) {
            if (res.status === 401) {
              const errorData = await res.json();
              errorMessage.textContent = errorData.mensaje;
              errorMessage.style.display = "block"; // Muestra el mensaje
          } else {
              alert("Hubo un problema al iniciar sesión.");
          }
          return;
          }

          const resJson = await res.json();


          if (resJson.redirect) {
              window.location.href = resJson.redirect;



          } else {
              alert("No se pudo redirigir. Revisa el rol del usuario.");
          }
      } catch (err) {
          console.error("Error al realizar la solicitud:", err);
          alert("Hubo un problema al iniciar sesión.");
      }
  });



});