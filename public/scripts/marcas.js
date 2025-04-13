async function cargarMarcas() {
    try {
      const response = await fetch("/marcas");
      const marcas = await response.json();
  
      const select = document.getElementById("marcas");
      select.innerHTML = "";
  
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "Ver marcas actuales";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);
  
      marcas.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca.id_marca;
        option.textContent = marca.nombre_marca;
        select.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar marcas:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Llamamos al cargar la página
    cargarMarcas();
  
    const btnCrear = document.getElementById("btn-crear-marca");
  
    btnCrear.addEventListener("click", async () => {
      const inputNombre = document.getElementById("nombre-marca");
      const nombreMarca = inputNombre.value.trim();
  
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
          inputNombre.value = "";
  
          cargarMarcas();
        } else {
          throw new Error("No se pudo crear la marca.");
        }
      } catch (error) {
        console.error("Error al crear la marca:", error);
        alert("Ocurrió un error al crear la marca.");
      }
    });
  });