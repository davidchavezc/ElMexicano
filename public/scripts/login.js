document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();


      const user = e.target.querySelector('input[name="usuario"]')?.value.trim();
      const password = e.target.querySelector('input[name="contraseña"]')?.value.trim();



      if (!user || !password) {
          alert("Por favor, completa todos los campos.");
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
              console.error("Error en la autenticación:", res.status);
              return alert("Credenciales incorrectas o problema en el servidor.");
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