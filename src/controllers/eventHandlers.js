/**
 *   Controller unificado de la aplicación. Inicializa y gestiona todos los
 *   eventos de usuario:
 *   - Submit del formulario para agregar tareas
 *   - Click en filtros chip (Todas / Pendientes / Completadas)
 *   - Delegación de eventos en la lista (toggle, delete, edit)
 *   - Hover visual en los items de la lista
 *   - Click en botón "Cargar desde API"
 */

/**
 * Inicializa todos los eventos de la aplicación.
 * Configura listeners para el formulario, filtros, lista y botón de API.
 */
const inicializarEventos = (gestor, clave) => {
  //  Elementos del DOM
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const deadline = document.getElementById('task-deadline');
  const list = document.getElementById('task-list');
  const btnApi = document.getElementById('btn-cargar-api');
  const filterButtons = document.querySelectorAll('[data-filter]');

  //  Estado del filtro
  let filtroActual = 'todas';

  /**
   * Filtra las tareas según el filtro activo.
   */
  const filtrarTareas = (tareas) => {
    if (filtroActual === 'pendiente') return tareas.filter((t) => t.estado === 'pendiente');
    if (filtroActual === 'completada') return tareas.filter((t) => t.estado === 'completada');
    return tareas;
  };

  //  Funciones auxiliares

  /**
   * Obtiene las tareas filtradas y las renderiza.
   * También actualiza qué chip de filtro está activo visualmente.
   */
  const renderizarSegunFiltro = () => {
    const tareas = filtrarTareas(gestor.obtenerActivas());
    const mensajes = {
      todas: 'No hay tareas activas...',
      pendiente: 'No hay tareas pendientes.',
      completada: 'No hay tareas completadas.',
    };
    UI.renderizarTodas(tareas, mensajes[filtroActual] ?? mensajes.todas);
    actualizarFiltroActivo();
  };

  /**
   * Sincroniza la clase visual tf-chip--active con el filtro actual.
   * Usa classList.toggle con el segundo argumento (force) para activar/desactivar.
   */
  const actualizarFiltroActivo = () => {
    filterButtons.forEach((boton) => {
      boton.classList.toggle('tf-chip--active', boton.dataset.filter === filtroActual);
    });
  };

  /**
   * Función central que se ejecuta tras cualquier cambio en los datos:
   * re-renderiza, actualiza contadores y persiste en localStorage.
   */
  const guardarYRefrescar = () => {
    renderizarSegunFiltro();
    UI.actualizarContadores();
    StorageService.guardar(clave, gestor.obtenerActivas());
  };

  //  Formulario: agregar tarea
  // Escucha el evento 'submit', previene el comportamiento por defecto
  // del formulario y crea la tarea con los datos del input.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = input.value.trim();
    const fecha = deadline.value || null;
    if (!desc) return;

    const tarea = gestor.agregarTarea(desc);
    tarea.establecerFechaLimite(fecha);
    UI.limpiarInput();
    guardarYRefrescar();
    UI.mostrarNotificacion('Tarea guardada correctamente.', 'success');
  });

  //  Filtros chip
  // Cada botón de filtro actualiza la variable filtroActual y re-renderiza.
  filterButtons.forEach((boton) => {
    boton.addEventListener('click', () => {
      filtroActual = boton.dataset.filter || 'todas';
      renderizarSegunFiltro();
    });
  });

  //  Lista: delegación de eventos (click)
  // Un solo listener en el <ul> maneja todos los clicks de los <li>.
  // Usa closest() para encontrar el <li> padre y el [data-action] del botón.
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    const id = Number(li?.dataset.id);
    if (!id) return;

    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    switch (action) {
      case 'delete':
        gestor.eliminarTarea(id);
        guardarYRefrescar();
        break;

      case 'toggle': {
        const tarea = gestor.obtenerTareaPorId(id);
        if (tarea) {
          const nuevoEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada';
          gestor.cambiarEstadoTarea(id, nuevoEstado);
          guardarYRefrescar();
        }
        break;
      }

      case 'edit': {
        const tarea = gestor.obtenerTareaPorId(id);
        if (!tarea) break;

        // Edición simple con prompt() nativo del navegador
        const nuevaDesc = prompt('Nueva descripción:', tarea.descripcion);
        if (nuevaDesc !== null && nuevaDesc.trim()) {
          tarea.descripcion = nuevaDesc.trim();
          guardarYRefrescar();
          UI.mostrarNotificacion('Tarea editada correctamente.', 'success');
        }
        break;
      }
    }
  });

  // Efectos hover en los items de la lista (mouseover / mouseout)
  list.addEventListener('mouseover', (e) => {
    const li = e.target.closest('li');
    if (li) li.classList.add('shadow-sm');
  });
  list.addEventListener('mouseout', (e) => {
    const li = e.target.closest('li');
    if (li) li.classList.remove('shadow-sm');
  });

  //  Botón: cargar desde API
  // Usa async/await para esperar la respuesta de la API antes de refrescar.
  btnApi?.addEventListener('click', async () => {
    const tareas = await ApiService.cargarTareasSugeridas();
    gestor.agregarTareas(...tareas);
    guardarYRefrescar();
    UI.mostrarNotificacion('Tareas de ejemplo cargadas desde API.', 'warning');
  });

  //  Render inicial
  renderizarSegunFiltro();
};

window.inicializarEventos = inicializarEventos;
