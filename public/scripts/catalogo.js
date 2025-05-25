$('#startingYear').val('2018');
$('#endingYear').val('2025')
// Establece valores por default en el filtro de catalogo

$(document).ready( async function () {
        desplegarMarcas();
        desplegarCategorias();
        desplegarPiezas();
    }
)

async function desplegarMarcas(){
    const response = await fetch("/marcas");
    const marcas = await response.json();
    marcas.forEach(marca => {
        const marcahtml = `<li><input type="checkbox"> ${marca.nombre_marca}</li>`
        $('#listaMarcas').append(marcahtml);
    });
}

async function desplegarCategorias(){
    const response = await fetch("/categorias");
    const categorias = await response.json();
    categorias.forEach(categoria => {
        const categoriahtml = `<li><input type="checkbox"> ${categoria.nombre}</li>`
        $('#listaCategorias').append(categoriahtml);
    })
}

async function desplegarPiezas(){
    const response = await fetch("/piezas");
    const piezas = await response.json();
    piezas.forEach((pieza) => {
        // console.log(pieza.nombre_categoria)
        const piezahtml = `
        <div class="col" class="pieza-tarjeta">
        <div class="card text-center">
        <a href='/detalle?id=${pieza.id_pieza}' class='text-decoration-none text-black'>
        <img src="/img/${pieza.id_categoria}.png" class="card-img-top" alt="${pieza.nombre_pieza}">
        <div class="card-body">
        <h6 class="card-title">${pieza.nombre_pieza}</h6>
        <p class="card-text">SKU: ${pieza.id_pieza}</p>
        </a>
        </div>
        </div>
        </div>`
        $('#cuadriculaPiezas').append(piezahtml);
    })
}

