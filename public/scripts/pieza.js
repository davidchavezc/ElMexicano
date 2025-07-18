$(document).ready(function() {
    // Cargar marcas, modelos y categorías al iniciar
    cargarMarcas();
    cargarModelos();
    cargarCategorias();
    
    // Cargar datos para los filtros
    cargarFiltroMarcas();
    cargarFiltroModelos();
    cargarFiltroCategorias();

    // Cargar todas las piezas al iniciar
    cargarPiezas();

    // Event listeners para los botones
    $("#crear").click(function() {
        const modo = $(this).data("modo");
        if (modo === "editar") {
            const idPieza = $(this).data("id");
            actualizarPieza(idPieza);
        } else {
            crearPieza();
        }
    });
    
    $("#cancelar").click(function() {
        limpiarFormulario();
    });
    
    // Cuando cambia la marca, actualizar modelos disponibles
    $("#marca").change(function() {
        const idMarca = $(this).val();
        if (idMarca) {
            cargarModelosPorMarca(idMarca);
        }
    });
    
    // Cuando cambia la marca en el filtro, actualizar modelos disponibles
    $("#filtro-marca").change(function() {
        const idMarca = $(this).val();
        if (idMarca) {
            cargarFiltroModelosPorMarca(idMarca);
        } else {
            cargarFiltroModelos();
        }
    });
    
    // Event delegation para botones de editar y eliminar
    $("#tabla-piezas").on("click", ".btn-editar", function() {
        const idPieza = $(this).data("id");
        prepararEditarPieza(idPieza);
    });
    
    $("#tabla-piezas").on("click", ".btn-eliminar", function() {
        const idPieza = $(this).data("id");
        confirmarEliminarPieza(idPieza);
    });
    
    // Aplicar filtros
    $("#btn-aplicar-filtros").click(function() {
        aplicarFiltros();
    });
    
    // Limpiar filtros
    $("#btn-limpiar-filtros").click(function() {
        limpiarFiltros();
    });
});

// Función para mostrar mensaje inicial
function mostrarMensajeInicial() {
    const tablaPiezas = $("#tabla-piezas");
    tablaPiezas.empty();
    tablaPiezas.append('<tr><td colspan="7" class="text-center">Utiliza los filtros para buscar piezas</td></tr>');
}

