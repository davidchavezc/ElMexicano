$(document).ready(async function () {
    // Función para cargar las marcas
    async function cargarMarcas() {
      try {
        const response = await fetch("/marcas");
        const marcas = await response.json();
    
        const $select = $(".form-select");
        $select.empty();  // Limpiar las opciones existentes
    
        const $defaultOption = $("<option>").text("Ver marcas actuales").prop("disabled", true).prop("selected", true);
        $select.append($defaultOption);
    
        marcas.forEach((marca) => {
          const $option = $("<option>").val(marca.id_marca).text(marca.nombre_marca);
          $select.append($option);
        });
      } catch (error) {
        console.error("Error al cargar marcas:", error);
      }
    }
  
    // Llamar la función al cargar la página
    await cargarMarcas();
  
    // Manejo del evento para crear una nueva marca
    $("#btn-crear-marca").on("click", async function () {
      const nombreMarca = $("#nombre-marca").val().trim();
    
      if (nombreMarca === "") {
        alert("Por favor escribe un nombre de marca.");
        return;
      }
    
      try {
        const response = await fetch("/marcas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_marca: nombreMarca })
        });
    
        if (response.ok) {
          const nuevaMarca = await response.json();
          $("#nombre-marca").val("");
    
          await cargarMarcas();
          const operacionExitosa = createAlert('success', `Nueva marca ${nuevaMarca.nombre_marca} creada exitosamente.`);
          $('#alerts').prepend(operacionExitosa);
        } else {
          const errorText = await response.text();
          const errorMessage = JSON.parse(errorText).message;
          const errorAlert = createAlert('danger', `No se pudo crear la marca, ${errorMessage} ${nombreMarca}.`);
          $('#alerts').prepend(errorAlert);
        }
      } catch (error) {
        console.error("Error al crear la marca:", error);
        alert("Ocurrió un error al crear la marca.");
      }
    });
  
    $('#btn-eliminar-marca').on("click", async function () {
      const idMarca = $('#marcasE').val()?.trim();
      const nombreMarca = $('#marcasE option:selected').text().trim();

      if (!idMarca) {
        alert("Por favor selecciona una marca para eliminar.");
        return;
      }
    
      const confirmacion = confirm(`¿Estás seguro de que deseas eliminar la marca "${nombreMarca}"?`);
      if (!confirmacion) return;

      try {
        const response = await fetch("/marcas", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_marca: idMarca })
        });

        if (response.ok) {
          const marca = await response.json();
          cargarMarcas();
          const operacionExitosa = createAlert('success', `Marca ${marca.nombre_marca} eliminada correctamente.`);
          $('#alerts').prepend(operacionExitosa);
        } else {
          const errorText = await response.text();
          const errorMessage = JSON.parse(errorText).message;
          const errorAlert = createAlert('danger', `No se pudo eliminar la marca, ${errorMessage}.`);
          $('#alerts').prepend(errorAlert);
      }
    }
       catch (error) {
        console.log(error)
        console.error("Error al eliminar la marca:", error);
        alert("Ocurrió un error al intentar eliminar la marca.");
      }
    });

    // Limpiar el campo de texto al hacer clic en el botón de limpiar
    $("#btn-limpiar1-marca").on("click", function () {
      $("#nombre-marca").val("");
    });
  });

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