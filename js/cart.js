let carritoBtn = document.getElementById("carritoBtn");
let carritoSidebar = document.getElementById("carritoSidebar");
let cerrarCarrito = document.getElementById("cerrarCarrito");

// para el menu carrito
document.addEventListener("DOMContentLoaded", () => {
  carritoBtn.addEventListener("click", () => {
    carritoSidebar.classList.toggle("active");
  });

  cerrarCarrito.addEventListener("click", () => {
    carritoSidebar.classList.remove("active");
  });

  // funciones del carrito (actualiza, agrega y mas)
  const carritoItems = document.getElementById("carritoItems");
  let carrito = {};

  function actualizarCarrito() {
    carritoItems.innerHTML = "";
    let total = 0;

    Object.values(carrito).forEach((producto) => {
      const item = document.createElement("li");
      item.className = "list-group-item";
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-center w-100"><h6>${producto.nombre}</h6></div>
        </div>
        <div class="d-flex align-items-center mt-2">
          <img src="${producto.img}" alt="${
        producto.nombre
      }" style="width:60px; height:60px; object-fit:cover; margin-right:10px;">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center">
              <button class="btn btn-sm btn-outline-secondary me-2" onclick="modificarCantidad('${
                producto.nombre
              }', -1)">-</button>
              <span>${producto.cantidad}</span>
              <button class="btn btn-sm btn-outline-secondary ms-2" onclick="modificarCantidad('${
                producto.nombre
              }', 1)">+</button>
            </div>
          </div>
          <span>$${(producto.precio * producto.cantidad).toFixed(2)}</span>
        </div>
      `;
      carritoItems.appendChild(item);
      total += producto.precio * producto.cantidad;
    });

    document.getElementById("cartTotal").textContent = total.toFixed(2);
  }

  window.modificarCantidad = function (nombre, cambio) {
    if (carrito[nombre]) {
      carrito[nombre].cantidad += cambio;
      if (carrito[nombre].cantidad <= 0) delete carrito[nombre];
      actualizarCarrito();
    }
  };

  // datos del menú desde JSON
  fetch("../data/menu.json")
    .then((response) => response.json())
    .then((data) => {
      // carga las bebidas calientes
      loadMenuItems(data.bebidasCalientes, "calientesContainer");

      // carga las bebidas frías
      loadMenuItems(data.bebidasFrias, "friasContainer");

      // carga los postres
      loadMenuItems(data.postres, "postresContainer");
    })
    .catch((error) => {
      console.error("Error al cargar el menú:", error);
    });

  // Aqyu se cargar toda la informacion de los modales
  function loadMenuItems(items, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Contenedor con ID ${containerId} no encontrado`);
      return;
    }
    container.innerHTML = "";

    // Aqui se genera la informacion en los modales
    items.forEach((item) => {
      const itemHTML = `
            <div class="col-md-6 mb-4">
                <div class="card h-100 text-center" style="min-height: 400px; display: flex; flex-direction: column;">
                    <div style="height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="${item.imagen}" class="card-img-top" alt="${
        item.nombre
      }" 
                             style="max-height: 140px; width: auto; object-fit: contain;">
                    </div>
                    <div class="card-body align-items-center d-flex flex-column flex-grow-1">
                        <h6 class="card-title">${
                          item.nombre
                        } - $${item.precio.toFixed(2)}</h6>
                        <p class="card-text text-center flex-grow-1" style="overflow: hidden; text-overflow">${
                          item.descripcion
                        }</p>
                        <div class="d-flex justify-content-center align-items-center mb-2">
                            <button class="btn btn-sm btn-outline-secondary minus">-</button>
                            <span class="mx-2 quantity">1</span>
                            <button class="btn btn-sm btn-outline-secondary plus">+</button>
                        </div>
                        <button class="btn btn-compra add-to-cart mt-auto" 
                                data-item="${item.nombre}" 
                                data-price="${item.precio}" 
                                data-img="${item.imagen}">
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;

      container.innerHTML += itemHTML;
    });

    addQuantityListeners(container);
    addCartListeners(container);
  }

  // fucnion para agregar listeners a los botones de cantidad
  function addQuantityListeners(container) {
    const minusButtons = container.querySelectorAll(".minus");
    const plusButtons = container.querySelectorAll(".plus");

    minusButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const quantitySpan = this.nextElementSibling;
        let quantity = parseInt(quantitySpan.textContent);
        if (quantity > 1) {
          quantity--;
          quantitySpan.textContent = quantity;
        }
      });
    });

    plusButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const quantitySpan = this.previousElementSibling;
        let quantity = parseInt(quantitySpan.textContent);
        quantity++;
        quantitySpan.textContent = quantity;
      });
    });
  }

  function addCartListeners(container) {
    const addToCartButtons = container.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const nombre = this.getAttribute("data-item");
        const precio = parseFloat(this.getAttribute("data-price"));
        const img = this.getAttribute("data-img");
        const cantidad = parseInt(
          this.parentElement.querySelector(".quantity").textContent
        );
        if (carrito[nombre]) {
          carrito[nombre].cantidad += cantidad;
        } else {
          carrito[nombre] = { nombre, precio, cantidad, img };
        }
        actualizarCarrito();
        Swal.fire({
          title: "Se agrego al carrito!",
          html: `<strong>${cantidad} ${nombre}</strong> agregado correctamente`,
          icon: "success",
          confirmButtonText: "Aceptar",
          timer: 2000,
          timerProgressBar: true,
        });
      });
    });
  }

  //valida que si preciona el boton sin articulos
  document
    .getElementById("finalizarCompraBtn")
    .addEventListener("click", function () {
      if (Object.keys(carrito).length === 0) {
        Swal.fire({
          icon: "error",
          title: "Carrito vacio",
          text: "Agrega productos al carrito",
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        actualizarCarrito();
      }
    });
});
