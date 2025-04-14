$(document).ready(async function () {
    // Función para cargar las marcas
    async function cargarMarcas() {
      try {
        const response = await fetch("/marcas");
        const marcas = await response.json();
    
        const $select = $(".form-select");
        $select.empty();  // Limpiar las opciones existentes
    
        const $defaultOption = $("<option>").text("Ver marcas actuales").prop("disabled", true).prop("selected", true);
        $select.append($defaultOption);
    
        marcas.forEach((marca) => {
          const $option = $("<option>").val(marca.id_marca).text(marca.nombre_marca);
          $select.append($option);
        });
      } catch (error) {
        console.error("Error al cargar marcas:", error);
      }
    }
  
    // Llamar la función al cargar la página
    await cargarMarcas();
  
    // Manejo del evento para crear una nueva marca
    $("#btn-crear-marca").on("click", async function () {
      const nombreMarca = $("#nombre-marca").val().trim();
    
      if (nombreMarca === "") {
        alert("Por favor escribe un nombre de marca.");
        return;
      }
    
      try {
        const response = await fetch("/marcas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_marca: nombreMarca })
        });
    
        if (response.ok) {
          const nuevaMarca = await response.json();
          alert(`Marca creada: ${nuevaMarca.nombre_marca}`);
          $("#nombre-marca").val("");  // Limpiar el campo de texto
    
          // Recargar las marcas
          await cargarMarcas();
        } else {
          throw new Error("No se pudo crear la marca.");
        }
      } catch (error) {
        console.error("Error al crear la marca:", error);
        alert("Ocurrió un error al crear la marca.");
      }
    });
  
    $('#btn-eliminar-marca').on("click", async function () {
      const nombreMarcaE = $('.form-select').val()?.trim();

      if (!nombreMarcaE) {
        alert("Por favor selecciona una marca para eliminar.");
        return;
      }
    
      const confirmacion = confirm(`¿Estás seguro de que deseas eliminar la marca "${nombreMarcaE}"?`);
      if (!confirmacion) return;

      try{
        const response= await fetch("/marcas",{
          method:"DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_marca: nombreMarcaE })
        })

        if (response.ok) {
          alert("Marca eliminada correctamente.");
          // Aquí podrías volver a cargar el select con marcas actualizadas:
          cargarMarcas(); // si tienes esta función, vuelve a cargar el select
        } else {
          const errorText = await response.text();
          alert("No se pudo eliminar la marca: " + errorText);
        }

      }
      
      catch{
        console.error("Error al eliminar la marca:", error);
        alert("Ocurrió un error al intentar eliminar la marca.");
      }
    })
    // Limpiar el campo de texto al hacer clic en el botón de limpiar
    $("#btn-limpiar1-marca").on("click", function () {
      $("#nombre-marca").val("");
    });
  });