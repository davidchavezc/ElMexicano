$(document).ready(async function () {
  try {
    const response = await fetch("/usuarios");
    const empleados = await response.json();

    const $tbody = $("#empleados-tbody");
    $tbody.empty();  // Limpiar el contenido de la tabla antes de agregar nuevos datos

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
});