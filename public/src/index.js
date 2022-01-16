const socket = io();
let idCarrito ="";

function mainLogin(){
    const url = '/login';
    /* Funcion fetch para saber si esta logeado */
    const options = {
        method: "GET"
    }
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if (data) {
            let x = document.getElementById("usuarioLogin");
            x.innerHTML = `${data.user}` 
            let y = document.getElementById("usuarioAvatar") 
            y.innerHTML = `<img src = './avatars/${data.avatar}' width="40"height="40" style="border-radius: 20px;"></img>`
            idCarrito = `${data.carrito}`
        }else{
            window.location.href = "login.html";
        }
    })
    .catch(function(error) {
        console.log(error);
      });

}

socket.on("render", (data)=>{
    const url = '/login';
    const options = {
        method: "GET"
    }
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if (data) { 
            idCarrito = `${data.carrito}`
            mainLogin();
            renderTabla();
            renderCarrito();
        }else{
            window.location.href = "login.html";
        }
    })
    .catch(function(error) {
        console.log(error);
      });

/*     mainLogin();
    renderTabla();
    renderCarrito(); */
})

function mostrarFormulario(){
    //Funcion para mostrar/ocultar el formulario para agergar productos
    var x = document.getElementById("formularioPtos");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function renderTabla(){
    const tabla = document.getElementById('tBody');
    const url = '/api/productos';

    /* Funcion fetch para traerme todos los productos mediante GET */
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        /* Todo OK borro el contenido viejo de la tabla y escribo el nuevo */
        tabla.innerHTML="";
        for (const pto of data) {
            let fila = document.createElement('tr');
            let aux1 = document.createElement('td');
            aux1.innerHTML = `${pto.nombre}`;
            let aux2 = document.createElement('td');
            aux2.innerHTML = `${pto.descripcion}`;
            let aux3 = document.createElement('td');
            aux3.innerHTML = `$ ${pto.precio}`;
            let aux4 = document.createElement('td');
            aux4.innerHTML = `<img src = ${pto.thumbail} width="40"height="40">`;
            let aux5 = document.createElement('td');
            aux5.innerHTML = `${pto.stock}`;
            let aux6 = document.createElement('td');
            aux6.innerHTML = `<a href="javascript:agregarPtoCarrito('${pto.id}')" class="btn btn-success">✓</a>`;
            let aux7 = document.createElement('td');
            aux7.innerHTML = `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-id="${pto.id}">✎</button>`
            let aux8 = document.createElement('td');
            aux8.innerHTML =`<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-bs-id="${pto.id}">X</button>`
            fila.appendChild(aux1);
            fila.appendChild(aux2);
            fila.appendChild(aux3);
            fila.appendChild(aux4);
            fila.appendChild(aux5);
            fila.appendChild(aux6);
            fila.appendChild(aux7);
            fila.appendChild(aux8);
            tabla.appendChild(fila);
        }
      
    })
    .catch(function(error) {
      console.log(error);
    });
    return false;
}

function renderCarrito(){
    const tabla = document.getElementById('tBodyCarrito');
    const url = `/api/carrito/${idCarrito}`

    /* Funcion fetch para traerme el historial de chat mediante GET */
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        /* Todo OK borro el contenido viejo de la tabla y escribo el nuevo */
        tabla.innerHTML="";
        for (const pto of data) {
            let fila = document.createElement('tr');
            let aux1 = document.createElement('td');
            aux1.innerHTML = `${pto.nombre}`;
            let aux2 = document.createElement('td');
            aux2.innerHTML = `${pto.descripcion}`;
            let aux3 = document.createElement('td');
            aux3.innerHTML = `$ ${pto.precio}`;
            let aux4 = document.createElement('td');
            aux4.innerHTML = `<img src = ${pto.thumbail} width="40"height="40">`;
            let aux5 = document.createElement('td');
            aux5.innerHTML = `<a href="javascript:borrarPtoCarrito('${pto.id}')" class="btn btn-danger">X</a>`;
            fila.appendChild(aux1);
            fila.appendChild(aux2);
            fila.appendChild(aux3);
            fila.appendChild(aux4);
            fila.appendChild(aux5);
            tabla.appendChild(fila);
        }
        
    })
    .catch(function(error) {
      console.log(error);
    });
    return false;
}

function agregarPto(){
    /* Armando request para la funcion fetch */
    const url = '/api/productos'; //En la url agrego la variable admin a ser configurada mas adelante mediante login

    /*Creo un objeto con los datos del formulario*/
    let data = {
        nombre: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value,
        codigo: document.getElementById('codigo').value,
        thumbail: document.getElementById('thumbail').value,
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value
    }  
    
    let request = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
          }
    }
    /* Funcion fetch para añadir un nuevo producto mediante POST */
    fetch(url, request)
    .then(function() {
        /* Todo OK renderizo la tabla para todos los clientes conectados*/
        socket.emit("actualizacion");
        mostrarFormulario();
    });

    return false;
}

