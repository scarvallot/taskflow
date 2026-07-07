/*
 *   views/ui.js
 *   Este módulo contiene las funciones que manipulan el DOM para mostrar las tareas.
 *   Es la capa de VISTA en nuestra arquitectura MVC.
 *   Solo sabe cómo dibujar, no tiene lógica de negocio ni accede directamente a los datos.
 */
const UI = {
  /**
   * renderizarTarea: crea los elementos HTML para una tarea y los agrega a la lista.
   * @param {Object} tarea - Objeto con las propiedades id, descripcion, estado, etc.
   */
  renderizarTarea: (tarea) => {
    // 1. Crear el elemento <li> que representará la tarea
    const li = document.createElement('li');
    // Guardamos el id de la tarea en un atributo data-* para poder identificarla después
    li.dataset.id = tarea.id;
    // Añadimos una clase CSS si la tarea está completada (para estilo visual)
    li.className = tarea.estado === 'completada' ? 'completada' : '';

    // 2. Crear un <span> con la descripción de la tarea
    const span = document.createElement('span');
    span.textContent = tarea.descripcion; // textContent es seguro (no interpreta HTML)

    // 3. Crear el botón para completar/reabrir la tarea
    const btnCompletar = document.createElement('button');
    // El texto cambia según el estado actual de la tarea
    btnCompletar.textContent = tarea.estado === 'completada' ? 'Reabrir' : 'Completar';
    btnCompletar.className = 'btn-completar'; // clase para estilos y para identificar el botón en eventos

    // 4. Crear el botón para eliminar la tarea
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.className = 'btn-eliminar';

    // 5. Ensamblar los elementos dentro del <li>
    li.appendChild(span);
    li.appendChild(btnCompletar);
    li.appendChild(btnEliminar);

    // 6. Agregar el <li> a la lista <ul> que existe en el HTML
    document.getElementById('task-list').appendChild(li);
  },

  /**
   * renderizarTodas: limpia la lista y vuelve a dibujar todas las tareas.
   * @param {Array} tareas - Array de objetos tarea.
   */
  renderizarTodas: (tareas) => {
    // Limpiamos el contenido actual de la lista (elimina todos los hijos)
    document.getElementById('task-list').innerHTML = '';
    // Recorremos el array y llamamos a renderizarTarea por cada una
    tareas.forEach((tarea) => UI.renderizarTarea(tarea));
  },

  /**
   * limpiarInput: vacía el campo de texto del formulario.
   * Se llama después de agregar una tarea para mejorar la experiencia de usuario.
   */
  limpiarInput: () => {
    document.getElementById('task-input').value = '';
  },
};
