// Cargar el carrito desde localStorage o inicializar uno vacío
let carrito = JSON.parse(localStorage.getItem('carritoArduitronic')) || [];

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    localStorage.setItem('carritoArduitronic', JSON.stringify(carrito));
    alert(nombre + " ha sido agregado al carrito.");
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalElement = document.getElementById('subtotal');
    
    if (!listaCarrito) return; // Salir si no estamos en la página del carrito

    listaCarrito.innerHTML = '';
    let subtotal = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p style="text-align:center;">Tu carrito está vacío.</p>';
        subtotalElement.innerText = '0.00';
        return;
    }

    carrito.forEach((producto, index) => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <span>${producto.nombre}</span> 
            <span>
                $${producto.precio.toFixed(2)} MXN 
                <button class="remove-btn" onclick="eliminarDelCarrito(${index})">X</button>
            </span>
        `;
        listaCarrito.appendChild(item);
        subtotal += producto.precio;
    });

    subtotalElement.innerText = subtotal.toFixed(2);
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carritoArduitronic', JSON.stringify(carrito));
    renderizarCarrito();
}

// Ejecutar al cargar la página (útil para la página del carrito)
document.addEventListener("DOMContentLoaded", renderizarCarrito);

// Función para enviar el pedido por WhatsApp
function procesarPagoPorWhatsApp() {
    // 1. Verificar si el carrito tiene productos
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos del catálogo primero.");
        return;
    }

    // 2. Obtener el nombre del cliente
    const nombreCliente = document.getElementById('nombreCliente').value.trim();
    if (nombreCliente === "") {
        alert("Por favor, ingresa tu nombre para identificar tu pedido.");
        return;
    }

    // 3. Armar el mensaje para WhatsApp
    let mensaje = `Hola Arduitronic, soy ${nombreCliente}. Me gustaría apartar el siguiente material escolar:\n\n`;
    let subtotal = 0;

    carrito.forEach((producto) => {
        mensaje += `- 1x ${producto.nombre} ($${producto.precio.toFixed(2)})\n`;
        subtotal += producto.precio;
    });

    mensaje += `\n*Total a pagar en tienda: $${subtotal.toFixed(2)} MXN*\n\n`;
    mensaje += `Paso a recogerlo en un momento. ¡Gracias!`;

    // 4. Codificar el mensaje para formato URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // 5. Número de teléfono de Arduitronic (incluyendo el +52 de México)
    const telefonoArduitronic = "525535692446"; 

    // 6. Crear la URL de la API de WhatsApp y abrirla en una nueva pestaña
    const urlWhatsApp = `https://wa.me/${telefonoArduitronic}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
}
