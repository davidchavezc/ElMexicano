$('#startingYear').val('2018');
$('#endingYear').val('2025')
// Establece valores por default en el filtro de catalogo

$(document).ready( async function () {
        desplegarMarcas();
        desplegarCategorias();
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