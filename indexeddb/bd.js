var bd;
var listaContactos;
function iniciarBD() {
    var formulariobusqueda=document.querySelector('#formulariobusqueda');
    formulariobusqueda.addEventListener('submit',buscarcontacto);

    listaContactos=document.querySelector('.caja-contacto');
    var btnGuardar=document.querySelector('#btn-guardar');
    btnGuardar.addEventListener('click',guardarcontacto);

    var req= indexedDB.open('midb');
    req.addEventListener('error',mostrarError);
    req.addEventListener('success',comenzar);
    req.addEventListener('upgradeneeded',crearAlamacen);

}

function mostrarError(evento) {
    alert('error'+ evento.error+ "-"+evento.mensage);
}

function comenzar(evento) {
    bd=evento.target.result;
    mostrar();
}

function crearAlamacen(evento) {
    var basededatos=evento.target.result;
    var almacen = basededatos.createObjectSotre('contacto',{keyPath:'id'});
    almacen.createIndex('buscarnombre','nombre',{unique:'id'});
}

function guardarcontacto() {
    var n= document.querySelector('#nombre').value;
    var i= document.querySelector('#id').value;
    var e= document.querySelector('#edad').value;

    var transaccion = bd.transtraction(['contacto'],'readwrite');
    var almacen = transaccion.objectSotre();
    transaccion.addEventListener('complete',mostrar);
    almacen.add({
        nombre: n,
        id:i,
        edad:e
    });
    
    document.querySelector('#nombre').value="";
    document.querySelector('#id').value="";
    document.querySelector('#edad').value="";

}
 function mostrar() {
    listaContactos.innerHTML="";
    var transaccion=bd.transaccion(['contactos']);
    var almacen = transaccion.objectSotre('contactos');

    var indice =almacen.oponeCursor();
    indice.addEventListener('susses',mostrarcontactos);
 }

 function mostrarcontactos(evento) {
    var indice = evento.target.result;
    if (indice) {
        listaContactos.innerHTML+="<div>"+ indice.value.nombre+"|"+indice.value.id+"|"+indice.value.edad+
        "<input type='button' class='btn-editar' value='editar' onclick='selecionarcontacto(\""+indice.value.id+"\"'>"+
"<input type='button' class='btn-eliminar' value='eliminar' onclick='selecionarcontacto(\""+indice.value.id+"\"'>"+
"</div>";

        indice.continue();
    }
 }

 function selecionarcontacto(key) {
    var transaccion=bd.transaccion(['contactos'],'readWrite');
    var almacen= transaccion.objectSotre('contactos');
    var solisitud = almacen.get(key);
    document.querySelector('#id').readOnly = true;
    solisitud.addEventListener('susses',function(){
        document.querySelector('#nombre').value=solisitud.result.nombre;
        document.querySelector('#id').value=solisitud.result.id;
        document.querySelector('#edad').value=solisitud.result.edad;
    });

    var botonedit = document.querySelector('.botonedit');
    botonedit.innerHTML='<input type="button" name="" class="actualizar"  value="editar" onclick="actualizarContacto()">';

 }

 function actualizarContacto() {
    var n= document.querySelector('#nombre').value;
    var i= document.querySelector('#nombre').value;
    var e= document.querySelector('#nombre').value;

    var transaccion = bd.transtraction(['contacto'],'readwrite');
    var almacen = transaccion.ObjectSotre();
    transaccion.addEventListener('complete',mostrar);
    almacen.put({
        nombre: n,
        id:i,
        edad:e
    });
    document.querySelector('#nombre').value="";
    document.querySelector('#id').value="";
    document.querySelector('#edad').value="";

    var botonedit= document.querySelector('.botonedit');
    botonedit.innerHTML='<input type="button" name="" id="btn-guardar" value="btn-guardar" class="Guardar" onclick="guardarContacto()">';

 }

 function guardarContacto(evento) {
    evento.preventDefault();
    document.querySelector('.resultadobusqueda').innerHTML = "";

    var buscar= document.querySelector('#buscar-nombre').value;

    var transaccion = bd.transaccion(['contactos']);
    var almacen = transaccion.ObjectSotre('contactos');
    var indice = almacen.index('buscarNombre');
    var rango = IDBKeyRange.only(buscar);
    var cursor= indice.oponeCursor(rango);

    cursor.addEventListener('succes',mostrarBusqueda);
 }

 function mostrarBusqueda(evento) {
    var indice = evento.target.result;
    if (indice) {
        listaContactos.innerHTML+="<div>"+ indice.value.nombre+"|"+indice.value.id+"|"+indice.value.edad+
        "<input type='button' class='btn-editar' value='editar' onclick='selecionarcontacto(\""+indice.value.id+"\"'>"+
        "<input type='button' class='btn-eliminar' value='eliminar' onclick='selecionarcontacto(\""+indice.value.id+"\"'>"+
        "</div>";

        indice.continue();

    }  
    document.querySelector('#buscar-nombre').value="";
 }
 function eliminarcontacto(key) {
    var transaccion=bd.transaccion(['contactos'],'readWrite');
    var almacen= transaccion.objectSotre('contactos');
    transaccion.addEventListener('complete',mostrar);
    var solisitud = almacen.delete(key);

 }

 window.addEventListener("load",iniciarBD);

