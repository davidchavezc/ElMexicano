$(document).ready(function() {
    // Cargar marcas en el select
    $.get('/marcas', function(marcas) {
        $('#id_marca').empty();
        marcas.forEach(function(marca) {
            $('#id_marca').append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
        });
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

    // Inicializar modelos al cargar la página
    cargarModelos();

    // Cargar marcas en el select de eliminar (puedes reutilizar el de añadir si quieres)
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