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