// ==========================================
// 1. BASE DE DATOS SIMULADA (LOCALSTORAGE)
// ==========================================
const defaultProducts = [
    { id: 'ARD005', nombre: 'Arduino UNO R3 con cable', categoria: 'Tarjetas de Desarrollo', precio: 170.00, stock: 15, desc: 'Microcontrolador ATmega328, alimentación de 7~12V.' },
    { id: 'ARD002', nombre: 'Arduino Mega con cable', categoria: 'Tarjetas de Desarrollo', precio: 280.00, stock: 8, desc: 'Atmega2560, 54 pines digitales.' },
    { id: 'ARD006', nombre: 'Arduino Nano sin cable', categoria: 'Tarjetas de Desarrollo', precio: 90.00, stock: 20, desc: 'Atmega328P. 14 pines de entrada/salida.' },
    { id: 'MOD012', nombre: 'ESP32 Wifi + Bluetooth', categoria: 'Tarjetas de Desarrollo', precio: 220.00, stock: 12, desc: 'SoC doble núcleo a 160MHz. Módulo MH-ET.' },
    
    { id: 'SEN035', nombre: 'Sensor Ultrasónico HC-SR04', categoria: 'Sensores', precio: 35.00, stock: 50, desc: 'Detecta objetos de 2 a 450 cm.' },
    { id: 'SEN025', nombre: 'Sensor de Movimiento PIR', categoria: 'Sensores', precio: 35.00, stock: 30, desc: 'Distancia máxima de 6 metros.' },
    { id: 'CMP006', nombre: 'Sensor de Temperatura LM35', categoria: 'Sensores', precio: 28.00, stock: 40, desc: 'Rango de -55 °C hasta 150 °C.' },
    { id: 'SEN054', nombre: 'Sensor DHT22 Temp/Humedad', categoria: 'Sensores', precio: 120.00, stock: 15, desc: 'Precisión de -40~80°C.' },
    
    { id: 'MOD002', nombre: 'Módulo Bluetooth HC-05', categoria: 'Módulos y Pantallas', precio: 120.00, stock: 25, desc: 'Maestro/esclavo V2.0+EDR.' },
    { id: 'MOD007', nombre: 'Módulo 4 Relevadores', categoria: 'Módulos y Pantallas', precio: 90.00, stock: 10, desc: 'Soporta 250 VAC a 10 A.' },
    { id: 'PAN005', nombre: 'Pantalla OLED 0.96"', categoria: 'Módulos y Pantallas', precio: 130.00, stock: 18, desc: 'Resolución 128x64 pixeles I2C.' },
    { id: 'PAN00X', nombre: 'Display LCD 16x2 I2C', categoria: 'Módulos y Pantallas', precio: 90.00, stock: 22, desc: 'Control LCD con solo 2 cables.' },

    { id: 'ELC001', nombre: 'Multímetro Digital', categoria: 'Herramientas y Prototipado', precio: 130.00, stock: 5, desc: 'Voltaje, corriente y resistencia.' },
    { id: 'PRO003', nombre: 'Protoboard 830 Puntos', categoria: 'Herramientas y Prototipado', precio: 75.00, stock: 35, desc: 'Desarrollo de sistemas digitales.' },
    { id: 'CABXXX', nombre: 'Cables Dupont 20cm (40pz)', categoria: 'Herramientas y Prototipado', precio: 45.00, stock: 100, desc: 'M-M, M-H, H-H.' },
    { id: 'KIT016', nombre: 'Kit Arduino Deluxe', categoria: 'Herramientas y Prototipado', precio: 1000.00, stock: 3, desc: 'Incluye sensores, motores y componentes.' }
];

if (!localStorage.getItem('dbProductos')) { localStorage.setItem('dbProductos', JSON.stringify(defaultProducts)); }
if (!localStorage.getItem('dbCarrito')) { localStorage.setItem('dbCarrito', JSON.stringify([])); }
if (!localStorage.getItem('dbVentas')) { localStorage.setItem('dbVentas', JSON.stringify([])); }

