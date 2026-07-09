/**
 *   Clase que administra la colección de tareas de la aplicación.
 *   Actúa como "repositorio en memoria": crea, busca, elimina, cambia estado
 *   de las tareas desde localStorage.
 */
class GestorTareas {
  constructor() {
    //Lista interna de todas las tareas (incluidas eliminadas)
    this.tareas = [];
  }

  /**
   * Crea una tarea nueva con ID único (timestamp) y la agrega al array.
   */
  agregarTarea(descripcion) {
    const id = Date.now();
    const tarea = new Tarea(id, descripcion);
    this.tareas.push(tarea);
    return tarea;
  }

  /**
   * Agrega múltiples tareas existentes al array usando rest/spread.
   * Se usa al cargar tareas desde la API.
   */
  agregarTareas(...nuevasTareas) {
    this.tareas = [...this.tareas, ...nuevasTareas];
  }

  /**
   * Busca una tarea por su ID usando destructuring en el callback de find().
   */
  obtenerTareaPorId(idBuscado) {
    return this.tareas.find(({ id }) => id === idBuscado);
  }

  /**
   * Marca una tarea como eliminada (soft delete).
   * La tarea sigue en el array pero no aparece en obtenerActivas().
   */
  eliminarTarea(idEliminar) {
    const tarea = this.obtenerTareaPorId(idEliminar);
    if (tarea) tarea.eliminar();
  }

  /**
   * Filtra y devuelve solo las tareas que no están eliminadas.
   */
  obtenerActivas() {
    return this.tareas.filter((tarea) => !tarea.eliminada);
  }

  /**
   * Cambia el estado de una tarea específica delegando a Tarea.cambiarEstado().
   * Si no encuentra la tarea, emite un warning en consola.
   */
  cambiarEstadoTarea(idBuscado, nuevoEstado) {
    const tarea = this.obtenerTareaPorId(idBuscado);
    if (tarea) {
      tarea.cambiarEstado(nuevoEstado);
    } else {
      console.warn(`Tarea con ID ${idBuscado} no encontrada`);
    }
  }

  /**
   * Convierte objetos planos (JSON) en instancias de la clase Tarea,
   * restaurando propiedades como eliminada y fechaLimite.
   */
  cargarTareas(datos) {
    this.tareas = datos.map((t) => {
      const tarea = new Tarea(t.id, t.descripcion, t.estado, t.fechaCreacion);
      tarea.eliminada = Boolean(t.eliminada);
      tarea.establecerFechaLimite(t.fechaLimite);
      return tarea;
    });
  }
}

window.GestorTareas = GestorTareas;
