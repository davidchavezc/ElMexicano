document.addEventListener("DOMContentLoaded", () => {
  let piezas = [];

  // Función para cargar las piezas desde el backend
  async function getPiezas() {
    try {
      const response = await fetch('/ventas', {
        method: 'GET',
        credentials: 'include' // importante si tu login maneja sesiones
      });

      if (!response.ok) throw new Error("Error en la solicitud al servidor");

      piezas = await response.json();
      console.log("Piezas cargadas:", piezas);
    } catch (error) {
      console.error("Error al cargar piezas:", error);
    }
  }

  getPiezas(); // Cargar piezas al iniciar

  // Escuchar input del usuario
  $('#buscador-pieza').on('input', function () {
    const query = $(this).val().trim().toLowerCase();

    if (!query) {
      $('#resultados').empty();
      return;
    }

    const resultados = piezas.filter(pieza =>
      pieza.nombre_pieza.toLowerCase().includes(query)
    );

    mostrarResultados(resultados);
  });

  function mostrarResultados(lista) {
    $('#resultados').empty(); // Limpiar resultados previos

    if (lista.length === 0) return;

    const $ul = $('<ul>', {
      class: 'list-group position-absolute w-100 z-3'
    });

    lista.forEach(pieza => {
      const $li = $('<li>', {
        class: 'list-group-item list-group-item-action',
        text: pieza.nombre_pieza,
        click: function () {
          $('#buscador-pieza').val('');
          $('#resultados').empty();
          renderPiezaSeleccionada(pieza.id_pieza);
        }
      });

      $ul.append($li);
    });

    $('#resultados').append($ul);
  }

  async function renderPiezaSeleccionada(id_pieza) {
    // Verificar si la pieza ya está en el contenedor
    if ($(`div[idpieza="${id_pieza}"]`).length > 0) {
      // alert("La pieza ya está agregada.");
      $('#alertBox').prepend(createAlert('danger', 'La pieza ya se encuentra agregada.'));
      return; // Salir de la función si la pieza ya existe
    }

    const response = await fetch(`/ventas/${id_pieza}`);
    const pieza = await response.json();
    let cantidad = 1;
    const stockMaximo = pieza.cantidad; // Usamos 10 por defecto si no viene el stock

    const $card = $(`
      <div class="container bg-white border rounded p-3 mt-3" id="tarjeta" idpieza="${pieza.id_pieza}">
        <div class="row align-items-center">
          <div class="col-md-2 text-center">
            <img src="../img/${pieza.imagen}" class="img-fluid rounded">
          </div>
          <div class="col-md-6">
            <h4 class="fw-bold">${pieza.nombre_pieza}</h4>
          </div>
          <div class="col-md-2 text-center d-flex align-items-center justify-content-center gap-2">
            <button class="btn btn-outline-secondary btn-decrement">−</button>
            <span class="fw-bold cantidad">${cantidad}</span>
            <button class="btn btn-outline-secondary btn-increment">+</button>
          </div>
        </div>
        <div class="text-end mt-2">
          <button class="btn btn-danger border" id="eliminarPieza"><i class="bi bi-plus"></i> Eliminar Pieza</button>
        </div>
      </div>
    `);

    // Incrementar cantidad
    $card.find('.btn-increment').on('click', function () {
      if (cantidad < stockMaximo) {
        cantidad++;
        $card.find('.cantidad').text(cantidad);
      }
    });

    // Decrementar cantidad
    $card.find('.btn-decrement').on('click', function () {
      if (cantidad > 1) {
        cantidad--;
        $card.find('.cantidad').text(cantidad);
      }
    });

    // Eliminar tarjeta
    $card.find('#eliminarPieza').on('click', function () {
      $card.remove();
    });

    // Agregar la tarjeta al contenedor
    $('#pieza-seleccionada').append($card);
  }

  // Ocultar sugerencias si se hace clic fuera
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#buscador-pieza, #resultados').length) {
      $('#resultados').empty();
    }
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

function createAlert(type, message) {
  return `
    <div class="alert alert-${type} alert-dismissible fade show my-2" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

$(document).ready(() => {
  // Evento para el botón "Registrar"
  $('.btn.btn-primary:contains("Registrar")').on('click', async () => {
    const cliente = $('.form-control:contains("Nombre del Cliente"), input[value="Nombre del Cliente"]').val().trim();
    const fecha = $('input[type="date"]').val();
    const metodoPago = $('select.form-select').val();

    // Validaciones
    if (!cliente || cliente === 'Nombre del Cliente') {
      $('#alertBox').prepend(createAlert('danger', 'Por favor ingresa el nombre del cliente'));
      return;
    }
    if (!fecha) {
      $('#alertBox').prepend(createAlert('danger', 'Por favor selecciona una fecha'));
      return;
    }
    if (!metodoPago) {
      $('#alertBox').prepend(createAlert('danger', 'Por favor selecciona un método de pago'));
      return;
    }

    // Obtener piezas seleccionadas
    const piezasSeleccionadas = [];
    $('#pieza-seleccionada .container').each(function () {
      const idPieza = $(this).attr('idpieza');
      const cantidad = parseInt($(this).find('.cantidad').text());

      if (idPieza && cantidad > 0) {
        piezasSeleccionadas.push({
          id_pieza: idPieza,
          cantidad
        });
      }
    });

    if (piezasSeleccionadas.length === 0) {
      $('#alertBox').prepend(createAlert('danger', 'Agrega al menos una pieza a la venta'));
      return;
    }

    // Enviar venta al backend
    const ventaData = {
      cliente,
      fecha,
      metodoPago,
      piezas: piezasSeleccionadas
    };

    try {
      const res = await fetch('/ventas/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(ventaData)
      });

      if (!res.ok) throw new Error('Error al registrar la venta');

      const result = await res.json();
      $('#alertBox').prepend(createAlert('success', 'Venta registrada exitosamente'));

      // Limpiar campos
      $('input[type="text"]').val('');
      $('input[type="date"]').val('');
      $('select.form-select').val('');
      $('#pieza-seleccionada').empty();
    } catch (error) {
      console.error(error);
      $('#alertBox').prepend(createAlert('danger', 'Hubo un error al registrar la venta'));
    }
  });
});