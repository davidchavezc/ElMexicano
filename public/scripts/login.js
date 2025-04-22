$('#iniciar-sesion').on("click", async function () {
  console.log("Botón clickeado");
  const usuario_empleado = $('#usuario').val()?.toString().trim();
  const contrasena_empleado = $('#contraseña').val()?.toString().trim();

  if (!usuario_empleado || !contrasena_empleado) {
      alert('Por favor, ingresa usuario y contraseña');
      return;
  }

  try {
      const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ usuario_empleado, contrasena_empleado })
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
          if (data.id_rol === 1) {
              window.location.replace('/admin/empleados.html');
          } else if (data.id_rol === 2) {
              window.location.replace('/empleado/restock.html');
          } else {
              alert('Rol no reconocido');
          }
      } else {
          alert(data.mensaje || 'Error al iniciar sesión');
      }
  } catch (err) {
    console.error("Error al realizar la solicitud:", err.message || err);
    alert(`Hubo un problema al iniciar sesión: ${err.message}`);
  }
});