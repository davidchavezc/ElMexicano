function generarGrafica(datos) {
  const labels = datos.map(d => new Date(d.fecha).toLocaleDateString());
  const montos = datos.map(d => parseFloat(d.total));

  const ctx = document.getElementById('grafica-ventas').getContext('2d');

  // Destruir gráfica previa si existe
  if (window.graficaVentas) {
    window.graficaVentas.destroy();
  }

  window.graficaVentas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Total vendido',
        data: montos,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 38
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Ventas Diarias - Historial de Ingresos',
          font: {
            size: 22,
            weight: 'bold',
            family: 'Arial'
          },
          color: '#222',
          padding: {
            top: 10,
            bottom: 15
          }
        },
        subtitle: {
          display: true,
          text: 'Visualización del monto total por fecha registrada',
          font: {
            size: 14,
            style: 'italic'
          },
          color: '#555'
        },
        tooltip: {
          backgroundColor: '#333',
          titleFont: { size: 14 },
          bodyFont: { size: 13 },
          callbacks: {
            label: function (context) {
              return ` Total: $${context.parsed.y.toLocaleString()}`;
            }
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha de Venta',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Monto Total en Pesos ($)',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
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
  }).fail(function () {
    alert('Error al cargar los datos de la gráfica.');
  });
}

$(document).ready(function () {
  // Si se quiere generar automáticamente al cargar la página, descomentar la linea:
  // cargarDatosGrafica();

  $('#btn-generar-reporte').click(function () {
    cargarDatosGrafica();
  });
});
