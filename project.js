// Base de datos de productos
const productos = [
  {
    id: 1,
    nombre: "Computador Gamer Pro",
    descripcion: "Procesador Intel i9, RTX 4080, 32GB RAM, SSD 1TB",
    precio: 9876000,
    moneda: "COP",
    categoria: "gamer",
    emoji: "🎮"
  },
  {
    id: 2,
    nombre: "Laptop Profesional Elite",
    descripcion: "AMD Ryzen 9, 16GB RAM, SSD 512GB, pantalla 4K",
    precio: 6789000,
    moneda: "COP",
    categoria: "profesional",
    emoji: "💼"
  },
  {
    id: 3,
    nombre: "Computador Gaming Racer",
    descripcion: "Intel i7 K, RTX 4070, 16GB RAM, SSD 500GB",
    precio: 5890000,
    moneda: "COP",
    categoria: "gamer",
    emoji: "🎮"
  },
  {
    id: 4,
    nombre: "Laptop Ultrabook",
    descripcion: "Intel Core i5, 8GB RAM, SSD 256GB, ultra portátil",
    precio: 3499000,
    moneda: "COP",
    categoria: "profesional",
    emoji: "💻"
  },
  {
    id: 5,
    nombre: "PC Workstation",
    descripcion: "Intel Xeon, 64GB RAM, RTX 5000, perfecto para diseño",
    precio: 3999000,
    moneda: "COP",
    categoria: "profesional",
    emoji: "🖥️"
  },
  {
    id: 6,
    nombre: "Computador Básico",
    descripcion: "AMD Ryzen 3, 4GB RAM, SSD 128GB, ideal para tareas básicas",
    precio: 3490000,
    moneda: "COP",
    categoria: "basico",
    emoji: "💻"
  },
  {
    id: 7,
    nombre: "Gaming Extreme",
    descripcion: "Intel i9 + RTX 4090, 64GB RAM, SSD 2TB, el mejor rendimiento",
    precio: 12999000,
    moneda: "COP",
    categoria: "gamer",
    emoji: "🎮"
  },
  {
    id: 8,
    nombre: "Laptop Estudiante",
    descripcion: "Intel Core i3, 8GB RAM, SSD 256GB, perfecta para estudiantes",
    precio: 4990000,
    moneda: "COP",
    categoria: "basico",
    emoji: "📚"
  }
];

// Carrito de compras
let carrito = [];
let filtroActual = 'todos';

// Elementos del DOM
const productosGrid = document.getElementById('productos-grid');
const modalCarrito = document.getElementById('modal-carrito');
const btnVerCarrito = document.getElementById('ver-carrito');
const closeBtn = document.querySelector('.close');
const filtros = document.querySelectorAll('.filtro');
const cantidadCarrito = document.getElementById('cantidad-carrito');
const totalCarrito = document.getElementById('total-carrito');
const carritoItems = document.getElementById('carrito-items');
const btnCheckout = document.getElementById('btn-checkout');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  mostrarProductos(productos);
  cargarCarritoDelStorage();
});

// Mostrar productos
function mostrarProductos(productosFiltrados) {
  productosGrid.innerHTML = '';
  
  productosFiltrados.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'producto';
    div.innerHTML = `
      <div class="producto-imagen">${producto.emoji}</div>
      <div class="producto-contenido">
        <span class="producto-categoria">${producto.categoria.toUpperCase()}</span>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="producto-precio">$${producto.precio}</div>
        <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
      </div>
    `;
    productosGrid.appendChild(div);
  });
}

// Filtrar productos
filtros.forEach(boton => {
  boton.addEventListener('click', (e) => {
    // Remover clase active de todos
    filtros.forEach(f => f.classList.remove('active'));
    // Agregar a este
    e.target.classList.add('active');
    
    filtroActual = e.target.getAttribute('data-filtro');
    
    let productosFiltrados;
    if (filtroActual === 'todos') {
      productosFiltrados = productos;
    } else {
      productosFiltrados = productos.filter(p => p.categoria === filtroActual);
    }
    
    mostrarProductos(productosFiltrados);
  });
});

// Agregar al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const itemEnCarrito = carrito.find(p => p.id === id);
  
  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }
  
  actualizarCarrito();
  guardarCarritoEnStorage();
  mostrarNotificacion(`${producto.nombre} agregado al carrito!`);
}

// Actualizar carrito
function actualizarCarrito() {
  cantidadCarrito.textContent = carrito.reduce((total, p) => total + p.cantidad, 0);
  
  carritoItems.innerHTML = '';
  
  if (carrito.length === 0) {
    carritoItems.innerHTML = '<p>Tu carrito está vacío</p>';
    totalCarrito.textContent = '0';
    return;
  }
  
  carrito.forEach(item => {
    const div = document.createElement('div');
    div.className = 'carrito-item';
    const subtotal = item.precio * item.cantidad;
    div.innerHTML = `
      <div class="carrito-item-info">
        <h4>${item.nombre}</h4>
        <p>$${item.precio} x ${item.cantidad} = $${subtotal}</p>
      </div>
      <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
    `;
    carritoItems.appendChild(div);
  });
  
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  totalCarrito.textContent = total;
}

// Eliminar del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
  guardarCarritoEnStorage();
}

// Mostrar/Ocultar modal
btnVerCarrito.addEventListener('click', () => {
  modalCarrito.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  modalCarrito.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === modalCarrito) {
    modalCarrito.classList.remove('show');
  }
});

// Procesar compra
btnCheckout.addEventListener('click', () => {
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  alert(`¡Compra completada! Total: $${total}\n\n¡Gracias por tu compra!`);
  carrito = [];
  actualizarCarrito();
  modalCarrito.classList.remove('show');
  localStorage.removeItem('carrito');
});

// Guardar carrito en localStorage
function guardarCarritoEnStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarritoDelStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}

// Notificación simple
function mostrarNotificacion(mensaje) {
  const elemento = document.createElement('div');
  elemento.textContent = mensaje;
  elemento.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #27ae60;
    color: white;
    padding: 15px 20px;
    border-radius: 6px;
    z-index: 999;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(elemento);
  
  setTimeout(() => {
    elemento.remove();
  }, 3000);
}

// Agregar animación CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

