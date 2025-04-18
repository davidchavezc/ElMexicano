$('iniciar-sesion').on("click", async function () {
    
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario, contraseña_usuario })
      })
        .then(res => res.json())
        .then(data => {
          if (data.id_rol === 1) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/pos';
          }
        })
        .catch(err => console.error('Error al iniciar sesión:', err));
})