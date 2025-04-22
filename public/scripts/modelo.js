$(document).ready(function() {
    // Variable global para almacenar todas las marcas
    let todasLasMarcas = [];
    
    // Cargar marcas para autocompletado
    cargarMarcasAutocompletado();
    
    // Función para cargar marcas para autocompletado
    function cargarMarcasAutocompletado() {
        $.ajax({
            url: '/marcas',
            type: 'GET',
            success: function(marcas) {
                todasLasMarcas = marcas;
                
                // Configurar autocompletado para cada campo de búsqueda
                configurarAutocompletado('#buscar_marca_crear', '#lista_marcas_crear', '#id_marca');
                configurarAutocompletado('#buscar_marca_eliminar', '#lista_marcas_eliminar', '#marca_eliminar');
                configurarAutocompletado('#buscar_marca_filtro', '#lista_marcas_filtro', '#marca_filtro');
            },
            error: function(error) {
                console.error('Error al cargar marcas:', error);
            }
        });
    }
    
    // Función para configurar autocompletado
    function configurarAutocompletado(inputSelector, listaSelector, hiddenInputSelector) {
        // Evento para cuando se escribe en el campo de búsqueda
        $(inputSelector).on('input', function() {
            const busqueda = $(this).val().toLowerCase();
            const $lista = $(listaSelector);
            
            // Limpiar lista
            $lista.empty();
            
            // Si el campo está vacío, ocultar la lista
            if (busqueda === '') {
                $lista.addClass('d-none');
                return;
            }
            
            // Filtrar marcas que coincidan con la búsqueda
            const marcasFiltradas = todasLasMarcas.filter(marca => 
                marca.nombre_marca.toLowerCase().includes(busqueda)
            );
            
            // Si no hay resultados, mostrar mensaje
            if (marcasFiltradas.length === 0) {
                $lista.append(`<div class="p-2 text-muted">No se encontraron marcas</div>`);
            } else {
                // Mostrar resultados
                marcasFiltradas.forEach(marca => {
                    $lista.append(`
                        <div class="p-2 marca-item" data-id="${marca.id_marca}" data-nombre="${marca.nombre_marca}">
                            ${marca.nombre_marca}
                        </div>
                    `);
                });
            }
            
            // Mostrar la lista
            $lista.removeClass('d-none');
        });
        
        // Evento para cuando se hace clic en un elemento de la lista
        $(document).on('click', `${listaSelector} .marca-item`, function() {
            const id = $(this).data('id');
            const nombre = $(this).data('nombre');
            
            // Establecer el valor en el campo de búsqueda
            $(inputSelector).val(nombre);
            
            // Establecer el ID en el campo oculto
            $(hiddenInputSelector).val(id);
            
            // Ocultar la lista
            $(listaSelector).addClass('d-none');
            
            // Disparar evento de cambio para cargar modelos si es necesario
            $(hiddenInputSelector).trigger('change');
        });
        
        // Ocultar la lista cuando se hace clic fuera
        $(document).on('click', function(e) {
            if (!$(e.target).closest(`${inputSelector}, ${listaSelector}`).length) {
                $(listaSelector).addClass('d-none');
            }
        });
    }
    
    // Evento para cuando cambia la marca seleccionada en el filtro
    $("#marca_filtro").on('change', function() {
        const idMarca = $(this).val();
        if (idMarca) {
            // Si hay un año seleccionado, filtrar por marca y año
            const anioModelo = $("#anio_filtro").val();
            if (anioModelo) {
                cargarModelosPorMarcaYAnio(idMarca, anioModelo);
            } else {
                cargarModelosPorMarca(idMarca);
            }
        } else {
            // Si no hay marca seleccionada, limpiar la lista de modelos
            $("#lista_modelo").empty();
            $("#lista_modelo").append('<option selected>Selecciona un modelo</option>');
        }
    });
    
    // Evento para cuando cambia el año seleccionado
    $("#anio_filtro").change(function() {
        const anioModelo = $(this).val();
        const idMarca = $("#marca_filtro").val();
        
        if (idMarca && anioModelo) {
            cargarModelosPorMarcaYAnio(idMarca, anioModelo);
        } else if (idMarca) {
            cargarModelosPorMarca(idMarca);
        }
    });

    // Evento para cuando cambia la marca en el selector de eliminar
    $("#marca_eliminar").on('change', function() {
        const idMarca = $(this).val();
        if (idMarca) {
            // Si hay un año seleccionado, filtrar por marca y año
            const anioModelo = $("#anio_eliminar").val();
            if (anioModelo) {
                cargarModelosPorMarcaYAnio(idMarca, anioModelo, "#modelo_eliminar");
            } else {
                cargarModelosPorMarca(idMarca, "#modelo_eliminar");
            }
        } else {
            // Si no hay marca seleccionada, limpiar la lista de modelos
            $("#modelo_eliminar").empty();
            $("#modelo_eliminar").append('<option selected>Selecciona un modelo</option>');
        }
    });
    
    // Evento para cuando cambia el año en el selector de eliminar
    $("#anio_eliminar").change(function() {
        const anioModelo = $(this).val();
        const idMarca = $("#marca_eliminar").val();
        
        if (idMarca && anioModelo) {
            cargarModelosPorMarcaYAnio(idMarca, anioModelo, "#modelo_eliminar");
        } else if (idMarca) {
            cargarModelosPorMarca(idMarca, "#modelo_eliminar");
        }
    });

    // Crear modelo
    $('#btnCrearModelo').click(function(e) {
        e.preventDefault();
        const nombre_modelo = $('#nombre_modelo').val();
        const anio_modelo = $('#anio_modelo').val();
        const id_marca = $('#id_marca').val();

        if (!nombre_modelo || !anio_modelo || !id_marca) {
            alert('Por favor, completa todos los campos para crear el modelo.');
            return;
        }

        $.ajax({
            url: '/modelos',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nombre_modelo, anio_modelo, id_marca }),
            success: function(data) {
                alert('Modelo creado correctamente');
                // Limpiar campos
                $('#nombre_modelo').val('');
                $('#anio_modelo').val('');
                $('#buscar_marca_crear').val('');
                $('#id_marca').val('');
                cargarModelos();
            },
            error: function() {
                alert('Error al crear el modelo');
            }
        });
    });

    // Cargar modelos en el select de la parte inferior
    function cargarModelos() {
        $.get('/modelos', function(modelos) {
            const $select = $('#lista_modelo');
            $select.empty();
            $select.append('<option selected>Selecciona un modelo</option>');
            modelos.forEach(function(modelo) {
                $select.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} - ${modelo.anio_modelo}</option>`);
            });
        });
    }

    // Para inicializar modelos al cargar la página
    cargarModelos();

    // Eliminar modelo (versión actualizada)
    $('#btnEliminarModelo').click(function(e) {
        e.preventDefault();
        const id_modelo = $('#modelo_eliminar').val();
    
        if (!id_modelo || id_modelo === 'Selecciona un modelo') {
            alert('Por favor, selecciona un modelo para eliminar.');
            return;
        }
    
        if (confirm('¿Estás seguro de que deseas eliminar este modelo?')) {
            $.ajax({
                url: `/modelos/${id_modelo}`,
                type: 'DELETE',
                success: function(data) {
                    alert('Modelo eliminado correctamente');
                    // Recargar los modelos
                    const idMarca = $('#marca_eliminar').val();
                    const anioModelo = $('#anio_eliminar').val();
                    
                    if (idMarca && anioModelo) {
                        cargarModelosPorMarcaYAnio(idMarca, anioModelo, "#modelo_eliminar");
                    } else if (idMarca) {
                        cargarModelosPorMarca(idMarca, "#modelo_eliminar");
                    }
                    
                    cargarModelos();
                },
                error: function() {
                    alert('Error al eliminar el modelo');
                }
            });
        }
    });
    
    // Botones de cancelar
    $('#btnCancelarModelo').click(function() {
        $('#nombre_modelo').val('');
        $('#anio_modelo').val('');
        $('#buscar_marca_crear').val('');
        $('#id_marca').val('');
    });
    
    $('#btnCancelarEliminar').click(function() {
        $('#buscar_marca_eliminar').val('');
        $('#marca_eliminar').val('');
        $('#anio_eliminar').val('');
        $('#modelo_eliminar').empty().append('<option selected>Selecciona un modelo</option>');
    });
});

// Función para cargar modelos por marca (modificada para ser reutilizable)
function cargarModelosPorMarca(idMarca, selector = "#lista_modelo") {
    $.ajax({
        url: `/modelos/marca/${idMarca}`,
        type: 'GET',
        success: function(modelos) {
            $(selector).empty();
            
            if (modelos.length === 0) {
                $(selector).append('<option selected>No hay modelos para esta marca</option>');
            } else {
                $(selector).append('<option selected>Selecciona un modelo</option>');
                modelos.forEach(modelo => {
                    $(selector).append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
                });
            }
        },
        error: function(error) {
            console.error('Error al cargar modelos por marca:', error);
        }
    });
}

// Función para cargar modelos por marca y año
function cargarModelosPorMarcaYAnio(idMarca, anioModelo, selector = "#lista_modelo") {
    $.ajax({
        url: `/modelos/marca/${idMarca}/anio/${anioModelo}`,
        type: 'GET',
        success: function(modelos) {
            $(selector).empty();
            
            if (modelos.length === 0) {
                $(selector).append('<option selected>No hay modelos para esta marca y año</option>');
            } else {
                $(selector).append('<option selected>Selecciona un modelo</option>');
                modelos.forEach(modelo => {
                    $(selector).append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
                });
            }
        },
        error: function(error) {
            console.error('Error al cargar modelos por marca y año:', error);
        }
    });
}