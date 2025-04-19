let idPieza = location.search.split('id=')[1];
// Toma el id de la pieza desde la url

$(document).ready(async function (){
    const pieza = await cargarPieza(idPieza);
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