// ==========================================
// 2. MODO OSCURO
// ==========================================
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('arduitronic-theme', isDark ? 'dark' : 'light');
}

function initTheme() {
    const savedTheme = localStorage.getItem('arduitronic-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// ==========================================
// 3. UTILIDADES (TOASTS)
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// 4. LÓGICA DE LA TIENDA
// ==========================================
function renderizarCatalogo() {
    const contenedor = document.getElementById('catalogo-dinamico');
    if (!contenedor) return;

    const productos = JSON.parse(localStorage.getItem('dbProductos'));
    contenedor.innerHTML = '';
    const categorias = [...new Set(productos.map(p => p.categoria))];

    categorias.forEach(cat => {
        const catProds = productos.filter(p => p.categoria === cat);
        const title = document.createElement('h2');
        title.className = 'category-title';
        title.innerText = cat;
        contenedor.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'catalog';
        
        catProds.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const disableBtn = prod.stock <= 0 ? 'disabled' : '';
            const btnText = prod.stock <= 0 ? 'Agotado' : 'Agregar al Carrito';
            
            card.innerHTML = `
                <div>
                    <h3>${prod.nombre}</h3>
                    <p>${prod.desc}</p>
                </div>
                <div>
                    <div class="price">$${prod.precio.toFixed(2)} MXN</div>
                    <div class="stock-info">Disponibles: ${prod.stock} pz</div>
                    <button ${disableBtn} onclick="agregarAlCarrito('${prod.id}')">${btnText}</button>
                </div>
            `;
            grid.appendChild(card);
        });
        contenedor.appendChild(grid);
    });
}

function agregarAlCarrito(idProducto) {
    const productos = JSON.parse(localStorage.getItem('dbProductos'));
    let carrito = JSON.parse(localStorage.getItem('dbCarrito'));
    const producto = productos.find(p => p.id === idProducto);
    
    const enCarrito = carrito.filter(item => item.id === idProducto).length;
    if (enCarrito >= producto.stock) {
        showToast('No hay más stock disponible de este producto', 'error');
        return;
    }

    carrito.push(producto);
    localStorage.setItem('dbCarrito', JSON.stringify(carrito));
    showToast(`${producto.nombre} agregado al carrito`);
    renderizarCarrito();
}

function renderizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const subtotalEl = document.getElementById('subtotal');
    if (!lista) return;

    const carrito = JSON.parse(localStorage.getItem('dbCarrito'));
    lista.innerHTML = '';
    let subtotal = 0;

    if (carrito.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#666;">Tu carrito está vacío.</p>';
        subtotalEl.innerText = '0.00';
        return;
    }

    carrito.forEach((prod, index) => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <span><strong>${prod.id}</strong> - ${prod.nombre}</span> 
            <span>$${prod.precio.toFixed(2)} 
                <button class="remove-btn" onclick="eliminarDelCarrito(${index})">X</button>
            </span>
        `;
        lista.appendChild(item);
        subtotal += prod.precio;
    });

    subtotalEl.innerText = subtotal.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('dbCarrito'));
    carrito.splice(index, 1);
    localStorage.setItem('dbCarrito', JSON.stringify(carrito));
    renderizarCarrito();
}

// ==========================================
// 5. PROCESAMIENTO DE PAGOS (2 OPCIONES)
// ==========================================

// OPCIÓN 1: WhatsApp
function procesarPagoPorWhatsApp() {
    const carrito = JSON.parse(localStorage.getItem('dbCarrito'));
    if (carrito.length === 0) {
        showToast("Agrega productos al carrito primero", "error");
        return;
    }

    const nombre = document.getElementById('wa-name').value.trim();
    if (!nombre) {
        showToast("Por favor, ingresa tu nombre / matrícula", "error");
        return;
    }

    let mensaje = `Hola Arduitronic, soy ${nombre}. Me gustaría apartar el siguiente material escolar:\n\n`;
    let subtotal = 0;

    carrito.forEach((p) => {
        mensaje += `- 1x ${p.nombre} ($${p.precio.toFixed(2)})\n`;
        subtotal += p.precio;
    });

    mensaje += `\n*Total a pagar en tienda: $${subtotal.toFixed(2)} MXN*\n\nPaso a recogerlo en un momento. ¡Gracias!`;
    const telefono = "524861280332";
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// OPCIÓN 2: Tarjeta Simulada
function procesarPagoSimulado(e) {
    e.preventDefault();
    const carrito = JSON.parse(localStorage.getItem('dbCarrito'));
    
    if (carrito.length === 0) {
        showToast('Agrega productos al carrito primero', 'error');
        return;
    }

    const btn = document.getElementById('btn-pagar');
    btn.innerText = "Procesando...";
    btn.disabled = true;

    setTimeout(() => {
        const ventas = JSON.parse(localStorage.getItem('dbVentas'));
        const total = carrito.reduce((sum, p) => sum + p.precio, 0);
        ventas.push({
            fecha: new Date().toLocaleString(),
            total: total,
            items: carrito.length,
            cliente: document.getElementById('cc-name').value
        });
        localStorage.setItem('dbVentas', JSON.stringify(ventas));

        const productos = JSON.parse(localStorage.getItem('dbProductos'));
        carrito.forEach(cartItem => {
            const prodIndex = productos.findIndex(p => p.id === cartItem.id);
            if(prodIndex > -1) { productos[prodIndex].stock -= 1; }
        });
        localStorage.setItem('dbProductos', JSON.stringify(productos));
        localStorage.setItem('dbCarrito', JSON.stringify([]));

        showToast('¡Pago aprobado! Redirigiendo...', 'success');
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    }, 1500);
}

// ==========================================
// 6. PANEL ADMIN
// ==========================================
function loginAdmin(e) {
    e.preventDefault();
    const pass = document.getElementById('admin-pass').value;
    if (pass === 'admin123') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        showToast('Acceso concedido', 'success');
        cargarDatosAdmin();
    } else {
        showToast('Contraseña incorrecta', 'error');
    }
}

function cargarDatosAdmin() {
    const productos = JSON.parse(localStorage.getItem('dbProductos'));
    const ventas = JSON.parse(localStorage.getItem('dbVentas'));

    const ingresosTotales = ventas.reduce((sum, v) => sum + v.total, 0);
    const articulosVendidos = ventas.reduce((sum, v) => sum + v.items, 0);
    
    document.getElementById('stat-ingresos').innerText = `$${ingresosTotales.toFixed(2)}`;
    document.getElementById('stat-ventas').innerText = ventas.length;
    document.getElementById('stat-articulos').innerText = articulosVendidos;

    const tbody = document.getElementById('admin-inventory-body');
    tbody.innerHTML = '';
    productos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>
                <input type="number" id="stock-${p.id}" value="${p.stock}" style="width:60px; padding:0.3rem;">
            </td>
            <td>
                <button class="admin-action-btn" onclick="actualizarStock('${p.id}')">Guardar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarStock(id) {
    const productos = JSON.parse(localStorage.getItem('dbProductos'));
    const nuevoStock = parseInt(document.getElementById(`stock-${id}`).value);
    
    const index = productos.findIndex(p => p.id === id);
    if(index > -1) {
        productos[index].stock = nuevoStock;
        localStorage.setItem('dbProductos', JSON.stringify(productos));
        showToast('Inventario actualizado', 'success');
    }
}

// ==========================================
// INICIALIZACIÓN DE LA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    if (!document.getElementById('toast-container')) {
        const tc = document.createElement('div');
        tc.id = 'toast-container';
        document.body.appendChild(tc);
    }
    renderizarCatalogo();
    renderizarCarrito();
});