// Función para cargar todas las marcas
function cargarMarcas() {
    $.ajax({
        url: '/marcas',
        type: 'GET',
        success: function(marcas) {
            const marcaSelector = $("#marca");
            
            marcaSelector.empty();
            marcaSelector.append('<option selected>Seleccione una marca</option>');
            
            marcas.forEach(marca => {
                marcaSelector.append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar marcas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar las marcas. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar todos los modelos
function cargarModelos() {
    $.ajax({
        url: '/modelos',
        type: 'GET',
        success: function(modelos) {
            const modeloSelector = $("#modelo");
            
            modeloSelector.empty();
            modeloSelector.append('<option selected>Seleccione un modelo</option>');
            
            modelos.forEach(modelo => {
                modeloSelector.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar modelos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los modelos. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar modelos por marca
function cargarModelosPorMarca(idMarca) {
    $.ajax({
        url: `/modelos/marca/${idMarca}`,
        type: 'GET',
        success: function(modelos) {
            const modeloSelector = $("#modelo");
            
            modeloSelector.empty();
            modeloSelector.append('<option selected>Seleccione un modelo</option>');
            
            modelos.forEach(modelo => {
                modeloSelector.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar modelos por marca:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los modelos. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar categorías
function cargarCategorias() {
    $.ajax({
        url: '/categorias',
        type: 'GET',
        success: function(categorias) {
            const categoriaSelector = $("#categoria");
            
            categoriaSelector.empty();
            categoriaSelector.append('<option selected>Seleccione una categoría</option>');
            
            categorias.forEach(categoria => {
                categoriaSelector.append(`<option value="${categoria.id_categoria}">${categoria.nombre_categoria}</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar categorías:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar las categorías. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar marcas en el filtro
function cargarFiltroMarcas() {
    $.ajax({
        url: '/marcas',
        type: 'GET',
        success: function(marcas) {
            const marcaSelector = $("#filtro-marca");
            
            marcaSelector.empty();
            marcaSelector.append('<option value="" selected>Todas las marcas</option>');
            
            marcas.forEach(marca => {
                marcaSelector.append(`<option value="${marca.id_marca}">${marca.nombre_marca}</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar marcas para filtro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar las marcas para filtro. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar modelos en el filtro
function cargarFiltroModelos() {
    $.ajax({
        url: '/modelos',
        type: 'GET',
        success: function(modelos) {
            const modeloSelector = $("#filtro-modelo");
            
            modeloSelector.empty();
            modeloSelector.append('<option value="" selected>Todos los modelos</option>');
            
            modelos.forEach(modelo => {
                modeloSelector.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar modelos para filtro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los modelos para filtro. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar modelos por marca en el filtro
function cargarFiltroModelosPorMarca(idMarca) {
    $.ajax({
        url: `/modelos/marca/${idMarca}`,
        type: 'GET',
        success: function(modelos) {
            const modeloSelector = $("#filtro-modelo");
            
            modeloSelector.empty();
            modeloSelector.append('<option value="" selected>Todos los modelos</option>');
            
            modelos.forEach(modelo => {
                modeloSelector.append(`<option value="${modelo.id_modelo}">${modelo.nombre_modelo} (${modelo.anio_modelo})</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar modelos por marca para filtro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los modelos por marca para filtro. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar categorías en el filtro
function cargarFiltroCategorias() {
    $.ajax({
        url: '/categorias',
        type: 'GET',
        success: function(categorias) {
            const categoriaSelector = $("#filtro-categoria");
            
            categoriaSelector.empty();
            categoriaSelector.append('<option value="" selected>Todas las categorías</option>');
            
            categorias.forEach(categoria => {
                categoriaSelector.append(`<option value="${categoria.id_categoria}">${categoria.nombre_categoria}</option>`);
            });
        },
        error: function(error) {
            console.error('Error al cargar categorías para filtro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar las categorías para filtro. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para aplicar filtros
function aplicarFiltros() {
    const idMarca = $("#filtro-marca").val();
    const idModelo = $("#filtro-modelo").val();
    const idCategoria = $("#filtro-categoria").val();
    
    // Construir la URL con los parámetros de filtro
    let url = '/piezas/filtrar?';
    let parametros = [];
    
    // Validar que los IDs son numéricos antes de agregarlos
    if (idMarca && idMarca !== "" && !isNaN(parseInt(idMarca, 10))) {
        parametros.push(`marca=${idMarca}`);
    }
    
    if (idModelo && idModelo !== "" && !isNaN(parseInt(idModelo, 10))) {
        parametros.push(`modelo=${idModelo}`);
    }
    
    if (idCategoria && idCategoria !== "" && !isNaN(parseInt(idCategoria, 10))) {
        parametros.push(`categoria=${idCategoria}`);
    }
    
    // Si no hay parámetros válidos, cargar todas las piezas
    if (parametros.length === 0) {
        cargarPiezas();
        return;
    }
    
    url += parametros.join('&');
    
    $.ajax({
        url: url,
        type: 'GET',
        success: function(piezas) {
            mostrarPiezas(piezas);
        },
        error: function(error) {
            console.error('Error al filtrar piezas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al filtrar las piezas. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para limpiar filtros
function limpiarFiltros() {
    $("#filtro-marca").val('');
    $("#filtro-modelo").val('');
    $("#filtro-categoria").val('');
    
    // Recargar los selectores
    cargarFiltroModelos();
    
    // Mostrar todas las piezas
    cargarPiezas();
}

// Función para crear una pieza
function crearPieza() {
    // Obtener los datos del formulario
    const nombrePieza = $("#nombre").val();
    const descripcion = $("#descripcion").val();
    const idMarca = $("#marca").val();
    const idModelo = $("#modelo").val();
    const idCategoria = $("#categoria").val();
    const cantidad = $("#stock").val();
    const precio = $("#precio").val();
    const imagen = $('#imageSelect').val();
    
    // Validar que todos los campos requeridos estén completos
    if (!nombrePieza || idMarca === "Seleccione una marca" || idModelo === "Seleccione un modelo" || 
        idCategoria === "Seleccione una categoría" || !cantidad) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor, complete todos los campos requeridos.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    
    // Crear objeto con los datos de la pieza
    const pieza = {
        nombre_pieza: nombrePieza,
        descripcion: descripcion,
        id_marca: idMarca,
        id_modelo: idModelo,
        id_categoria: idCategoria,
        cantidad: cantidad,
        precio: precio || 0,
        imagen: imagen
    };
    
    // Enviar la solicitud al servidor
    $.ajax({
        url: '/piezas',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(pieza),
        success: function(response) {
            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Pieza creada exitosamente.',
                confirmButtonText: 'Aceptar'
            });

            // Agregar la nueva pieza a la tabla
            const tablaPiezas = $("#tabla-piezas");
            
            // Si la tabla está vacía y muestra el mensaje "No hay piezas disponibles", limpiarla
            if (tablaPiezas.find("tr td").length === 1 && tablaPiezas.find("tr td").text().includes("No hay piezas disponibles")) {
                tablaPiezas.empty();
            }

            // Obtener los nombres de marca, modelo y categoría de los selectores
            const marcaNombre = $("#marca option:selected").text();
            const modeloNombre = $("#modelo option:selected").text();
            const categoriaNombre = $("#categoria option:selected").text();

            // Agregar la nueva fila a la tabla
            tablaPiezas.append(`
                <tr>
                    <td>${nombrePieza}</td>
                    <td>${descripcion || 'Sin descripción'}</td>
                    <td>${marcaNombre}</td>
                    <td>${modeloNombre}</td>
                    <td>${categoriaNombre}</td>
                    <td>${cantidad}</td>
                    <td>$${precio || '0.00'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-editar" data-id="${response.id_pieza}">Editar</button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${response.id_pieza}">Eliminar</button>
                    </td>
                </tr>
            `);
            
            // Limpiar el formulario
            limpiarFormulario();
        },
        error: function(error) {
            console.error('Error al crear la pieza:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al crear la pieza. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para actualizar una pieza
function actualizarPieza(idPieza) {
    // Obtener los datos del formulario
    const nombrePieza = $("#nombre").val();
    const descripcion = $("#descripcion").val();
    const idMarca = $("#marca").val();
    const idModelo = $("#modelo").val();
    const idCategoria = $("#categoria").val();
    const cantidad = $("#stock").val();
    const precio = $("#precio").val();
    const imagen = $("#imageSelect").val();
    // Validar que todos los campos requeridos estén completos
    if (!nombrePieza || idMarca === "Seleccione una marca" || idModelo === "Seleccione un modelo" ||
        idCategoria === "Seleccione una categoría" || !cantidad) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Por favor, complete todos los campos requeridos.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Crear objeto con los datos de la pieza
    const pieza = {
        nombre_pieza: nombrePieza,
        descripcion: descripcion,
        id_marca: idMarca,
        id_modelo: idModelo,
        id_categoria: idCategoria,
        cantidad: cantidad,
        precio: precio || 0,
        imagen: imagen
    };

    // Enviar la solicitud al servidor
    $.ajax({
        url: `/piezas/${idPieza}`, // URL para actualizar la pieza específica
        type: 'PUT', // Usar el método PUT para actualizaciones
        contentType: 'application/json',
        data: JSON.stringify(pieza),
        success: function(response) {
            // Mostrar mensaje de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Pieza actualizada exitosamente.',
                confirmButtonText: 'Aceptar'
            });

            // Limpiar el formulario y resetear el botón
            limpiarFormulario();
            $("#crear").text("Crear").removeData("id").removeData("modo");
            
            // Recargar las piezas para mostrar los cambios
            cargarPiezas();
        },
        error: function(error) {
            console.error('Error al actualizar la pieza:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar la pieza. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para limpiar el formulario
function limpiarFormulario() {
    $("#nombre").val('');
    $("#marca").val('Seleccione una marca');
    $("#modelo").val('Seleccione un modelo');
    $("#categoria").val('Seleccione una categoría');
    $("#stock").val('0');
    $("#precio").val('0.00');
}

// Función para preparar la edición de una pieza
function prepararEditarPieza(idPieza) {
    // Obtener los datos de la pieza por su ID
    $.ajax({
        url: `/piezas/${idPieza}`,
        type: 'GET',
        success: function(pieza) {
            // Llenar el formulario con los datos de la pieza
            $("#nombre").val(pieza.nombre_pieza);
            $("#marca").val(pieza.id_marca);
            
            // Cargar y seleccionar el modelo correspondiente
            cargarModelosPorMarca(pieza.id_marca);
            setTimeout(() => {
                $("#modelo").val(pieza.id_modelo);
            }, 500);
            
            $("#categoria").val(pieza.id_categoria);
            $("#stock").val(pieza.cantidad);
            $("#precio").val(pieza.precio);
            
            // Cambiar el botón de crear por actualizar
            $("#crear").text("Actualizar").data("id", pieza.id_pieza).data("modo", "editar");
            
            // Hacer scroll hasta el formulario
            $('html, body').animate({
                scrollTop: $(".inventory-section").offset().top - 100
            }, 500);
        },
        error: function(error) {
            console.error('Error al cargar la pieza para editar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar la pieza para editar. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para confirmar eliminación de una pieza
function confirmarEliminarPieza(idPieza) {
    Swal.fire({
        title: '¿Está seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarPieza(idPieza);
        }
    });
}

// Función para eliminar una pieza
function eliminarPieza(idPieza) {
    $.ajax({
        url: `/piezas/${idPieza}`,
        type: 'DELETE',
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'Pieza eliminada exitosamente.',
                confirmButtonText: 'Aceptar'
            });
            
            // Actualizar la tabla
            cargarPiezas();
        },
        error: function(error) {
            console.error('Error al eliminar la pieza:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar la pieza. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para cargar todas las piezas
function cargarPiezas() {
    $.ajax({
        url: '/piezas',
        type: 'GET',
        success: function(piezas) {
            mostrarPiezas(piezas);
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar piezas:', error);
            console.log('Estado de la respuesta:', status);
            console.log('Respuesta del servidor:', xhr.responseText);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar piezas',
                text: 'No se pudieron cargar las piezas. Detalles: ' + (xhr.responseText || error),
                confirmButtonText: 'Aceptar'
            });

            // Mostrar mensaje en la tabla para indicar que no hay piezas
            const tablaPiezas = $("#tabla-piezas");
            tablaPiezas.empty();
            tablaPiezas.append('<tr><td colspan="8" class="text-center">No se pudieron cargar las piezas. Por favor, intente de nuevo.</td></tr>');
        }
    });
}

// Función para mostrar las piezas en la tabla
async function mostrarPiezas(piezas) {
    
    const tablaPiezas = $("#tabla-piezas");
    
    tablaPiezas.empty();
    
    if (!piezas || piezas.length === 0) {
        tablaPiezas.append('<tr><td colspan="8" class="text-center">No hay piezas disponibles</td></tr>');
        return;
    }
    
    piezas.forEach(pieza => {
        console.log(pieza)
        tablaPiezas.append(`
            <tr>
                <td>${pieza.nombre_pieza}</td>
                <td>${pieza.descripcion || 'Sin descripción'}</td>
                <td>${pieza.marca_nombre || 'N/A'}</td>
                <td>${pieza.modelo_nombre || 'N/A'}</td>
                <td>${pieza.categoria_nombre || 'N/A'}</td>
                <td>${pieza.cantidad}</td>
                <td>$${pieza.precio || '0.00'}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar" data-id="${pieza.id_pieza}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${pieza.id_pieza}">Eliminar</button>
                </td>
            </tr>
        `);
    });
}

// Función para filtrar piezas por texto
function filtrarPiezasPorTexto(texto) {
    if (texto.length < 3) {
        mostrarMensajeInicial();
        return;
    }
    
    $.ajax({
        url: `/piezas/filtrar?nombre=${encodeURIComponent(texto)}`,
        type: 'GET',
        success: function(piezas) {
            mostrarPiezas(piezas);
        },
        error: function(error) {
            console.error('Error al filtrar piezas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al filtrar las piezas. Por favor, intente de nuevo.',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}