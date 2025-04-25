document.addEventListener("DOMContentLoaded", () => {
  let piezas = [];

  // Función para cargar las piezas desde el backend
  async function getPiezas() {
    try {
      const response = await fetch('/ventas', { // Cambiar si el backend está en otro dominio
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud al servidor");
      }

      piezas = await response.json(); // Guardar las piezas obtenidas
      console.log("Piezas cargadas:", piezas);
    } catch (error) {
      console.error("Error al cargar piezas:", error);
    }
  }

  // Llamar a la función para cargar las piezas al iniciar
  getPiezas();

  // Escuchar el evento de entrada del usuario
  $('#buscador-pieza').on('input', function () {
    const query = $(this).val().trim().toLowerCase();
    const resultados = piezas.filter(pieza => 
      pieza.nombre_pieza.toLowerCase().includes(query)
    );
    mostrarResultados(resultados);
  });

  // Mostrar los resultados debajo del input
  function mostrarResultados(lista) {
    const $resultados = $('#resultados');
    $resultados.empty().removeClass('d-none');
  
    if (lista.length === 0) {
      $resultados.addClass('d-none');
      return;
    }
  
    lista.forEach(pieza => {
      const $li = $('<li>', {
        class: 'list-group-item list-group-item-action',
        text: pieza.nombre_pieza,
        click: function () {
          $('#buscador-pieza').val(pieza.nombre_pieza);
          $resultados.empty().addClass('d-none');
        }
      });
      $resultados.append($li);
    });
  }

  // Ocultar sugerencias si se hace clic fuera
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#buscador-pieza, #resultados').length) {
      $('#resultados').empty().addClass('d-none');
    }
  });
});