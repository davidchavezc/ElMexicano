let piezas = [];


$(document).ready(async function cargarPiezas() {
    try {
      const response = await fetch("/piezas");
      const piezas = await response.json();
 
      const $vistaGeneral = $("#piezas-disponibles");
      $vistaGeneral.empty();

      piezas.forEach((pieza) => {
        
        const div =(`
        <div class="col ">
                <div class="card h-100">
                    <img src="../img/${pieza.imagen}" alt="Imagen de la pieza" class="card-img-top shadow-sm">
                    <div class="card-body text-center">
                        <p class="fs-2">${pieza.nombre_pieza}</p>
                        <p><span class="text-danger fs-3">${pieza.cantidad} en stock</span></p>
                    </div>
                </div>
            </div>
            `)
            $vistaGeneral.append(div);
      });
      
      $('#pieza-seleccionada').on('click', '.confirm-button', async function () {
        const id = $(this).data('id');
        const nuevaCantidad = $(this).siblings('.quantity-control').find('.quantity-input').val();
      
        try {
          const response = await fetch(`/piezas/restock/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id_pieza: id, 
              cantidad: nuevaCantidad
            })
          });
      
          if (response.ok) {
            alert('Cantidad actualizada correctamente');
            await cargarPiezas();
          } else {
            alert('Error al actualizar la cantidad');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      });

      $('#pieza-seleccionada').on('click', '.increment', function () {
        const $input = $(this).siblings('.quantity-input');
        let current = parseInt($input.val());
        $input.val(current + 1);
      });
      
      $('#pieza-seleccionada').on('click', '.decrement', function () {
        const $input = $(this).siblings('.quantity-input');
        let current = parseInt($input.val());
        if (current > 1) {
          $input.val(current - 1);
        }
      });
    
    } catch (error) {
      console.error("Error al cargar piezas:", error);
    }
  });

  $(document).ready(async function (){
  
    // Cargar todas las piezas desde el backend al iniciar
    fetch('/piezas')
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
      
            // Generar el HTML con los datos de la pieza
            const html = `
              <img src="/img/${pieza.imagen}" alt="${pieza.nombre_pieza}" class="img-thumbnail me-3"
                style="width: 150px;">
            <div>
                <h3>${pieza.nombre_pieza}</h3>
                <p>Piezas en stock: <span class="text-primary">${pieza.cantidad}</span></p>
                <div class="quantity-control mb-3">
                    <button class="btn btn-outline-secondary decrement">-</button>
                    <input type="number" class="form-control quantity-input text-center" value="${pieza.cantidad}" min="1" readonly>
                    <button class="btn btn-outline-secondary increment" id="boton-sumar-cantidad">+</button>
                </div>
                <button class="btn btn-primary confirm-button" data-id="${pieza.id_pieza}">Confirmar</button>
            </div>
            `;
            $('#pieza-seleccionada').html(html);
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



