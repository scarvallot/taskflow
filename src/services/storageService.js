/**
 *   Servicio de persistencia local usando localStorage del navegador.
 *   Permite guardar, cargar y limpiar datos serializados como JSON
 *   bajo una clave específica.
 */
const StorageService = {
  /**
   * Serializa los datos a JSON y los guarda en localStorage.
   */
  guardar: (clave, datos) => {
    localStorage.setItem(clave, JSON.stringify(datos));
  },
  /**
   * Lee y deserializa los datos desde localStorage.
   */
  cargar: (clave) => {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
  },

  /**
   * Elimina una clave completa de localStorage.
   * Útil para reiniciar el estado de la aplicación.
   */
  limpiar: (clave) => {
    localStorage.removeItem(clave);
  },
};
