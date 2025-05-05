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
  if (data.length === 0) {
    $('#ventas-container').html('<div class="alert alert-info">No se encontraron ventas para la fecha seleccionada.</div>');
    return;
  }

  const html = `
    <div class="table-responsive">
      <table class="table table-bordered table-striped table-hover" id="tabla-historial">
        <thead class="table-dark text-center">
          <tr>
            <th>ID Venta</th>
            <th>Pieza</th>
            <th>Total de Piezas</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Método de Pago</th>
            <th>Empleado</th>
            <th>Monto Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => {
            const detalles = item.detalles.map(d => `${d.cantidad} x ${d.nombre_pieza} (ID: ${d.id_pieza})`).join('<br>');
            const totalPiezas = item.detalles.reduce((sum, d) => sum + d.cantidad, 0);
            return `
              <tr>
                <td>${item.id_venta}</td>
                <td>${detalles}</td>
                <td>${totalPiezas}</td>
                <td>${item.nombre_cliente}</td>
                <td>${new Date(item.fecha_hora).toLocaleString()}</td>
                <td>${item.metodo_pago}</td>
                <td>${item.empleado}</td>
                <td>$${item.monto_total}</td>
              </tr>
            `;
          }).join('')}
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
  if (anio && anio !== "Año") params.año = anio;
  if (mes && mes !== "Mes") params.mes = mes;
  if (dia && dia !== "Día") params.dia = dia;

  // Si no se selecciona ninguna fecha, mostrar todas las ventas
  if (Object.keys(params).length === 0) {
    cargarHistorial();
    return;
  }

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
    filtrarHistorial();
  });

  $('#btn-limpiar').click(function () {
    $('#filtro-anio').val('Año');
    $('#filtro-mes').val('Mes');
    $('#filtro-dia').empty().append('<option value="">Día</option>');
    cargarHistorial();
  });
});
