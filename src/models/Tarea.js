/**
 *   Modelo que representa una tarea individual dentro de la aplicación.
 *   Encapsula los datos de la tarea (descripción, estado, fechas) y expone
 *   métodos para cambiar su estado, eliminarla o asignarle una fecha límite.
 */
class Tarea {
  constructor(id, descripcion, estado = 'pendiente', fechaCreacion = null) {
    this.id = id; //    Identificador único (timestamp).
    this.descripcion = descripcion; //  Texto descriptivo de la tarea.
    this.estado = estado; //  Estado inicial: `pendiente` | `en proceso` | `completada`
    this.fechaCreacion = fechaCreacion ? new Date(fechaCreacion) : new Date();
    this.eliminada = false;
    this.fechaLimite = null;
  }

  /**
   * Cambia el estado de la tarea validando que sea un valor permitido.
   * Lanza un Error si el estado no es válido.
   */
  cambiarEstado(nuevoEstado) {
    const estadosValidos = ['pendiente', 'en proceso', 'completada'];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado no válido "${nuevoEstado}". Use: ${estadosValidos.join(', ')}`);
    }
    this.estado = nuevoEstado;
  }

  /**
   * Marca la tarea como eliminada (soft delete).
   * No se borra del array, solo se oculta en la vista con `obtenerActivas()`.
   */
  eliminar() {
    this.eliminada = true;
  }

  /**
   * Asigna o quita una fecha límite a la tarea.
   */
  establecerFechaLimite(fechaLimite) {
    this.fechaLimite = fechaLimite ? new Date(fechaLimite) : null;
  }
}

window.Tarea = Tarea;
