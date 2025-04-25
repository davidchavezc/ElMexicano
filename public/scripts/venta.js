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
          renderPiezaSeleccionada(pieza);
        }
      });

      $ul.append($li);
    });

    $('#resultados').append($ul);
  }

  function renderPiezaSeleccionada(pieza) {
    const html = `
      <div class="container bg-white border rounded p-3 mt-3">
        <div class="row align-items-center">
          <div class="col-md-2 text-center">
            <img src="${pieza.imagen_url || 'https://via.placeholder.com/100'}" class="img-fluid rounded">
          </div>
          <div class="col-md-6">
            <h4 class="fw-bold">${pieza.nombre_pieza}</h4>
          </div>
          <div class="col-md-2 text-center">
            <label class="fw-bold">No. de Serie</label>
            <select class="form-select">
              <option>${pieza.numero_serie || '001'}</option>
            </select>
          </div>
          <div class="col-md-2 text-center">
            <button class="btn btn-outline-secondary" type="button" id="incrementBtn">+</button>
          </div>
        </div>
        <div class="text-end mt-2">
          <button class="btn btn-light border"><i class="bi bi-plus"></i> Agregar Pieza</button>
        </div>
      </div>
    `;

    $('#pieza-seleccionada').append(html);
  }

  // Ocultar sugerencias si se hace clic fuera
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#buscador-pieza, #resultados').length) {
      $('#resultados').empty();
    }
  });
});