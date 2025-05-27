let idPieza = location.search.split('id=')[1];
// Toma el id de la pieza desde la url

$(document).ready(async function (){
    const pieza = await cargarPieza(idPieza);
    const piezaHtml = `
    <div id="productDetails" class="row">
    <img src="img/${pieza.imagen}" class="col-md-4 card ">
    <div class="detalleProducto col-md-7">
    <div class="d-flex align-items-center"><h1 class="fs-1 fw-bold p-2">${pieza.nombre_pieza}</h1>
    <label id="idPieza" class="text-secondary ms-2" value="${pieza.id}">SKU: ${pieza.id_pieza}</label>
    </div>
    <div class="col">
    <span id="precio" class="fs-2 text-primary fw-bold p-2" value="${pieza.precio}">$${pieza.precio}.00</span>
    <span class="fs-6 text-info-emphasis bg-body-secondary p-1 ms-3">${pieza.cantidad} en existencia</span>
    </div>
    <div id="modelo&marca" class="d-flex gap-2 align-items-center mb-2">
    <span class="fs-5"><span class="fw-semibold p-2">Marca:</span>${pieza.marca_nombre}</span>
    <span class="fs-5"><span class="fw-semibold p-2">Modelo:</span>${pieza.modelo_nombre}</span>
    </div>
    <div id="productoDescripcion" class="p-2">
    <div class="fs-5">${pieza.descripcion}</div>
    </div>`;
    $('main').append(piezaHtml);
})

async function cargarPieza(idPieza){
    try{
        const response = await fetch(`/piezas/${idPieza}`);
        if(response.ok){
            console.log("Pieza cargada exitosamente.");
            const pieza = await response.json();
            return pieza;
    }
    }
    catch (error){
        console.error("Error al cargar pieza: " + error)
    }
}