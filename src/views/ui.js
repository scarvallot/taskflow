// views/ui.js
const UI = {
  renderizarTarea: (tarea) => {
    const li = document.createElement('li');
    li.dataset.id = tarea.id;
    li.className = tarea.estado === 'completada' ? 'completada' : '';

    const span = document.createElement('span');
    span.textContent = tarea.descripcion;

    const btnCompletar = document.createElement('button');
    btnCompletar.textContent = tarea.estado === 'completada' ? 'Reabrir' : 'Completar';
    btnCompletar.className = 'btn-completar';

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';

    li.append(span, btnCompletar, btnEliminar);
    document.getElementById('task-list').appendChild(li);
  },

  renderizarTodas: (tareas) => {
    const lista = document.getElementById('task-list');
    if (!lista) {
      console.error('No se encontró el elemento task-list');
      return;
    }
    lista.innerHTML = '';
    tareas.forEach((tarea) => UI.renderizarTarea(tarea));
  },

  limpiarInput: () => {
    const input = document.getElementById('task-input');
    if (input) input.value = '';
  },
};
