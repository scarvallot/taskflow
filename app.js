// app.js
document.addEventListener('DOMContentLoaded', () => {
  const clave = 'taskflow-tareas';
  const gestor = new GestorTareas();

  // Cargar datos guardados
  const tareasGuardadas = StorageService.cargar(clave);
  if (tareasGuardadas) {
    gestor.cargarTareas(tareasGuardadas);
  }

  // Renderizar tareas iniciales
  UI.renderizarTodas(gestor.obtenerActivas());

  // Inicializar eventos
  inicializarEventos(gestor, clave);
});
