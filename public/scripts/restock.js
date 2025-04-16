$(document).ready(async function () {
    try {
      const response = await fetch("/restock");
      const piezas = await response.json();

      const $vistaGeneral = $("#piezas-disponibles");
      $vistaGeneral.empty();

      piezas.forEach((pieza) => {
        
        const div =(`
        <div class="col">
                <div class="card h-100">
                    <img src="${pieza.imagen}" alt="Motor de arranque" class="card-img-top">
                    <div class="card-body text-center">
                        <p>${pieza.nombre_pieza}</p>
                        <p><span class="text-danger">${pieza.cantidad} en stock</span></p>
                    </div>
                </div>
            </div>
            `)
            $vistaGeneral.append(div);
      });
  
    } catch (error) {
      console.error("Error al cargar piezas:", error);
    }
  });

  $(document).ready(async function () {
    let piezas = [];
  
    // Cargar todas las piezas desde el backend al iniciar
    fetch('/restock')
      .then(response => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then(data => {
        piezas = data;
      })
      .catch(error => {
        console.error("Error al cargar piezas:", error);
      });
  
    // Escuchar lo que escribe el usuario
    $('#buscador-pieza').on('input', function () {
      const query = $(this).val().trim().toLowerCase();
      const resultados = piezas.filter(pieza =>
        pieza.nombre_pieza.toLowerCase().includes(query)
      );
  
      mostrarResultados(resultados);
    });
  
    // Mostrar los resultados debajo del input
    function mostrarResultados(lista) {
      $('#lista-sugerencias').remove(); // Eliminamos cualquier lista previa
  
      if (lista.length === 0) return;
  
      const $ul = $('<ul>', {
        id: 'lista-sugerencias',
        class: 'list-group position-absolute w-25 z-3',
        css: {
          top: $('#buscador-pieza').position().top + $('#buscador-pieza').outerHeight(),
          left: $('#buscador-pieza').position().left
        }
      });
  
      lista.forEach(pieza => {
        const $li = $('<li>', {
          class: 'list-group-item list-group-item-action',
          text: pieza.nombre_pieza,
          click: function () {
            $('#buscador-pieza').val(pieza.nombre_pieza);
            $('#lista-sugerencias').remove();
            // Aquí puedes cargar más datos de la pieza si lo necesitas
          }
        });
  
        $ul.append($li);
      });
  
      $('#buscador-pieza').after($ul);
    }
  
    // Ocultar sugerencias si se hace clic fuera
    $(document).on('click', function (e) {
      if (!$(e.target).closest('#buscador-pieza, #lista-sugerencias').length) {
        $('#lista-sugerencias').remove();
      }
    });
  });