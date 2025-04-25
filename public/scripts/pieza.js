$(document).ready(function() {
    // Cargar marcas para los selectores
    cargarMarcas();
    
    // Cargar modelos iniciales
    cargarModelos();
    
    // Cargar categorías
    cargarCategorias();
    
    // Cargar lista de piezas
    cargarPiezas();
    
    // Event listeners
    $("#btnCrear").click(crearPieza);
    $("#btnCancelar").click(limpiarFormulario);
    $("#btnEliminar").click(eliminarPieza);
    $("#btnCancelarEliminar").click(limpiarFormularioEliminar);
    
    // Cuando cambia la marca, actualizar modelos disponibles
    $("#marca_selector").change(function() {
        const idMarca = $(this).val();
        if (idMarca) {
            cargarModelosPorMarca(idMarca);
        }
    });
    
    $("#marca_eliminar").change(function() {
        const idMarca = $(this).val();
        if (idMarca) {
            cargarModelosPorMarca(idMarca, "#modelo_eliminar");
        }
    });
});

// Función para cargar todas las marcas
function cargarMarcas() {
    $.ajax({
        url: '/marcas',
        type: 'GET',
        success: function(marcas) {
            const marcaSelector = $("#marca_selector");
            const marcaEliminar = $("#marca_eliminar");
            
            marcaSelector.empty();
            marcaEliminar.empty();
            
            marcaSelector.append('<option value="" selected>Seleccione una marca</option>');
            marcaEliminar.append('<option value="" selected>Seleccione una marca</option>');
            
            marcas.forEach(marca => {
                marcaSelector.append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
                marcaEliminar.append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar marcas:', error);
            alert('Error al cargar las marcas. Por favor, intente de nuevo.');
        }
    });
}

// Función para cargar todos los modelos
function cargarModelos() {
    $.ajax({
        url: '/modelos',
        type: 'GET',
        success: function(modelos) {
            const modeloSelector = $("#modelo_selector");
            
            modeloSelector.empty();
            modeloSelector.append('<option value="" selected>Seleccione un modelo</option>');
            
            modelos.forEach(modelo => {
                modeloSelector.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar modelos:', error);
        }
    });
}

// Función para cargar modelos por marca
function cargarModelosPorMarca(idMarca, selector = "#modelo_selector") {
    $.ajax({
        url: `/modelos/marca/${idMarca}`,
        type: 'GET',
        success: function(modelos) {
            const modeloSelector = $(selector);
            
            modeloSelector.empty();
            modeloSelector.append('<option value="" selected>Seleccione un modelo</option>');
            
            modelos.forEach(modelo => {
                modeloSelector.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar modelos por marca:', error);
        }
    });
}

// Función para cargar categorías
function cargarCategorias() {
    $.ajax({
        url: '/categorias',
        type: 'GET',
        success: function(categorias) {
            const categoriaSelector = $("#categoria_selector");
            const categoriaEliminar = $("#categoria_eliminar");
            
            categoriaSelector.empty();
            categoriaEliminar.empty();
            
            categoriaSelector.append('<option value="" selected>Seleccione una categoría</option>');
            categoriaEliminar.append('<option value="" selected>Seleccione una categoría</option>');
            
            categorias.forEach(categoria => {
                categoriaSelector.append(`<option value="${categoria.id_categoria}">${categoria.nombre}</option>`);
                categoriaEliminar.append(`<option value="${categoria.id_categoria}">${categoria.nombre}</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar categorías:', error);
            alert('Error al cargar las categorías. Por favor, intente de nuevo.');
        }
    });
}

// Función para cargar todas las piezas
function cargarPiezas() {
    $.ajax({
        url: '/piezas',
        type: 'GET',
        success: function(piezas) {
            const listaPiezas = $("#lista_piezas");
            
            listaPiezas.empty();
            
            if (piezas.length === 0) {
                listaPiezas.append('<tr><td colspan="5" class="text-center">No hay piezas registradas</td></tr>');
                return;
            }
            
            piezas.forEach(pieza => {
                listaPiezas.append(`
                    <tr>
                        <td>${pieza.nombre_pieza}</td>
                        <td>${pieza.cantidad}</td>
                        <td>${pieza.precio ? '$' + pieza.precio : 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-primary btn-editar" data-id="${pieza.id_pieza}">Editar</button>
                            <button class="btn btn-sm btn-danger btn-eliminar" data-id="${pieza.id_pieza}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
            
            // Agregar event listeners para los botones de editar y eliminar
            $(".btn-editar").click(function() {
                const idPieza = $(this).data('id');
                cargarPiezaParaEditar(idPieza);
            });
            
            $(".btn-eliminar").click(function() {
                const idPieza = $(this).data('id');
                prepararEliminarPieza(idPieza);
            });
        },
        error: function(error) {
            console.error('Error al cargar piezas:', error);
            alert('Error al cargar las piezas. Por favor, intente de nuevo.');
        }
    });
}

// Función para crear una nueva pieza
function crearPieza() {
    // Obtener valores del formulario
    const nombrePieza = $("#nombre_pieza").val();
    const idModelo = $("#modelo_selector").val();
    const idMarca = $("#marca_selector").val();
    const idCategoria = $("#categoria_selector").val();
    const cantidad = $("#cantidad_pieza").val();
    const precio = $("#precio_pieza").val();
    
    // Validar que todos los campos estén completos
    if (!nombrePieza || !idModelo || !idMarca || !idCategoria || !cantidad) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }
    
    // Convertir a números los campos numéricos
    const nuevaPieza = {
        nombre_pieza: nombrePieza,
        id_modelo: parseInt(idModelo),
        id_marca: parseInt(idMarca),
        id_categoria: parseInt(idCategoria),
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio || 0)
    };
    
    console.log("Enviando datos:", nuevaPieza); // Para depuración
    
    $.ajax({
        url: '/piezas',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nuevaPieza),
        success: function(response) {
            alert('Pieza creada exitosamente.');
            limpiarFormulario();
            cargarPiezas();
        },
        error: function(error) {
            console.error('Error al crear pieza:', error);
            alert('Error al crear la pieza: ' + (error.responseJSON?.message || 'Intente de nuevo.'));
        }
    });
}

// Función para limpiar el formulario de creación
function limpiarFormulario() {
    $("#nombre_pieza").val('');
    $("#modelo_selector").val('');
    $("#marca_selector").val('');
    $("#categoria_selector").val('');
    $("#cantidad_pieza").val('');
    $("#precio_pieza").val('');
}

// Función para preparar la eliminación de una pieza
function prepararEliminarPieza(idPieza) {
    $.ajax({
        url: `/piezas/${idPieza}`,
        type: 'GET',
        success: function(pieza) {
            $("#id_eliminar").val(pieza.id_pieza);
            $("#nombre_eliminar").val(pieza.nombre_pieza);
            
            // Seleccionar la marca y cargar los modelos correspondientes
            $("#marca_eliminar").val(pieza.id_marca).trigger('change');
            
            // Esperar a que se carguen los modelos y luego seleccionar el modelo
            setTimeout(() => {
                $("#modelo_eliminar").val(pieza.id_modelo);
                $("#categoria_eliminar").val(pieza.id_categoria);
            }, 500);
        },
        error: function(error) {
            console.error('Error al cargar pieza para eliminar:', error);
            alert('Error al cargar la pieza. Por favor, intente de nuevo.');
        }
    });
}

// Función para eliminar una pieza
function eliminarPieza() {
    const idPieza = $("#id_eliminar").val();
    
    if (!idPieza) {
        alert('Por favor, seleccione una pieza para eliminar.');
        return;
    }
    
    if (!confirm('¿Está seguro de que desea eliminar esta pieza? Esta acción no se puede deshacer.')) {
        return;
    }
    
    $.ajax({
        url: `/piezas/${idPieza}`,
        type: 'DELETE',
        success: function(response) {
            alert('Pieza eliminada exitosamente.');
            limpiarFormularioEliminar();
            cargarPiezas();
        },
        error: function(error) {
            console.error('Error al eliminar pieza:', error);
            alert('Error al eliminar la pieza. Por favor, intente de nuevo.');
        }
    });
}

// Función para limpiar el formulario de eliminación
function limpiarFormularioEliminar() {
    $("#id_eliminar").val('');
    $("#nombre_eliminar").val('');
    $("#modelo_eliminar").val('');
    $("#marca_eliminar").val('');
    $("#categoria_eliminar").val('');
}

// Función para cargar una pieza para editar
function cargarPiezaParaEditar(idPieza) {
    $.ajax({
        url: `/piezas/${idPieza}`,
        type: 'GET',
        success: function(pieza) {
            // Cambiar a modo edición
            $("#modo_edicion").val("editar");
            $("#id_pieza").val(pieza.id_pieza);
            
            // Llenar el formulario con los datos de la pieza
            $("#nombre_pieza").val(pieza.nombre_pieza);
            $("#marca_selector").val(pieza.id_marca).trigger('change');
            
            // Esperar a que se carguen los modelos y luego seleccionar el modelo
            setTimeout(() => {
                $("#modelo_selector").val(pieza.id_modelo);
                $("#categoria_selector").val(pieza.id_categoria);
                $("#cantidad_pieza").val(pieza.cantidad);
                $("#precio_pieza").val(pieza.precio);
                
                // Cambiar el texto del botón
                $("#btnCrear").text("Actualizar");
            }, 500);
        },
        error: function(error) {
            console.error('Error al cargar pieza para editar:', error);
            alert('Error al cargar la pieza. Por favor, intente de nuevo.');
        }
    });
}