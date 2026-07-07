const inicializarEventos = (gestor, clave) => {
  document.getElementById(`task-form`).addEventListener(`submit`, (e) => {
    e.preventDefault();
  });
  const descripcion = document.getElementById(`task-input`).value.trim();
  if (!descripcion) return;
  const tarea = gestor.agregarTarea(descripcion);
  UI.renderizarTarea(tarea);
};
