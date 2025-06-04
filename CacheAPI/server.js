const express = require('express');
const app = express();
const PORT = 3002;

// Configurar middleware
app.use(express.static('public'));
app.use(express.static('views'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});