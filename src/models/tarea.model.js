// Clase Tarea
class Tarea {
  constructor(id, descripcion, estado = 'pendiente', fechaCreacion = null) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion ? new Date(fechaCreacion) : new Date();
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

  // Crea una nueva tarea a partir de una descripción y la agrega al gestor.
  // Genera un ID único automáticamente con Date.now().
  agregarTarea = (descripcion) => {
    const id = Date.now();
    const tarea = new Tarea(id, descripcion);
    this.tareas.push(tarea);
    return tarea;
  };

  // Uso de REST operator (...nuevasTareas) para aceptar un número indefinido de tareas.
  agregarTareas = (...nuevasTareas) => {
    // Uso de SPREAD operator (...) para combinar los arreglos sin mutar el original.
    this.tareas = [...this.tareas, ...nuevasTareas];
  };

  // Uso de DESTRUCTURING ({ id }) directamente en los parámetros del callback.
  eliminarTarea = (idEliminar) => {
    this.tareas = this.tareas.filter(({ id }) => id !== idEliminar);
  };

  // Retorna las tareas que no han sido marcadas como eliminadas.
  obtenerActivas = () => {
    return this.tareas.filter((tarea) => !tarea.eliminada);
  };

  // Cambia el estado de una tarea por su ID.
  cambiarEstadoTarea = (idBuscado, nuevoEstado) => {
    const tarea = this.tareas.find(({ id }) => id === idBuscado);
    if (tarea) {
      tarea.cambiarEstado(nuevoEstado);
    } else {
      console.warn(`Tarea con ID ${idBuscado} no encontrada`);
    }
  };

  // Carga tareas desde datos planos (localStorage) reconstruyendo instancias de Tarea.
  cargarTareas = (datos) => {
    this.tareas = datos.map(
      (t) => new Tarea(t.id, t.descripcion, t.estado, t.fechaCreacion)
    );
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
