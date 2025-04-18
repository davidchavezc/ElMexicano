$(document).ready(async function () {
  await cargarEmpleados();

  $("form").on("submit", async function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const nombre = $('input[placeholder="Nombre"]').val().trim();
    const apellido = $('input[placeholder="Apellido"]').val().trim();
    const usuario = $('input[placeholder="Usuario de Empleado"]').val().trim();
    const contrasena = $('input[placeholder="Contraseña"]').val().trim();
    const rol = $("select").val();

    if (!nombre || !apellido || !usuario || !contrasena || !rol) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const nuevoEmpleado = {
      id_empleado: null,
      nombre_empleado: nombre,
      apellido_empleado: apellido,
      usuario_empleado: usuario,
      contrasena_empleado: contrasena,
      id_rol: rol,
    };

    try {
      const response = await fetch("/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoEmpleado),
      });

      if (response.ok) {
        alert("Empleado agregado correctamente.");
        $("form")[0].reset();
        await cargarEmpleados();
      } else {
        const errorText = await response.text();
        alert("Error al agregar empleado: " + errorText);
      }
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      alert("Ocurrió un error al intentar agregar el empleado.");
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
        <td>${empleado.id_rol}</td>
        <td>
          <button class="btn btn-warning btn-sm">Editar</button>
          <button class="btn btn-danger btn-sm">Eliminar</button>
        </td>
      `);
      $tbody.append($tr);
    });
  } catch (error) {
    console.error("Error al cargar empleados:", error);
  }
}