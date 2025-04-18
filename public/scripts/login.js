$('#iniciar-sesion').on("click", async function () {
    const usuario_empleado = $('#usuario').val()?.toString().trim();
    const contrasena_empleado = $('#contraseña').val()?.toString().trim();
  
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_empleado, contrasena_empleado })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Error de autenticación');
        }
      })
      .then(data => {
        console.log(data);
        if (data.id_rol === 1) {
            window.location.replace = '/admin/empleados.html';
        } else {
          window.location.replace = '/pos/restock.html';
        }
      })
      .catch(err => {
        console.error('Error al iniciar sesión:', err);
        alert('Credenciales incorrectas');
      });
  });