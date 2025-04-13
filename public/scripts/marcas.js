document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("/marcas");
      const marcas = await response.json();
  
      const select = document.getElementById("marcas");
      select.innerHTML = "";

      const defaultOption = document.createElement("option");
    defaultOption.textContent = "Ver marcas actuales";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);//para que si pueda decir que vea las marcas actuales
  
      marcas.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca.id_marca;
        option.textContent = marca.nombre_marca;
        select.appendChild(option);
      });
    } catch (error) {
      console.error("Error al cargar marcas:", error);
    }
  });