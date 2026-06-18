const UMBRAL_CONFIRMACIONES_VERIFICADO = 2;
const DIAS_RECIENTE = 7;

// Calcula el estado de confiabilidad de un reporte de precio SIN
// guardarlo en la base de datos: se recalcula cada vez que alguien
// lo consulta, usando la fecha de creación y las confirmaciones.
function calcularEstado(reporte) {
  if (reporte.confirmaciones >= UMBRAL_CONFIRMACIONES_VERIFICADO) {
    return 'verificado';
  }

  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const diasTranscurridos = (Date.now() - reporte.createdAt.getTime()) / milisegundosPorDia;

  if (diasTranscurridos <= DIAS_RECIENTE) {
    return 'reciente';
  }

  return 'desactualizado';
}

module.exports = calcularEstado;
