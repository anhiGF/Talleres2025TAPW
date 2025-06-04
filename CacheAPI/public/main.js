console.log('JavaScript cargado correctamente');

// Mensaje en consola cuando la app está offline
window.addEventListener('offline', () => {
    console.log('La aplicación está funcionando en modo offline');
});

// Mensaje en consola cuando la app vuelve online
window.addEventListener('online', () => {
    console.log('La aplicación ha recuperado la conexión');
});