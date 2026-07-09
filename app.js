/**
 *   Punto de entrada de la aplicación TaskFlow.
 *   Se ejecuta cuando el DOM está completamente cargado (DOMContentLoaded).
 *   Responsabilidades:
 *     1. Crear la instancia del GestorTareas (modelo central)
 *     2. Rehidratar tareas desde localStorage (persistencia)
 *     3. Si no hay tareas guardadas, cargar desde la API externa
 *     4. Inicializar todos los eventos del controller
 *     5. Arrancar el timer de actualización de contadores (setInterval)
 */
document.addEventListener('DOMContentLoaded', () => {
  const clave = 'taskflow-tareas';
  const gestor = new GestorTareas();

  // Expone el gestor globalmente para que UI.actualizarContadores() pueda accederlo
  window.__taskflowGestor = gestor;

  //  1. Rehidratar tareas desde localStorage
  const tareasGuardadas = StorageService.cargar(clave);
  if (tareasGuardadas.length) {
    gestor.cargarTareas(tareasGuardadas);
  }

  //  2. Si no hay tareas, cargar desde la API
  if (gestor.obtenerActivas().length === 0) {
    ApiService.cargarTareasSugeridas().then((tareas) => {
      if (!tareas.length) return;

      gestor.agregarTareas(...tareas);
      UI.renderizarTodas(gestor.obtenerActivas());
      UI.actualizarContadores();
      StorageService.guardar(clave, gestor.obtenerActivas());
      UI.mostrarNotificacion('Tareas iniciales cargadas desde la API.', 'info');
    });
  }

  //  3. Inicializar todos los eventos del controller
  inicializarEventos(gestor, clave);

  //  4. Timer: actualizar contadores cada segundo
  setInterval(() => {
    UI.actualizarContadores();
  }, 1000);
});
