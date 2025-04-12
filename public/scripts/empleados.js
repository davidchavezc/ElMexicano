document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/usuarios");
      const empleados = await response.json();
  
      const tbody = document.getElementById("empleados-tbody");
      tbody.innerHTML = "";
  
      empleados.forEach((empleado) => {
        const tr = document.createElement("tr");
  
        tr.innerHTML = `
          <td>${empleado.id_empleado}</td>
          <td>${empleado.nombre_empleado} ${empleado.apellido_empleado}</td>
          <td>${empleado.usuario_empleado}</td>
          <td>${empleado.contrasena_empleado}</td>
          <td>
            <button class="btn btn-warning btn-sm">Editar</button>
            <button class="btn btn-danger btn-sm">Eliminar</button>
          </td>
        `;
  
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  });