function llenarSelectsFecha() {
  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const $mes = $('#filtro-mes');
  const $dia = $('#filtro-dia');

  // Llenar meses
  for (let i = 0; i < 12; i++) {
    $mes.append(`<option value="${i + 1}">${nombresMeses[i]}</option>`);
  }

  // Cambiar días según mes y año
  $('#filtro-anio, #filtro-mes').on('change', function () {
    const anio = parseInt($('#filtro-anio').val());
    const mes = parseInt($('#filtro-mes').val());

    $dia.empty().append('<option value="">Día</option>');

    if (!isNaN(anio) && !isNaN(mes)) {
      const diasEnMes = new Date(anio, mes, 0).getDate();
      for (let d = 1; d <= diasEnMes; d++) {
        $dia.append(`<option value="${d}">${d}</option>`);
      }
    }
  });
}

function renderTabla(data) {
  const html = `
    <div class="table-responsive">
      <table class="table table-bordered table-striped table-hover" id="tabla-historial">
        <thead class="table-dark text-center">
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Empleado</th>
            <th>Método de Pago</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              <td>${item.id_venta}</td>
              <td>${item.nombre_cliente}</td>
              <td>${new Date(item.fecha_hora).toLocaleString()}</td>
              <td>${item.empleado}</td>
              <td>${item.metodo_pago}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  $('#ventas-container').html(html);
}

function cargarHistorial() {
  $.get('/api/historial', function (data) {
    renderTabla(data);
  });
}

function filtrarHistorial() {
  const anio = $('#filtro-anio').val();
  const mes = $('#filtro-mes').val();
  const dia = $('#filtro-dia').val();

  const params = {};
  if (anio) params.año = anio;  // Corrección del parámetro
  if (mes) params.mes = mes;
  if (dia) params.dia = dia;

  $.get('/api/historial', params, function (data) {
    renderTabla(data);
  });
}

$(document).ready(function () {
  llenarSelectsFecha();
  cargarHistorial();

  const botones = `
    <div class="d-flex justify-content-end gap-2 mb-3">
      <button class="btn btn-primary" id="btn-filtrar">Filtrar</button>
      <button class="btn btn-secondary" id="btn-limpiar">Limpiar</button>
    </div>
  `;
  $('#ventas-container').before(botones);

  $('#btn-filtrar').click(function () {
    console.log("Botón Filtrar presionado"); // Verifica si se detecta el clic en la consola
    filtrarHistorial();
});


  $('#btn-limpiar').click(function () {
    $('#filtro-anio, #filtro-mes, #filtro-dia').val('');
    $('#filtro-dia').empty().append('<option value="">Día</option>');
    cargarHistorial();
  });
});
