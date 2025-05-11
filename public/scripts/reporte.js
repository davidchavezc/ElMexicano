function generarGrafica(datos) {
    const labels = datos.map(d => new Date(d.fecha).toLocaleDateString());
    const montos = datos.map(d => parseFloat(d.total));
  
    const ctx = document.getElementById('grafica-ventas').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Ventas por día',
          data: montos,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  function cargarDatosGrafica() {
    const anio = $('#filtro-anio').val();
    const mes = $('#filtro-mes').val();
  
    const params = {};
    if (anio) params.año = anio;
    if (mes) params.mes = mes;
  
    $.get('/api/reporte/grafica', params, function (datos) {
      generarGrafica(datos);
    });
  }
  
  $(document).ready(function () {
    cargarDatosGrafica();
  
    $('#btn-generar-reporte').click(function () {
      cargarDatosGrafica();
    });
  });
  