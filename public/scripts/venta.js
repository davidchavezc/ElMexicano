document.addEventListener("DOMContentLoaded", () => {
  let piezas = [];

  // Cargar piezas desde el backend
  async function getPiezas() {
    try {
      const response = await fetch('/ventas', { method: 'GET', credentials: 'include' });
      if (!response.ok) throw new Error("Error en la solicitud al servidor");
      piezas = await response.json();
    } catch (error) {
      console.error("Error al cargar piezas:", error);
    }
  }

  async function cargarMetodosPago() {
    try {
      console.log('Iniciando carga de métodos de pago...');
      const response = await fetch('/ventas/metodoPago');
      console.log('Respuesta recibida:', response);
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Datos obtenidos:', data);
  
      if (!Array.isArray(data)) {
        throw new Error('La respuesta no es un arreglo');
      }
  
      const $select = $('#selectMetodoPago');
      console.log('Elemento select encontrado:', $select);
  
      // Limpiar las opciones existentes
      $select.empty();
  
      // Agregar la opción por defecto
      const $defaultOption = $("<option>")
        .text("Seleccionar método de pago")
        .prop("disabled", true)
        .prop("selected", true);
      $select.append($defaultOption);
  
      // Agregar las opciones de métodos de pago
      data.forEach((metodo) => {
        console.log('Agregando método de pago:', metodo);
        if (!metodo.id_metodopago || !metodo.nombre_metodopago) {
          console.error('Método de pago inválido:', metodo);
          return;
        }
        const $option = $("<option>")
          .val(metodo.id_metodopago)
          .text(metodo.nombre_metodopago);
        $select.append($option);
      });
  
      console.log('Métodos de pago cargados correctamente.');
  
    } catch (err) {
      console.error("Error al cargar métodos de pago:", err);
    }
  }

  getPiezas();
  cargarMetodosPago();

  // Buscar piezas
  $('#buscador-pieza').on('input', function () {
    const query = $(this).val().trim().toLowerCase();
    if (!query) return $('#resultados').empty();
    const resultados = piezas.filter(p => p.nombre_pieza.toLowerCase().includes(query));
    mostrarResultados(resultados);
  });

  function mostrarResultados(lista) {
    $('#resultados').empty();
    if (lista.length === 0) return;
    const $ul = $('<ul>', { class: 'list-group position-absolute w-100 z-3' });
    lista.forEach(pieza => {
      const $li = $('<li>', {
        class: 'list-group-item list-group-item-action',
        text: pieza.nombre_pieza,
        click: () => {
          $('#buscador-pieza').val('');
          $('#resultados').empty();
          renderPiezaSeleccionada(pieza.id_pieza);
        }
      });
      $ul.append($li);
    });
    $('#resultados').append($ul);
  }

  // Renderizar pieza seleccionada
  async function renderPiezaSeleccionada(id_pieza) {
    if ($(`div[idpieza="${id_pieza}"]`).length > 0) {
      $('#alertBox').prepend(createAlert('danger', 'La pieza ya se encuentra agregada.'));
      return;
    }

    const response = await fetch(`/ventas/${id_pieza}`);
    const pieza = await response.json();
    let cantidad = 1;
    const stockMaximo = pieza.cantidad;

    const $card = $(`
      <div class="container bg-white border rounded p-3 mt-3" idpieza="${pieza.id_pieza}">
        <div class="row align-items-center">
          <div class="col-md-2 text-center">
            <img src="../img/${pieza.imagen}" class="img-fluid rounded">
          </div>
          <div class="col-md-6">
            <h4 class="fw-bold">${pieza.nombre_pieza}</h4>
          </div>
          <div class="col-md-2 d-flex align-items-center justify-content-center gap-2">
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

    $card.find('.btn-increment').on('click', function () {
      if (cantidad < stockMaximo) {
        cantidad++;
        $card.find('.cantidad').text(cantidad);
      }
    });

    $card.find('.btn-decrement').on('click', function () {
      if (cantidad > 1) {
        cantidad--;
        $card.find('.cantidad').text(cantidad);
      }
    });

    $card.find('#eliminarPieza').on('click', function () {
      $card.remove();
    });

    $('#pieza-seleccionada').append($card);
  }

  // Ocultar sugerencias si se hace clic fuera
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#buscador-pieza, #resultados').length) {
      $('#resultados').empty();
    }
  });

  
  // Registrar venta
  $('.btn.btn-primary:contains("Registrar")').on('click', async () => {
    const cliente = $('input[type="text"]:not(#buscador-pieza)').val().trim();
    const fecha = $('input[type="date"]').val();
    const metodoPago = $('#selectMetodoPago').val();
    const idEmpleado = $('#id_empleado').val();
    console.log(idEmpleado)

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

    const piezasVenta = [];
    $('#pieza-seleccionada').children('[idpieza]').each(function () {
      piezasVenta.push({
        id_pieza: parseInt($(this).attr('idpieza')),
        cantidad: parseInt($(this).find('.cantidad').text())
      });
    });

    if (piezasVenta.length === 0) {
      $('#alertBox').prepend(createAlert('danger', 'Debes seleccionar al menos una pieza.'));
      return;
    }

    try {
      const response = await fetch('/ventas/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_empleado: idEmpleado,
          nombre_cliente: cliente,
          id_metodopago: metodoPago,
          piezas: piezasVenta })
      });

      const result = await response.json();
      if (response.ok) {
        $('#alertBox').prepend(createAlert('success', result.message || 'Venta registrada con éxito.'));
        $('#pieza-seleccionada').empty();
      } else {
        $('#alertBox').prepend(createAlert('danger', result.message || 'Error al registrar la venta.'));
      }
    } catch (err) {
      console.error('Error al registrar la venta:', err);
      $('#alertBox').prepend(createAlert('danger', 'Error inesperado.'));
    }
  });
});
// Función para crear alertas
function createAlert(type, message) {
  let icon = '';
  switch(type) {
    case "success": icon = 'bi bi-check-circle'; break;
    case "danger": icon = 'bi bi-exclamation-triangle'; break;
    case "info": icon = 'bi bi-exclamation-circle'; break;
  }
  return `
    <div class="alert alert-${type} alert-dismissible fade show my-2" role="alert">
      <i class="${icon} me-2"></i>${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}