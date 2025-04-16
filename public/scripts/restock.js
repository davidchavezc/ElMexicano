$(document).ready(async function () {
    try {
      const response = await fetch("/restock");
      const piezas = await response.json();

      const $vistaGeneral = $("#piezas-disponibles");
      $vistaGeneral.empty();

      piezas.forEach((pieza) => {
        
        const div =(`
        <div class="col">
                <div class="card h-100">
                    <img src="${pieza.imagen}" alt="Motor de arranque" class="card-img-top">
                    <div class="card-body text-center">
                        <p>${pieza.nombre_pieza}</p>
                        <p><span class="text-danger">${pieza.cantidad} en stock</span></p>
                    </div>
                </div>
            </div>
            `)
            $vistaGeneral.append(div);
      });
  
    } catch (error) {
      console.error("Error al cargar piezas:", error);
    }
  });