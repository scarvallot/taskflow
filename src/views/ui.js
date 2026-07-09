/**
 *   Vista unificada de la aplicación. Controla todo el renderizado del DOM:
 *   - Notificaciones de feedback (éxito, error, info)
 *   - Limpieza de inputs del formulario
 *   - Cálculo de tiempo restante y detección de vencimientos
 *   - Actualización de contadores en tiempo real (setInterval)
 *   - Resumen estadístico (total, pendientes, completadas, barra de progreso)
 *   - Renderizado de la lista de tareas (<li> con checkbox, botones, meta)
 *   - Sección lateral de próximos vencimientos
 */
const UI = {
  MAX_TAREAS_LISTADAS: 10,

  //  Notificaciones
  /**
   * Muestra una notificación temporal (2 segundos) en el área de feedback.
   * Usa las clases de Bootstrap Alert para el estilo visual.
   */
  mostrarNotificacion: (mensaje, tipo = 'info') => {
    const area = document.getElementById('task-notification');
    if (!area) return;

    area.className = `alert alert-${tipo} py-2 mb-3`;
    area.textContent = mensaje;
    area.hidden = false;

    clearTimeout(UI._notificacionTimeout);
    UI._notificacionTimeout = setTimeout(() => {
      area.hidden = true;
    }, 2000);
  },

  /**
   * Limpia los campos del formulario de nueva tarea (input y fecha límite).
   */
  limpiarInput: () => {
    const input = document.getElementById('task-input');
    if (input) input.value = '';

    const deadline = document.getElementById('task-deadline');
    if (deadline) deadline.value = '';
  },

  //  Tiempo y vencimientos

  /**
   * Calcula el tiempo restante entre ahora y una fecha límite.
   * Devuelve un string formateado como "Xh Ym Zs" o mensajes especiales.
   */
  calcularTiempoRestante: (fechaLimite) => {
    if (!fechaLimite) return 'Sin fecha límite';

    const limite = new Date(fechaLimite).getTime();
    const diferencia = limite - Date.now();

    if (Number.isNaN(limite)) return 'Fecha límite inválida';
    if (diferencia <= 0) return 'Vencida';

    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return `${horas}h ${minutos}m ${segundos}s`;
  },

  /**
   * Determina si una fecha límite ya pasó (la tarea está vencida).
   */
  esVencida: (fechaLimite) => {
    if (!fechaLimite) return false;
    const limite = new Date(fechaLimite).getTime();
    return !Number.isNaN(limite) && limite <= Date.now();
  },

  /**
   * Actualiza en tiempo real todos los contadores de vencimiento en el DOM.
   * Se ejecuta cada segundo mediante setInterval en app.js.
   * Recorre los elementos .task-countdown y .tf-countdown-item__timer
   * leyendo data-deadline para recalcular el texto.
   */
  actualizarContadores: () => {
    // Actualiza los contadores dentro de cada tarea
    document.querySelectorAll('.task-countdown').forEach((elemento) => {
      const deadline = elemento.dataset.deadline;
      elemento.textContent = deadline
        ? `Vence en: ${UI.calcularTiempoRestante(deadline)}`
        : 'Sin fecha límite';
    });

    // Actualiza la sección lateral de vencimientos
    document.querySelectorAll('.tf-countdown-item__timer').forEach((elemento) => {
      const deadline = elemento.dataset.deadline;
      elemento.textContent = deadline
        ? `Vence en: ${UI.calcularTiempoRestante(deadline)}`
        : 'Sin fecha límite';
    });

    // Refresca resumen y vencimientos con los datos actuales del gestor
    const listaTareas = window.__taskflowGestor?.obtenerActivas?.() ?? [];
    UI.actualizarResumen(listaTareas);
    UI.actualizarVencimientos(listaTareas);
  },

  //  Resumen (stats + progreso)

  /**
   * Calcula estadísticas y actualiza el panel de resumen en el DOM:
   */
  actualizarResumen: (tareas) => {
    const total = tareas.length;
    const completadas = tareas.filter(({ estado }) => estado === 'completada').length;
    const pendientes = total - completadas;
    const progreso = total === 0 ? 0 : Math.round((completadas / total) * 100);

    const totalBadge = document.getElementById('task-total-badge');
    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statDone = document.getElementById('stat-done');
    const progressLabel = document.getElementById('tf-progress-pct');
    const progressBar = document.getElementById('tf-progress-bar');

    if (totalBadge) totalBadge.textContent = `${total} tareas`;
    if (statTotal) statTotal.textContent = total;
    if (statPending) statPending.textContent = pendientes;
    if (statDone) statDone.textContent = completadas;
    if (progressLabel) progressLabel.textContent = `${progreso} %`;
    if (progressBar) progressBar.style.width = `${progreso}%`;
  },

  // ─── Renderizado de tareas ───────────────────────────────────

  /**
   * Crea y agrega un elemento <li> al DOM para representar una tarea individual.
   * Genera: checkbox, texto, metadatos, countdown, y botones (Completar, Editar, Eliminar).
   * Cada botón usa data-action para la delegación de eventos en el controller.
   */
  renderizarTarea: (tarea) => {
    const li = document.createElement('li');
    li.dataset.id = tarea.id;
    li.className = 'tf-task-item';

    if (tarea.estado === 'completada') {
      li.classList.add('tf-task-item--done');
    }
    if (UI.esVencida(tarea.fechaLimite) && tarea.estado !== 'completada') {
      li.classList.add('tf-task-item--overdue');
    }

    // Checkbox — checked según estado, data-action='toggle' para delegación
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'tf-task-check';
    checkbox.checked = tarea.estado === 'completada';
    checkbox.dataset.action = 'toggle';

    // Contenido: descripción + metadatos + countdown
    const content = document.createElement('div');
    content.className = 'tf-task-body';

    const span = document.createElement('div');
    span.className = 'tf-task-text';
    span.textContent = tarea.descripcion;

    const info = document.createElement('small');
    info.className = 'tf-task-meta d-block';
    const fechaCreacion = new Date(tarea.fechaCreacion).toLocaleString();
    const fechaLimite = tarea.fechaLimite
      ? new Date(tarea.fechaLimite).toLocaleString()
      : 'Sin fecha límite';
    info.textContent = `Creada: ${fechaCreacion} | Límite: ${fechaLimite}`;

    const countdown = document.createElement('small');
    countdown.className = 'task-countdown tf-task-meta d-block';
    countdown.dataset.deadline = tarea.fechaLimite ? new Date(tarea.fechaLimite).toISOString() : '';
    countdown.textContent = tarea.fechaLimite
      ? `Vence en: ${UI.calcularTiempoRestante(tarea.fechaLimite)}`
      : 'Sin fecha límite';

    content.append(span, info, countdown);

    // Botones de acción — cada uno con data-action para delegación de eventos
    const btnCompletar = document.createElement('button');
    btnCompletar.textContent = tarea.estado === 'completada' ? 'Reabrir' : 'Completar';
    btnCompletar.className = 'tf-icon-btn';
    btnCompletar.dataset.action = 'toggle';

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'tf-icon-btn';
    btnEditar.dataset.action = 'edit';

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'tf-icon-btn tf-icon-btn--danger';
    btnEliminar.dataset.action = 'delete';

    const actions = document.createElement('div');
    actions.className = 'tf-task-actions';
    actions.append(btnCompletar, btnEditar, btnEliminar);

    // Ensamblar el <li> y agregarlo a la lista
    li.append(checkbox, content, actions);
    document.getElementById('task-list').appendChild(li);
  },

  /**
   * Renderiza toda la lista de tareas, limpiando el contenido previo.
   * Muestra un máximo de MAX_TAREAS_LISTADAS (las más recientes).
   * Si no hay tareas, muestra un mensaje vacío personalizable.
   * También actualiza el resumen estadístico y la sección de vencimientos.
   */
  renderizarTodas: (
    tareas,
    mensajeVacio = 'No hay tareas activas. Agrega una nueva para comenzar.'
  ) => {
    const lista = document.getElementById('task-list');
    if (!lista) return;
    lista.innerHTML = '';

    const tareasVisibles = tareas.slice(-UI.MAX_TAREAS_LISTADAS);

    if (tareasVisibles.length === 0) {
      const vacio = document.createElement('li');
      vacio.className = 'tf-task-list--empty';
      vacio.textContent = mensajeVacio;
      lista.appendChild(vacio);
      UI.actualizarResumen(tareas);
      UI.actualizarVencimientos(tareas);
      return;
    }

    tareasVisibles.forEach((tarea) => UI.renderizarTarea(tarea));
    UI.actualizarResumen(tareas);
    UI.actualizarVencimientos(tareas);
  },

  // ─── Sección lateral de vencimientos ─────────────────────────

  /**
   * Actualiza la sección lateral "Próximos vencimientos" en el sidebar.
   * Filtra tareas con fecha límite pendiente, las ordena por fecha ascendente,
   * y muestra las 5 más próximas con su countdown. Marca las urgentes en rojo.
   */
  actualizarVencimientos: (tareas) => {
    const contenedor = document.getElementById('tf-countdowns');
    if (!contenedor) return;

    const conFechaLimite = tareas.filter(
      ({ fechaLimite, estado }) => fechaLimite && estado !== 'completada'
    );
    contenedor.innerHTML = '';

    if (conFechaLimite.length === 0) {
      const vacio = document.createElement('li');
      vacio.className = 'tf-countdown-empty';
      vacio.textContent = 'Sin tareas con fecha límite.';
      contenedor.appendChild(vacio);
      return;
    }

    conFechaLimite
      .slice()
      .sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite))
      .slice(0, 5)
      .forEach((tarea) => {
        const item = document.createElement('li');
        item.className = `tf-countdown-item${
          UI.esVencida(tarea.fechaLimite) ? ' tf-countdown-item--urgent' : ''
        }`;

        const nombre = document.createElement('div');
        nombre.className = 'tf-countdown-item__name';
        nombre.textContent = tarea.descripcion;

        const timer = document.createElement('div');
        timer.className = 'tf-countdown-item__timer';
        timer.dataset.deadline = new Date(tarea.fechaLimite).toISOString();
        timer.textContent = `Vence en: ${UI.calcularTiempoRestante(tarea.fechaLimite)}`;

        item.append(nombre, timer);
        contenedor.appendChild(item);
      });
  },
};

window.UI = UI;
