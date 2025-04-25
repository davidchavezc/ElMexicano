$(document).ready(async function () {
  await cargarEmpleados();

  $("form").on("submit", async function (event) {
    event.preventDefault();

    const nombre = $('input[placeholder="Nombre"]').val().trim();
    const apellido = $('input[placeholder="Apellido"]').val().trim();
    const usuario = $('input[placeholder="Usuario de Empleado"]').val().trim();
    const contrasena = $('input[placeholder="Contraseña"]').val().trim();
    const rol = $("select").val();

    if (!nombre || !apellido || !usuario || !contrasena || !rol) {
      const infoAlert = 'Por favor, completa todos los campos.';
      $('#alertBox').append(createAlert('info', infoAlert));
      return;
    }

    const datosEmpleado = {
      nombre_empleado: nombre,
      apellido_empleado: apellido,
      usuario_empleado: usuario,
      contrasena_empleado: contrasena,
      id_rol: rol,
    };

    try {
      let response;
      if (window.usuarioEditandoId) {
        // Método PUT para edición
        response = await fetch(`/usuarios/${window.usuarioEditandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosEmpleado),
        });
      } else {
        // Método POST para agregar
        response = await fetch("/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosEmpleado),
        });
      }

      if (response.ok) {
        const mensajeExito = (window.usuarioEditandoId ? "Empleado editado correctamente." : "Empleado agregado correctamente.");
        $("form")[0].reset();
        window.usuarioEditandoId = null;
        await cargarEmpleados();
        $('#alertBox').prepend(createAlert('success', mensajeExito));
      } else {
        const errorText = await response.text();
        // alert("Error: " + errorText);
        const errorAlert = createAlert('danger', 'Error al crear usuario: ' + errorText);
        $('#alertBox').prepend(errorAlert);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error.");
    }
  });
});

async function cargarEmpleados() {
  try {
    const response = await fetch("/usuarios");
    const empleados = await response.json();

    const $tbody = $("#empleados-tbody");
    $tbody.empty();

    empleados.forEach((empleado) => {
      const $tr = $("<tr>");
      $tr.html(`
        <td>${empleado.id_empleado}</td>
        <td>${empleado.nombre_empleado} ${empleado.apellido_empleado}</td>
        <td>${empleado.usuario_empleado}</td>
        <td>${empleado.contrasena_empleado}</td>
        <td>${empleado.nombre_rol}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarEmpleado(${empleado.id_empleado}, '${empleado.nombre_empleado}', '${empleado.apellido_empleado}', '${empleado.usuario_empleado}', '${empleado.contrasena_empleado}', '${empleado.id_rol}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(${empleado.id_empleado})">Eliminar</button>
        </td>
      `);
      $tbody.append($tr);
    });
  } catch (error) {
    console.error("Error al cargar empleados:", error);
  }
}

window.editarEmpleado = function (id, nombre, apellido, usuario, contrasena, rol) {
  window.usuarioEditandoId = id;
  $('input[placeholder="Nombre"]').val(nombre);
  $('input[placeholder="Apellido"]').val(apellido);
  $('input[placeholder="Usuario de Empleado"]').val(usuario);
  $('input[placeholder="Contraseña"]').val(contrasena);
  $("select").val(rol);
};

window.eliminarEmpleado = async function (id) {
  if (!confirm("¿Estás seguro de que quieres eliminar este empleado?")) return;

  try {
    const response = await fetch(`/usuarios/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      $('#alertBox').prepend(createAlert('success', 'Empleado eliminado correctamente.'))
      await cargarEmpleados();
    } else {
      const errorText = await response.text();
      $('#alertBox').prepend(createAlert('danger',"Error al eliminar empleado: " + errorText));
    }
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    alert("Ocurrió un error al intentar eliminar el empleado.");
  }
};

function createAlert(type, message) {
  let icon = '';
  switch(type) {
    case "success":
      icon = 'bi bi-check-circle'
      break;
    case "danger":
      icon = 'bi bi-exclamation-triangle'
      break;
    case "info":
      icon = 'bi bi-exclamation-circle'
      break;
  }
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible mt-3" role="alert">`,
    `   <div><i class="${icon} me-2"> </i>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  return wrapper;
}