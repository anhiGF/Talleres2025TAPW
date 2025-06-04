var db;
var listaContactos;
var contactoEditando = null;

window.onload = function() {
    inicializarBD();
};

function inicializarBD() {
    var formularioBusqueda = document.querySelector('#formularioBusqueda');
    formularioBusqueda.addEventListener('submit', buscarContacto);
    listaContactos = document.querySelector('.cajacontacto');
    var btnGuardar = document.querySelector('#botonGuardar');
    btnGuardar.addEventListener('click', guardarContacto);

    var req = indexedDB.open('miDB', 1);
    
    req.onerror = function(event) {
        console.log("Error al abrir la BD", event);
    };
    
    req.onsuccess = function(event) {
        db = event.target.result;
        mostrarContactos();
    };
    
    req.onupgradeneeded = function(event) {
        var basedatos = event.target.result;
        var almacen = basedatos.createObjectStore('contactos', {keyPath: 'id'});
        almacen.createIndex('BuscarNombre', 'nombre', {unique: false});
    };
}

function guardarContacto() {
    var nombre = document.querySelector('#nombre').value;
    var id = document.querySelector('#id').value;
    var email = document.querySelector('#email').value;

    var transaction = db.transaction(['contactos'], 'readwrite');
    var almacen = transaction.objectStore('contactos');

    transaction.oncomplete = function() {
        mostrarContactos();
        document.querySelector('#nombre').value = "";
        document.querySelector('#id').value = "";
        document.querySelector('#email').value = "";
    };

    almacen.put({
        nombre: nombre,
        id: id,
        email: email
    });
}

function mostrarContactos() {
    listaContactos.innerHTML = "";
    var transaction = db.transaction(['contactos'], 'readonly');
    var almacen = transaction.objectStore('contactos');
    var cursor = almacen.openCursor();

    cursor.onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            listaContactos.innerHTML += 
                cursor.value.nombre + ' | ' + 
                cursor.value.id + ' | ' + 
                cursor.value.email + ' | ' +
                '<input type="button" class="botonEdit" value="Editar" onclick="editarContacto(\'' + cursor.value.id + '\')">' +
                '<input type="button" class="botonEdit" value="Borrar" onclick="eliminarContacto(\'' + cursor.value.id + '\')">' +
                '<div><br></div>';
            cursor.continue();
        }
    };
}

function editarContacto(id) {
    var transaction = db.transaction(['contactos'], 'readwrite');
    var almacen = transaction.objectStore('contactos');
    var request = almacen.get(id);

    request.onsuccess = function(event) {
        var contacto = event.target.result;
        document.querySelector('#nombre').value = contacto.nombre;
        document.querySelector('#id').value = contacto.id;
        document.querySelector('#email').value = contacto.email;
        contactoEditando = id;
    };
}

function eliminarContacto(id) {
    var transaction = db.transaction(['contactos'], 'readwrite');
    var almacen = transaction.objectStore('contactos');
    almacen.delete(id);
    transaction.oncomplete = function() {
        mostrarContactos();
    };
}

function buscarContacto(event) {
    event.preventDefault();
    var nombre = document.querySelector('#buscarNombre').value;
    var resultados = document.querySelector('.resultadoBusqueda');
    resultados.innerHTML = "";

    var transaction = db.transaction(['contactos'], 'readonly');
    var almacen = transaction.objectStore('contactos');
    var index = almacen.index('BuscarNombre');
    var request = index.getAll(nombre);

    request.onsuccess = function(event) {
        var contactos = event.target.result;
        contactos.forEach(function(contacto) {
            resultados.innerHTML += 
                contacto.nombre + ' | ' + 
                contacto.id + ' | ' + 
                contacto.email + '<br>';
        });
    };
}