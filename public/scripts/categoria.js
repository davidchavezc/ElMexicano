$(document).ready(async function () {
  async function cargarcategorias() {
    try {
      const response = await fetch("/categorias");
      const categorias = await response.json();
  
      const $select = $(".form-select");
      $select.empty();  // Limpiar las opciones existentes
  
      const $defaultOption = $("<option>").text("Ver categorias actuales").prop("disabled", true).prop("selected", true);
      $select.append($defaultOption);
  
      categorias.forEach((categoria) => {
        const $option = $("<option>").val(categoria.id_categoria).text(categoria.nombre_categoria);
        $select.append($option);
      });
    } catch (error) {
      console.error("Error al cargar categorias:", error);
    }
  }

  // Llamar la función al cargar la página
  await cargarcategorias();

  // Manejo del evento para crear una nueva categoria
  $("#btn-crear-categoria").on("click", 

  $('#btn-eliminar-categoria').on("click", async function () {
    const idcategoria = $('#categoriasE').val()?.trim();
    const nombrecategoria = $('#categoriasE option:selected').text().trim();

    if (!idcategoria) {
      alert("Por favor selecciona una categoria para eliminar.");
      return;
    }
  
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar la categoria "${nombrecategoria}"?`);
    if (!confirmacion) return;

    try {
      const response = await fetch("/categorias", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: idcategoria })
      });

      if (response.ok) {
        const categoria = await response.json();
        cargarcategorias();
        const operacionExitosa = createAlert('success', `Categoria ${categoria.nombre_categoria} eliminada correctamente.`);
        $('#alerts').prepend(operacionExitosa);
      } else {
        const errorText = await response.text();
        const errorMessage = JSON.parse(errorText).message;
        const errorAlert = createAlert('danger', `No se pudo eliminar la categoria, ${errorMessage}.`);
        $('#alerts').prepend(errorAlert);
    }
  }
     catch (error) {
      console.log(error)
      console.error("Error al eliminar la categoria:", error);
      alert("Ocurrió un error al intentar eliminar la categoria.");
    }
  }));

  // Limpiar el campo de texto al hacer clic en el botón de limpiar
  $("#btn-limpiar1-categoria").on("click", function () {
    $("#nombre-categoria").val("");
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