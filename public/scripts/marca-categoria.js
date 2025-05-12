$(document).ready(async function () {
  await cargarMarcas(); 
  await cargarCategorias();

  $("#btn-crear-marca").on("click", crearMarca);

  $('#btn-eliminar-marca').on("click", eliminarMarca);

  $("#btn-crear-categoria").on("click", crearCategoria);

  $('#btn-eliminar-categoria').on("click", eliminarCategoria);

  $("#btn-limpiar-marca").on("click", function () {
    $("#nombre-marca").val("");

  $("#btn-limpiar-categoria").on("click", function () {
    $("#nombre-categoria").val("");
  });
  
  });
});

async function cargarMarcas() {
  try {
    const response = await fetch("/marcas");
    const marcas = await response.json();

    const $select = $("#marcas");
    $select.empty(); 

    const $defaultOption = $("<option>").text("Ver marcas actuales").prop("disabled", true).prop("selected", true);
    $select.append($defaultOption);
    const $tbody = $("#marcas-tbody");
    $tbody.empty();

    if(0 >= marcas.length){
      sendAlert('danger', 'No existen marcas para mostrar');
    }

    marcas.forEach((marca) => {
      const $option = $("<option>").val(marca.id_marca).text(marca.nombre_marca);
      $select.append($option);
      const $tr = $("<tr>");
      $tr.html(`
        <td class="col-2">${marca.id_marca}</td>
        <td class="col-10">${marca.nombre_marca}</td>  
      `);
      $tbody.append($tr);
    });
  } catch (error) {
    console.error("Error al cargar marcas:", error);
  }
};

async function crearMarca() {
  const nombreMarca = $("#nombre-marca").val().trim();

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
      sendAlert('success', `Nueva marca ${nuevaMarca.nombre_marca} creada exitosamente.`);
    } else {
      const errorText = await response.text();
      const errorMessage = JSON.parse(errorText).message;
      sendAlert('danger', `No se pudo crear la marca, ${errorMessage}.`);
    }
  } catch (error) {
    console.error("Error al crear la marca:", error);
    alert("Ocurrió un error al crear la marca.");
  }
};

async function eliminarMarca() {
  const idMarca = $('#marcas').val()?.trim();
  const nombreMarca = $('#marcas option:selected').text().trim();

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
      sendAlert('success', `Marca ${marca.nombre_marca} eliminada correctamente.`);
    } else {
      const errorText = await response.text();
      const errorMessage = JSON.parse(errorText).message;
      sendAlert('danger', `No se pudo eliminar la marca, ${errorMessage}.`);
    }
  } catch (error) {
    console.log(error);
    console.error("Error al eliminar la marca:", error);
    alert("Ocurrió un error al intentar eliminar la marca.");
  }
};

async function cargarCategorias() {
  try {
    const response = await fetch("/categorias");
    const categorias = await response.json();
    const $tbody = $('#categorias-tbody');
    $tbody.empty();
    const $select = $("#categorias");
    $select.empty();

    const $defaultOption = $("<option>").text("Ver categorias actuales").prop("disabled", true).prop("selected", true);
    $select.append($defaultOption);
    if(0 >= categorias.length){
      sendAlert('danger', 'No existen categorias para mostrar')
    }
    categorias.forEach((categoria) => {
    const $option = $("<option>").val(categoria.id_categoria).text(categoria.nombre_categoria);
    $select.append($option);
    const $tr = $("<tr>");
      $tr.html(`
        <td class="col-2">${categoria.id_categoria}</td>
        <td class="col-10">${categoria.nombre_categoria}</td>  
      `);
      $tbody.append($tr);
    });
  } catch (error) {
    console.error("Error al cargar categorias:", error);
  }
};

async function crearCategoria() {
    const nombrecategoria = $("#nombre-categoria").val().trim();

    try {
      const response = await fetch("/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombrecategoria})
      });
  
      if (response.ok) {
        const nuevacategoria = await response.json();
        $("#nombre-categoria").val("");
  
        await cargarCategorias();
        sendAlert('success', `Nueva categoria ${nuevacategoria.nombre_categoria} creada exitosamente.`);
      } else {
        const errorText = await response.text();
        const errorMessage = JSON.parse(errorText).message;
        sendAlert('danger', `No se pudo crear la categoria, ${errorMessage}.`);
      }
    } catch (error) {
      console.error("Error al crear la categoria:", error);
      alert("Ocurrió un error al crear la categoria.");
    }
};

async function eliminarCategoria() {
    const idcategoria = $('#categorias').val()?.trim();
    const nombrecategoria = $('#categorias option:selected').text().trim();

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
        cargarCategorias();sendAlert('success', `Categoria ${categoria.nombre_categoria} eliminada correctamente.`);
      } else {
        const errorText = await response.text();
        const errorMessage = JSON.parse(errorText).message;
        sendAlert('danger', `No se pudo eliminar la categoria, ${errorMessage}.`);
    }
  }
     catch (error) {
      console.log(error)
      console.error("Error al eliminar la categoria:", error);
      alert("Ocurrió un error al intentar eliminar la categoria.");
    }
};

function sendAlert(type, message) {
  const alerts = $('#alerts');
  const alert = $('.alert');
  let icon = '';
  switch (type) {
    case "success":
      icon = 'bi bi-check-circle';
      break;
    case "danger":
      icon = 'bi bi-exclamation-triangle';
      break;
    case "info":
      icon = 'bi bi-exclamation-circle';
      break;
  }
  
//   if (alert.length > 1) {
//   alert[alert.length - 1].remove();
// }

  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible mt-3" role="alert">`,
    `   <div><i class="${icon} me-2"> </i><span class="fs-small">${message}</span></div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('');
  alerts.prepend(wrapper);
  // alerts[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
};
