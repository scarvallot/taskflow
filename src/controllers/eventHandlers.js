// controllers/eventHandlers.js
const inicializarEventos = (gestor, clave) => {
  // --- Agregar tarea ---
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const descripcion = document.getElementById('task-input').value.trim();

    if (!descripcion) return;

    const tarea = gestor.agregarTarea(descripcion);
    UI.renderizarTarea(tarea);
    UI.limpiarInput();
    StorageService.guardar(clave, gestor.obtenerActivas());
  });

  // --- Eventos en la lista (delegación) ---
  document.getElementById('task-list').addEventListener('click', (e) => {
    const li = e.target.closest('li');
    const id = Number(li?.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('btn-eliminar')) {
      gestor.eliminarTarea(id);
      UI.renderizarTodas(gestor.obtenerActivas());
      StorageService.guardar(clave, gestor.obtenerActivas());
    }

    if (e.target.classList.contains('btn-completar')) {
      const tarea = gestor.tareas.find((t) => t.id === id);
      if (tarea) {
        const nuevoEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada';
        gestor.cambiarEstadoTarea(id, nuevoEstado);

        UI.renderizarTodas(gestor.obtenerActivas());
        StorageService.guardar(clave, gestor.obtenerActivas());
      }
    }
  });
};
