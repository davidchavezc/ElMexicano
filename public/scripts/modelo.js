$(document).ready(function() {
    // Cargar marcas en todos los selectores
    cargarMarcas();
    
    // Evento para cuando cambia la marca seleccionada
    $("#marca_filtro").change(function() {
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
    $("#marca_eliminar").change(function() {
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

// Nueva función para cargar modelos por marca y año
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