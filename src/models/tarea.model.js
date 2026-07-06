// Clase Tarea
class Tarea {
  constructor(id, descripcion, estado, fechaCreacion) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = new Date();
    this.eliminada = false;
  }

  // Cambia el estado de la tarea validando que sea un valor permitido.
  cambiarEstado(nuevoEstado) {
    const estadosValidos = ['pendiente', 'en proceso', 'completada'];
    if (!estadosValidos.includes(nuevoEstado))
      throw new Error(`Estado no válido "${nuevoEstado}". Use: ${estadosValidos.join(', ')}`); // Lanza error si el estado no existe.
    this.estado = nuevoEstado; // Asigna el nuevo estado.
  }

  // Marca la tarea como eliminada.
  eliminar() {
    this.eliminada = true; // Asigna el flag de eliminada.
  }

  // Retorna un resumen legible de la tarea.
  toString() {
    // prettier-ignore
    return `[${this.id}] ${this.descripcion} - Estado: ${this.estado} | Creada: ${this.fechaCreacion.toLocaleDateString()}`; // Formato legible para consola.
  }
}

// Clase GestorTareas
class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  // Uso de REST operator (...nuevasTareas) para aceptar un número indefinido de tareas.
  agregarTareas = (...nuevasTareas) => {
    // Uso de SPREAD operator (...) para combinar los arreglos sin mutar el original.
    this.tareas = [...this.tareas, ...nuevasTareas];
  };

  // Uso de DESTRUCTURING ({ id }) directamente en los parámetros del callback.
  eliminarTarea = (idEliminar) => {
    this.tareas = this.tareas.filter(({ id }) => id !== idEliminar);
  };
  actualizarEstadoTarea = (idBuscado, nuevoEstado) => {
    const tarea = this.tareas.find(({ id }) => id === idBuscado);
    if (tarea) {
      tarea.cambiarEstado(nuevoEstado);
    } else {
      console.warn(`Tarea con ID ${idBuscado} no encontrada`);
    }
  };

  mostrarResumen = () => {
    console.log('--- Resumen de Tareas ---');
    this.tareas.forEach((tarea) => {
      // Uso de DESTRUCTURING para extraer las propiedades de la tarea.
      const { id, descripcion, estado } = tarea;
      console.log(`[ID: ${id}] ${descripcion} | Estado: ${estado}`);
    });
    console.log('-----------------------------------------\n');
  };
}

module.exports = { Tarea, GestorTareas };
