$(document).ready(function() {
    // Cargar marcas en todos los selectores
    cargarMarcas();
    
    // Evento para cuando cambia la marca seleccionada
    $("#marca_filtro").change(function() {
        const idMarca = $(this).val();
        if (idMarca) {
            cargarModelosPorMarca(idMarca);
        } else {
            // Si no hay marca seleccionada, limpiar la lista de modelos
            $("#lista_modelo").empty();
            $("#lista_modelo").append('<option selected>Selecciona un modelo</option>');
        }
    });

    // Crear modelo
    $('#btnCrearModelo').click(function(e) {
        e.preventDefault();
        const nombre_modelo = $('#nombre_modelo').val();
        const anio_modelo = $('#anio_modelo').val();
        const id_marca = $('#id_marca').val();

        $.ajax({
            url: '/modelos',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nombre_modelo, anio_modelo, id_marca }),
            success: function(data) {
                alert('Modelo creado correctamente');
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
            const $select = $('.inventory-section select.form-select');
            $select.empty();
            $select.append('<option selected>Selecciona un modelo</option>');
            modelos.forEach(function(modelo) {
                $select.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} - ${modelo.anio_modelo}</option>`);
            });
        });
    }

    // PAra nicializar modelos al cargar la página
    cargarModelos();

    // Para marcas en el select de eliminar (puedes reutilizar el de añadir si quieres)
    $.get('/marcas', function(marcas) {
        $('#marca_eliminar').empty();
        marcas.forEach(function(marca) {
            $('#marca_eliminar').append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
        });
    });

    // Eliminar modelo
    $('#btnEliminarModelo').click(function(e) {
        e.preventDefault();
        const nombre_modelo = $('#nombre_eliminar').val();
        const anio_modelo = $('#anio_eliminar').val();
        const id_marca = $('#marca_eliminar').val();
    
        if (!nombre_modelo || !anio_modelo || !id_marca) {
            alert('Por favor, completa todos los campos para eliminar el modelo.');
            return;
        }
    
        $.ajax({
            url: '/modelos/eliminar',
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ nombre_modelo, anio_modelo, id_marca }),
            success: function(data) {
                alert('Modelo eliminado correctamente');
                cargarModelos();
            },
            error: function() {
                alert('Error al eliminar el modelo');
            }
        });
    });
});

// Función para cargar marcas en todos los selectores
function cargarMarcas() {
    $.ajax({
        url: '/marcas',
        type: 'GET',
        success: function(marcas) {
            // Limpiar y llenar el selector de marcas para crear modelo
            $("#id_marca").empty();
            $("#id_marca").append('<option value="">Selecciona una marca</option>');
            
            // Limpiar y llenar el selector de marcas para eliminar modelo
            $("#marca_eliminar").empty();
            $("#marca_eliminar").append('<option value="">Selecciona una marca</option>');
            
            // Limpiar y llenar el selector de marcas para filtrar modelos
            $("#marca_filtro").empty();
            $("#marca_filtro").append('<option value="">Selecciona una marca</option>');
            
            // Agregar cada marca a los selectores
            marcas.forEach(marca => {
                $("#id_marca").append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
                $("#marca_eliminar").append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
                $("#marca_filtro").append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar marcas:', error);
        }
    });
}

// Función para cargar modelos por marca
function cargarModelosPorMarca(idMarca) {
    $.ajax({
        url: `/modelos/marca/${idMarca}`,
        type: 'GET',
        success: function(modelos) {
            $("#lista_modelo").empty();
            
            if (modelos.length === 0) {
                $("#lista_modelo").append('<option selected>No hay modelos para esta marca</option>');
            } else {
                $("#lista_modelo").append('<option selected>Selecciona un modelo</option>');
                modelos.forEach(modelo => {
                    $("#lista_modelo").append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
                });
            }
        },
        error: function(error) {
            console.error('Error al cargar modelos por marca:', error);
        }
    });
}