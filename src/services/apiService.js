/**
 *   Servicio de consumo de API externa. Realiza peticiones HTTP con fetch()
 *   a JSONPlaceholder para obtener tareas de ejemplo. Si la petición falla,
 *   devuelve un array de respaldo local.
 */
const ApiService = {
  /**
   * Carga tareas de ejemplo desde la API JSONPlaceholder.
   * Transforma cada item del endpoint /todos en una instancia de Tarea.
   * Si la red falla o la API responde con error, devuelve un fallback local.
   */
  cargarTareasSugeridas: async (limite = 3) => {
    try {
      const respuesta = await fetch(`https://jsonplaceholder.typicode.com/todos?_limit=${limite}`);

      if (!respuesta.ok) {
        throw new Error(`Error al consumir la API: ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      // Transforma cada item de la API en una instancia de Tarea
      return datos.map((item) => {
        return new Tarea(
          Date.now() + item.id,
          item.title,
          item.completed ? 'completada' : 'pendiente'
        );
      });
    } catch (error) {
      console.warn('No se pudo cargar la API, se usarán tareas de respaldo.', error);

      // Fallback: tareas locales de ejemplo si la API no responde
      return [
        new Tarea(Date.now() + 1, 'Crear una tarea desde el formulario', 'pendiente'),
        new Tarea(Date.now() + 2, 'Completar una tarea con un clic', 'pendiente'),
        new Tarea(Date.now() + 3, 'Cargar tareas desde la API', 'pendiente'),
      ];
    }
  },
};
