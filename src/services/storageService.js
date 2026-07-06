// services/storageService.js
const StorageService = {
  // Guarda cualquier dato en localStorage bajo una clave
  guardar: (clave, datos) => {
    localStorage.setItem(clave, JSON.stringify(datos));
  },

  // Carga los datos desde localStorage, devuelve un array vacío si no hay nada
  cargar: (clave) => {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
  },

  // Elimina todos los datos de una clave (útil para reiniciar)
  limpiar: (clave) => {
    localStorage.removeItem(clave);
  },
};