function agregarPtoCarrito(id){
    const url = `/api/carrito/${idCarrito}/${id}`
    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          }
    }
    fetch(url, request)
    .then(function() {
        /* Todo OK renderizo la tabla para todos los clientes conectados y borro la info de los input */
        socket.emit("actualizacion");
    });
}

function borrarPtoCarrito(id) {
    /* Armando request para la funcion fetch */
    //const url = '/api/carrito/61df67b71e0b815b14f3d9d2/'+id;
    const url = `/api/carrito/${idCarrito}/${id}`
    let request = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          }
    }

    /* Funcion fetch para borrar el producto del carrito mediante DELETE */
    fetch(url, request)
    .then(function() {
        /* Todo OK renderizo la tabla para todos los clientes conectados*/
        socket.emit("actualizacion");
    });
}

function editarProducto() {
    /* Me fijo el id del pto*/
    let inId = document.getElementById('idM').value;
    console.log(inId);
    /* Armando request para la funcion fetch */
    const url = `/api/productos/${inId}`; //En la url agrego la variable admin a ser configurada mas adelante mediante login
    console.log(url)
    let data = {
        nombre: document.getElementById('tituloM').value,
        descripcion: document.getElementById('descripcionM').value,
        codigo: document.getElementById('codigoM').value,
        thumbail: document.getElementById('thumbailM').value,
        precio: document.getElementById('precioM').value,
        stock: document.getElementById('stockM').value
    }  
        
    let request = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
            }
    }
    /* Funcion fetch para modificar el producto mediante PUT */
    fetch(url, request)
    .then(function() {
        /* Todo OK renderizo la tabla para todos los clientes conectados*/
        socket.emit("actualizacion");
    });
  
    return false;
    
}

function borrarProducto() {
    /* Me fijo el id del pto*/
    let inId = document.getElementById('idMB').value;
    /* Armando request para la funcion fetch */
    const url = `/api/productos/${inId}`; 
        
    let request = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
            }
    }
    /* Funcion fetch para eliminar el producto mediante DELETE */
    fetch(url, request)
    .then(function() {
        /* Todo OK renderizo la tabla para todos los clientes conectados*/
        socket.emit("actualizacion");
    });
  
    return false;
}

function cashout(){
    const url = `/api/ordenes/${idCarrito}`;
    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          }
    }
    fetch(url, request)
    .then(function() {
        alert("GRACIAS POR SU COMPRA VA A RECIBIR UN MENSAJE DE CONFIRMACION");
        window.location.href = "index.html"
    });
}

function logout(){
    const url = '/api/login';
    //Funcion fetch para saber si esta logeado
    const options = {
        method: "GET"
    }
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if (data) {
            console.log(data)
            let x = document.getElementById("logout");
            x.innerHTML = "Hasta luego "+data.user
            setTimeout(function(){
                window.location.href = "api/logout"
            }, 2000);
            
        }else{
            window.location.href = "login.html";
        }
    })
    .catch(function(error) {
        console.log(error);
      });


}

/* Modal */
let myModal = document.getElementById('exampleModal')
let myModal2 = document.getElementById('exampleModal2')

myModal.addEventListener('shown.bs.modal', function (event) {
  let button = event.relatedTarget;
  // Obtengo el id
  let id = button.getAttribute('data-bs-id');

  let modalBodyInput = exampleModal.querySelector('.modal-body input')
  
  let inId = document.getElementById('idM');
  let inTitulo = document.getElementById('tituloM');
  let inDescripcion = document.getElementById('descripcionM');
  let inCodigo = document.getElementById('codigoM');
  let inThumbail = document.getElementById('thumbailM');
  let inPrecio = document.getElementById('precioM');
  let inStock = document.getElementById('stockM');
  
    /* Armando request para la funcion fetch */
    const url = '/api/productos/'+id;
    let request = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
          }
    }

    /* Funcion fetch para traer los productos mediante GET */
    fetch(url, request)
    .then((resp) => resp.json())
    .then(function(data) {
        /* Todo OK pongo los valores en la tabla para que sea mas facil editarlo*/
        inTitulo.value = (data.nombre);
        inDescripcion.value = (data.descripcion);
        inCodigo.value = (data.codigo);
        inThumbail.value = (data.thumbail);
        inPrecio.value = (data.precio);
        inStock.value = (data.stock);
        inId.value = (id);
    });

})

myModal2.addEventListener('shown.bs.modal', function (event) {
    let button = event.relatedTarget;
    // Obtengo el id
    let id = button.getAttribute('data-bs-id');
  
    let modalBodyInput = exampleModal.querySelector('.modal-body input')
  
    let inId = document.getElementById('idMB');
    
      /* Armando request para la funcion fetch */
      const url = '/api/productos/'+id;
      let request = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
            }
      }
  
      /* Funcion fetch para traer el producto mediante GET */
      fetch(url, request)
      .then((resp) => resp.json())
      .then(function(data) {
          /* Todo OK dejo el id cargado*/
          inId.value = (data.id);
      });
  
  })