document.addEventListener("DOMContentLoaded", () => {
  // Obtener el contenedor donde irá la tabla
  const btnPDF = document.querySelector("#btnPDF");
  const tablaContainer = document.querySelector("#tabla");
  if (!tablaContainer)
    return console.error("No se encontró el elemento #tabla");

  // Leer y parsear carrito desde localStorage (si existe)
  const carritoRaw = localStorage.getItem("carrito");
  const carrito = carritoRaw ? JSON.parse(carritoRaw) : null;

  function construirTabla(carrito) {
    // Normalizamos productos a un array (soporta objeto con keys o array)
    const productos = Array.isArray(carrito)
      ? carrito
      : carrito
      ? Object.values(carrito)
      : [];

    if (productos.length === 0) {
      return `<div class="alert alert-info text-center">No hay productos en el carrito.</div>`;
    }

    let tablaHTML = `
      <table class="table table-striped table-hover table-bordered align-middle ">
        <thead class="table-dark text-center">
        <tr>
            <th scope="col" colspan="4" class="text-center text-light">Recibo</th>
          </tr>
          <tr>
            <th scope="col" class="" >Producto</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Precio Unitario</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    let total = 0;

    productos.forEach((producto) => {
      // defensivo: aseguramos que precio y cantidad sean números
      const nombre = producto?.nombre ?? "Producto";
      const precio = Number(producto?.precio) || 0;
      const cantidad = Number(producto?.cantidad) || 0;
      const subtotal = precio * cantidad;
      total += subtotal;

      tablaHTML += `
        <tr>
          <td class="text-center fw-semibold">${nombre}</td>
          <td class="text-center">${cantidad}</td>
          <td class="text-center">$${precio.toFixed(2)}</td>
          <td class="text-center text-success fw-bold">$${subtotal.toFixed(
            2
          )}</td>
        </tr>
      `;
    });

    tablaHTML += `
        <tr class="table-dark fw-bold">
          <td colspan="3" class="text-end">TOTAL</td>
          <td class="text-center text-light">$${total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
    `;

    return tablaHTML;
  }

  // Renderizamos la tabla (si carrito es null/empty, la función lo maneja)
  tablaContainer.innerHTML = construirTabla(carrito);

  btnPDF.addEventListener("click", () => {
    const element = document.getElementById("tabla");
    const opt = {
      margin: 0.5,
      filename: "xilotepec-recibo.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, scrollY: 0 }, // evita capturar solo lo visible
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }, // <--- clave para dividir
    };
    html2pdf().set(opt).from(element).save();
  });
});
