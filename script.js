const historialReportes = JSON.parse(localStorage.getItem("historialReportes")) || [];

const sidebar = document.getElementById("sidebar");
const modal = document.getElementById("modal");
const menuBtn = document.getElementById("openMenu");
const modalTitle = document.getElementById("modal-title");
const addProductBtn = document.getElementById("add-product-btn");
const tableBody = document.getElementById("table-body");
const tableHead = document.getElementById("table-head");

const productosBase = [
  "Fernet Buhero","Fernet Branca","Flor de caña 7 años","Flor de caña 5 años",
  "Ron Havana","Gyn Andina","Gyn Frutilla","Gyn Amazónico","Gyn Frutos del Bosque",
  "Cerveza Huari","Cerveza Budweiser","Cerveza Corona","Latas Paceña","Golden",
  "Viuda","Parrales","Agua Pacha","Agua Vital Normal","Agua Vital con Gas",
  "Sens Maracuyá","Sens Achachairú","Sens Limón","Sens Arándano","Sens Cereza",
  "Sens Açaí","Vodka 1825","Tequila Jose Cuervo","Jager","Tres plumas chocolate blanco",
  "Tres plumas chocolate","Tres plumas amareto","Tres plumas menta","Black Label 750 ml",
  "Red Label","Black Label 1L","Altosama","Coca-Cola 3L","Sprite 3L","Coca-Cola 2L",
  "Sprite 2L","Simba Pomelo","Monster","Agua Tónica 900 ml","Ginger 900 ml","Ginger 1.5L",
  "Pura Vida","Sprite 2.5L","Blue Curacao","Granadina","Cocalero","Chivas","Harry el limonero",
  "Supay","Limoncello","Barcelo Imperial","Camel 2 click Grande","Camel 2 click Pequeño",
  "Camel 1 click Grande","Camel 1 click Pequeño","Arancello","Tundiqui"
];

const productosMesas = [
  "Parrales","Viuda","Gyn Amazónico","Flor de caña 5 años","Fernet Buhero",
  "Coca-Cola 2L","Ginger 1.5L","Simba Pomelo","Vodka 1825","Agua Tónica 900 ml"
];

const productosAreas = {
  "Basines": ["Fernet Buhero","Cerveza Huari","Agua Pacha","Vodka 1825","Coca-Cola 3L","Sprite 3L"],
  "Cumpleaños": ["Flor de caña 5 años","Gyn Frutilla","Parrales","Monster","Sens Limón","Sens Maracuyá"],
  "Vasos": ["Golden","Latas Paceña","Viuda","Agua Vital Normal","Agua Vital con Gas","Red Label"]
};

// Objeto global para guardar valores de celdas
const dataGuardada = {};
// Array para guardar productos agregados dinámicamente en Cortesías
const productosCortesiasDinamicos = [];

// -------------------- RECUPERAR DATOS DE LOCALSTORAGE --------------------
const dataGuardadaLocal = localStorage.getItem("dataGuardada");
if (dataGuardadaLocal) {
  Object.assign(dataGuardada, JSON.parse(dataGuardadaLocal));
}

const cortesiasLocal = localStorage.getItem("productosCortesiasDinamicos");
if (cortesiasLocal) {
  const items = JSON.parse(cortesiasLocal);
  items.forEach(item => productosCortesiasDinamicos.push({row: null, nombre: item.nombre, cantidad: item.cantidad}));
}

// -------------------- MENU --------------------
menuBtn.onclick = () => {
  sidebar.classList.add("open");
  menuBtn.style.display = "none";
};

document.getElementById("closeMenu").onclick = () => {
  sidebar.classList.remove("open");
  menuBtn.style.display = "block";
};

// -------------------- BOTONES --------------------
const clearDataBtn = document.getElementById("clearDataBtn");
const mensajeBorrado = document.getElementById("mensajeBorrado");
const inicioBtn = document.getElementById("inicioBtn");
const modalInicio = document.getElementById("modalInicio");
const resumenBody = document.getElementById("resumenBody");
const usoBtn = document.getElementById("usoBtn");
const finalBtn = document.getElementById("finalBtn");



// Ocultamos botones al iniciar
clearDataBtn.style.display = "none";
inicioBtn.style.display = "none";
mensajeBorrado.classList.remove("show");

// -------------------- SIDEBAR ITEM --------------------
document.querySelectorAll(".sidebar-item").forEach(btn => {
  btn.onclick = () => {
    const title = btn.textContent.trim();


    // Ocultar botones por defecto al abrir cualquier modal
    clearDataBtn.style.display = "none";
    inicioBtn.style.display = "none";
    usoBtn.style.display = "none";
    finalBtn.style.display = "none";
    reporteBtn.style.display = "none"; // agregado
    mensajeBorrado.classList.remove("show");


    modalTitle.textContent = title;
    modal.style.display = "block";
    sidebar.classList.remove("open");
    menuBtn.style.display = "block";

    tableBody.innerHTML = "";
    tableHead.innerHTML = "";
    addProductBtn.style.display = "none";
    document.getElementById("productos-table").style.display = "table";

    // ------------------ CONTEO INICIAL ------------------
    if(title.includes("Conteo Inicial")) {
      const headerRow = document.createElement("tr");
      ["Producto","Conteo Inicial","Ingreso Nuevo Stock"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
      });
      tableHead.appendChild(headerRow);

      productosBase.forEach(prod => {
        const row = document.createElement("tr");

        const tdNombre = document.createElement("td");
        tdNombre.textContent = prod;

        const tdConteo = document.createElement("td");
        tdConteo.contentEditable = "true";
        tdConteo.textContent = dataGuardada[`${prod}_conteo`] || "";

        const tdIngreso = document.createElement("td");
        tdIngreso.contentEditable = "true";
        tdIngreso.textContent = dataGuardada[`${prod}_ingreso`] || "";

        // Guardar al escribir
        tdConteo.addEventListener("input", () => {
          dataGuardada[`${prod}_conteo`] = tdConteo.textContent;
          localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
        });
        tdIngreso.addEventListener("input", () => {
          dataGuardada[`${prod}_ingreso`] = tdIngreso.textContent;
          localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
        });

        row.appendChild(tdNombre);
        row.appendChild(tdConteo);
        row.appendChild(tdIngreso);
        tableBody.appendChild(row);
      });
      return;
    }

    // ------------------ ÁREAS ------------------
    if(title.includes("Áreas")) {
      Object.keys(productosAreas).forEach(area => {
        const catRow = document.createElement("tr");
        const catCell = document.createElement("td");
        catCell.colSpan = 4;
        catCell.textContent = area;
        catCell.style.fontWeight = "bold";
        catCell.style.background = "#ffcccb";
        catCell.style.textAlign = "center";
        catRow.appendChild(catCell);
        tableBody.appendChild(catRow);

        const headerRow = document.createElement("tr");
        ["Producto","Entrega","Devolución","Uso"].forEach(text => {
          const th = document.createElement("th");
          th.textContent = text;
          headerRow.appendChild(th);
        });
        tableBody.appendChild(headerRow);

        productosAreas[area].forEach(prod => {
          const row = document.createElement("tr");

          const tdNombre = document.createElement("td");
          tdNombre.textContent = prod;

          const tdEntrega = document.createElement("td");
          tdEntrega.contentEditable = "true";
          tdEntrega.textContent = dataGuardada[`${prod}_entrega`] || "";

          const tdDevolucion = document.createElement("td");
          tdDevolucion.contentEditable = "true";
          tdDevolucion.textContent = dataGuardada[`${prod}_devolucion`] || "";

          const tdUso = document.createElement("td");
          tdUso.textContent = dataGuardada[`${prod}_uso`] || "";

          const calcularUso = () => {
            const entrega = parseInt(tdEntrega.textContent) || 0;
            const devol = parseInt(tdDevolucion.textContent) || 0;
            tdUso.textContent = entrega - devol;
            dataGuardada[`${prod}_uso`] = tdUso.textContent;
            localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
          };
          tdEntrega.addEventListener("input", () => {
            dataGuardada[`${prod}_entrega`] = tdEntrega.textContent;
            localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
            calcularUso();
          });
          tdDevolucion.addEventListener("input", () => {
            dataGuardada[`${prod}_devolucion`] = tdDevolucion.textContent;
            localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
            calcularUso();
          });

          row.appendChild(tdNombre);
          row.appendChild(tdEntrega);
          row.appendChild(tdDevolucion);
          row.appendChild(tdUso);
          tableBody.appendChild(row);
        });
      });
      return;
    }

    // ------------------ CORTESÍAS ------------------
    if(title.includes("Cortesías")) {
      const headerRow = document.createElement("tr");
      ["Producto","Cantidad"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
      });
      tableHead.appendChild(headerRow);

      tableBody.innerHTML = "";
      addProductBtn.style.display = "block";

      // Reconstruir productos dinámicos
      productosCortesiasDinamicos.forEach(item => {
        const row = document.createElement("tr");

        const tdNombre = document.createElement("td");
        const select = document.createElement("select");
        productosBase.forEach(prod => {
          const option = document.createElement("option");
          option.value = prod;
          option.textContent = prod;
          if (prod === item.nombre) option.selected = true;
          select.appendChild(option);
        });
        tdNombre.appendChild(select);

        const tdCantidad = document.createElement("td");
        tdCantidad.contentEditable = "true";
        tdCantidad.textContent = item.cantidad || "";

        const actualizarData = () => {
          const prodSeleccionado = select.value;
          dataGuardada[`cortesias_${prodSeleccionado}`] = tdCantidad.textContent;
          item.nombre = prodSeleccionado;
          item.cantidad = tdCantidad.textContent;

          localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
          localStorage.setItem("productosCortesiasDinamicos", JSON.stringify(productosCortesiasDinamicos.map(p => ({nombre: p.nombre, cantidad: p.cantidad}))));
        };
        select.addEventListener("change", actualizarData);
        tdCantidad.addEventListener("input", actualizarData);

        row.appendChild(tdNombre);
        row.appendChild(tdCantidad);
        tableBody.appendChild(row);
      });

      return;
    }

    // ------------------ CONTEO FINAL ------------------
    if(title.toLowerCase().includes("conteo final")) {
      tableBody.innerHTML = "";
      tableHead.innerHTML = "";

      const headerRow = document.createElement("tr");
      const columnas = [
        { tipo: "texto", contenido: "Producto" },
        { tipo: "imagen", ruta: "pacena-cerveza-logo-png_seeklogo-508403.png", tooltip: "frezer paceña" },
        { tipo: "imagen", ruta: "73999-removebg-preview.png", tooltip: "frezer monster" },
        { tipo: "imagen", ruta: "Soda-Brand-Logos-18-1200x750-removebg-preview.png", tooltip: "frezer scheppes" },
        { tipo: "imagen", ruta: "Gemini_Generated_Image_lodwpulodwpulodw-removebg-preview.png", tooltip: "lavaplatos" },
        { tipo: "imagen", ruta: "Gemini_Generated_Image_3wy3z53wy3z53wy3-removebg-preview.png", tooltip: "deposito" }
      ];

      columnas.forEach(col => {
        const th = document.createElement("th");
        if (col.tipo === "texto") th.textContent = col.contenido;
        else {
          const container = document.createElement("div");
          container.className = "img-container-header";
          const img = document.createElement("img");
          img.src = col.ruta; 
          img.alt = col.tooltip;
          img.title = col.tooltip;
          container.appendChild(img);
          th.appendChild(container);
        }
        headerRow.appendChild(th);
      });
      tableHead.appendChild(headerRow);

      productosBase.forEach(prod => {
        const row = document.createElement("tr");
        const tdNombre = document.createElement("td");
        tdNombre.textContent = prod;
        row.appendChild(tdNombre);

        for (let i = 0; i < 5; i++) {
          const td = document.createElement("td");
          td.contentEditable = "true";
          td.textContent = dataGuardada[`${prod}_final_${i}`] || "";
          td.style.textAlign = "center";
          td.addEventListener("input", () => {
            dataGuardada[`${prod}_final_${i}`] = td.textContent;
            localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
          });
          row.appendChild(td);
        }
        tableBody.appendChild(row);
      });

      clearDataBtn.style.display = "block";
      inicioBtn.style.display = "block";
      usoBtn.style.display = "block";
      finalBtn.style.display = "block";
      // Mostrar botón de reporte solo en conteo final
      reporteBtn.style.display = "block";

      return;
    }

    // ------------------ MESAS Y OTROS ------------------
    const headerRow = document.createElement("tr");
    ["Producto","Cantidad"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    let listaProductos = productosBase;
    let tipoRegistro = "ventas";

    if (title.includes("Mesas")) {
      listaProductos = productosMesas;
      tipoRegistro = "mesas";
    }

    listaProductos.forEach(prod => {
      const row = document.createElement("tr");
      const tdNombre = document.createElement("td");
      tdNombre.textContent = prod;
      const tdCantidad = document.createElement("td");
      tdCantidad.contentEditable = "true";
      tdCantidad.textContent = dataGuardada[`${prod}_${tipoRegistro}`] || "";

      tdCantidad.addEventListener("input", () => {
        dataGuardada[`${prod}_${tipoRegistro}`] = tdCantidad.textContent;
        localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
      });

      row.appendChild(tdNombre);
      row.appendChild(tdCantidad);
      tableBody.appendChild(row);
    });
  };
});

// -------------------- AGREGAR PRODUCTO CORTESÍA --------------------
addProductBtn.onclick = () => {
  const row = document.createElement("tr");

  const tdNombre = document.createElement("td");
  const select = document.createElement("select");
  productosBase.forEach(prod => {
    const option = document.createElement("option");
    option.value = prod;
    option.textContent = prod;
    select.appendChild(option);
  });
  tdNombre.appendChild(select);

  const tdCantidad = document.createElement("td");
  tdCantidad.contentEditable = "true";
  tdCantidad.textContent = "";

  const item = {row, nombre: select.value, cantidad: ""};
  productosCortesiasDinamicos.push(item);

  const actualizarData = () => {
    const prodSeleccionado = select.value;
    dataGuardada[`cortesias_${prodSeleccionado}`] = tdCantidad.textContent;
    item.nombre = prodSeleccionado;
    item.cantidad = tdCantidad.textContent;

    localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
    localStorage.setItem("productosCortesiasDinamicos", JSON.stringify(productosCortesiasDinamicos.map(p => ({nombre: p.nombre, cantidad: p.cantidad}))));
  };

  select.addEventListener("change", actualizarData);
  tdCantidad.addEventListener("input", actualizarData);

  row.appendChild(tdNombre);
  row.appendChild(tdCantidad);
  tableBody.appendChild(row);
};

// -------------------- CERRAR MODAL --------------------
document.getElementById("closeModal").onclick = () => {
  modal.style.display = "none";
  mensajeBorrado.classList.remove("show");
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    mensajeBorrado.classList.remove("show");
  }
};

// -------------------- BORRAR DATOS --------------------
// -------------------- BORRAR DATOS (Y TRASPASAR FINAL A INICIAL) --------------------
clearDataBtn.onclick = () => {
    // 1. Creamos un objeto temporal para capturar el stock final actual
    const nuevoInicio = {};

    productosBase.forEach(prod => {
        let totalFinal = 0;
        // Sumamos las 5 columnas de conteo final (freezers, depósitos, etc.)
        for (let i = 0; i < 5; i++) {
            totalFinal += parseInt(dataGuardada[`${prod}_final_${i}`]) || 0;
        }

        // Si el total es mayor a 0, lo preparamos para el nuevo Conteo Inicial
        if (totalFinal > 0) {
            nuevoInicio[`${prod}_conteo`] = totalFinal.toString();
        }
    });

    // 2. Limpiamos TODO el almacenamiento y la memoria
    localStorage.removeItem("dataGuardada");
    localStorage.removeItem("productosCortesiasDinamicos");

    // Vaciamos el objeto dataGuardada sin perder su referencia
    Object.keys(dataGuardada).forEach(key => delete dataGuardada[key]);
    productosCortesiasDinamicos.length = 0;

    // 3. Inyectamos los valores del final en el nuevo inicio y guardamos
    Object.assign(dataGuardada, nuevoInicio);
    localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));

    // 4. Limpieza visual inmediata de la tabla abierta
    tableBody.querySelectorAll("tr").forEach(row => {
        row.querySelectorAll("td").forEach((cell, idx) => {
            if(idx > 0) cell.textContent = "";
        });
    });

    // 5. Feedback visual rápido (Toast)
    mensajeBorrado.textContent = "✅ Stock Final movido a Inicial. Datos limpiados.";
    mensajeBorrado.classList.add("show");

    setTimeout(() => {
        mensajeBorrado.classList.remove("show");
        modal.style.display = "none"; // Cerramos el modal para refrescar el flujo
    }, 1500);
};

inicioBtn.onclick = () => {
    resumenBody.innerHTML = "";

    productosBase.forEach(prod => {
        // Usamos Number() para asegurar que sean números y no texto
        // Si el valor no existe o está vacío, ponemos 0
        const inicial = Number(dataGuardada[`${prod}_conteo`]) || 0;
        const ingreso = Number(dataGuardada[`${prod}_ingreso`]) || 0;

        // Ahora la suma será matemática pura: 10 + 5 = 15 (no "105")
        const sumaTotal = inicial + ingreso;

        if (sumaTotal > 0) {
            const item = document.createElement("div");
            item.className = "resumen-item";

            item.innerHTML = `
                <span class="producto">${prod}</span>
                <span class="inicio-stock" style="font-weight: bold; color: #d4af37;">${sumaTotal}</span>
            `;

            resumenBody.appendChild(item);
        }
    });

    document.querySelector("#modalInicio h2").textContent = "CONTEO INICIAL + INGRESOS";
    modalInicio.style.display = "block";
};


document.getElementById("closeInicio").onclick = () => {
  modalInicio.style.display = "none";
};

window.addEventListener("click", e => {
  if (e.target === modalInicio) modalInicio.style.display = "none";
});
usoBtn.onclick = () => {
  resumenBody.innerHTML = "";

  productosBase.forEach(prod => {
    let totalUso = 0;

    // Ventas
    totalUso += parseInt(dataGuardada[`${prod}_ventas`]) || 0;

    // Mesas
    totalUso += parseInt(dataGuardada[`${prod}_mesas`]) || 0;

    // Cortesías
    totalUso += parseInt(dataGuardada[`cortesias_${prod}`]) || 0;

    // Áreas (uso ya calculado)
    totalUso += parseInt(dataGuardada[`${prod}_uso`]) || 0;

    if (totalUso > 0) {
      const item = document.createElement("div");
      item.className = "resumen-item";
      item.innerHTML = `
        <span class="producto">${prod}</span>
        <span class="inicio-stock">${totalUso}</span>
      `;
      resumenBody.appendChild(item);
    }
  });

  document.querySelector("#modalInicio h2").textContent = "USO TOTAL";
  modalInicio.style.display = "block";
};
finalBtn.onclick = () => {
  resumenBody.innerHTML = "";

  productosBase.forEach(prod => {
    let totalFinal = 0;

    for (let i = 0; i < 5; i++) {
      totalFinal += parseInt(dataGuardada[`${prod}_final_${i}`]) || 0;
    }

    if (totalFinal > 0) {
      const item = document.createElement("div");
      item.className = "resumen-item";
      item.innerHTML = `
        <span class="producto">${prod}</span>
        <span class="inicio-stock">${totalFinal}</span>
      `;
      resumenBody.appendChild(item);
    }
  });

  document.querySelector("#modalInicio h2").textContent = "TOTAL FINAL POR PRODUCTO";
  modalInicio.style.display = "block";
};
const reporteBtn = document.getElementById("reporteBtn");
const modalReporte = document.getElementById("modalReporte");
const cuadreBody = document.getElementById("cuadreBody");
const closeReporte = document.getElementById("closeReporte");

// --- FUNCIÓN PARA DIBUJAR LAS TARJETAS EN LA PÁGINA ---
function renderizarTarjetas() {
    contenedorReportes.innerHTML = "";

    historialReportes.slice().reverse().forEach((rep, index) => {
        const realIndex = historialReportes.length - 1 - index;

        const card = document.createElement("div");
        card.className = "card-reporte";
        card.style.position = "relative";

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "select-reporte";
        checkbox.dataset.index = realIndex;
        checkbox.style.position = "absolute";
        checkbox.style.top = "10px";
        checkbox.style.left = "10px";
        card.appendChild(checkbox);

        // Botón de eliminar
        const btnEliminar = document.createElement("span");
        btnEliminar.innerHTML = "✕";
        btnEliminar.style.position = "absolute";
        btnEliminar.style.top = "6px";          // más cerca del borde superior
        btnEliminar.style.right = "6px";        // más cerca del borde derecho
        btnEliminar.style.cursor = "pointer";
        btnEliminar.style.color = "red";
        btnEliminar.style.fontSize = "20px";    // más grande
        btnEliminar.style.fontWeight = "bold";  // más visible
        btnEliminar.style.userSelect = "none";  // evita selección accidental
        btnEliminar.onclick = (e) => {
            e.stopPropagation(); // evita abrir el modal al hacer clic
            if(confirm("¿Deseas eliminar este reporte?")) {
                historialReportes.splice(realIndex, 1);
                localStorage.setItem("historialReportes", JSON.stringify(historialReportes));
                renderizarTarjetas();
            }
        };
        card.appendChild(btnEliminar);


        // Contenido del reporte
        const content = document.createElement("div");
        content.innerHTML = `
            <h4>Reporte de productos</h4>
            <p><strong>📅 Fecha:</strong> ${rep.fecha}</p>
            <p><strong>⏰ Hora:</strong> ${rep.hora}</p>
            <div style="margin-top:10px; font-size:0.8em; color:#d4af37;">Ver detalles →</div>
        `;
        card.appendChild(content);

        // Abrir modal al hacer clic fuera del checkbox o eliminar
        card.onclick = (e) => {
            if(e.target.tagName.toLowerCase() !== "input" && e.target !== btnEliminar) {
                mostrarReporteGuardado(rep);
            }
        };

        contenedorReportes.appendChild(card);
    });
}

document.getElementById("btnReporteConsolidado").onclick = async () => {
    const checkboxes = document.querySelectorAll(".select-reporte:checked");
    if(checkboxes.length === 0){
        alert("Selecciona al menos un reporte para consolidar.");
        return;
    }

    // Sumar uso de productos
    const usoConsolidado = {};
    productosBase.forEach(prod => usoConsolidado[prod] = 0);

    checkboxes.forEach(cb => {
        const rep = historialReportes[cb.dataset.index];
        rep.data.forEach(item => {
            usoConsolidado[item.producto] += item.uso;
        });
    });

    // Filtrar solo productos con uso > 0
    const filas = productosBase
        .filter(prod => usoConsolidado[prod] > 0)
        .map(prod => [prod, usoConsolidado[prod]]);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const ahora = new Date();
    const fechaStr = ahora.toLocaleDateString();
    const horaStr = ahora.toLocaleTimeString();

    // Logo
    const logo = new Image();
    logo.src = "1762998569035-removebg-preview.png"; // Ajusta ruta si es necesario
    logo.onload = () => {
        doc.addImage(logo, 'PNG', 14, 10, 15, 15);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Pacha Sunset", 34, 18);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Fecha: ${fechaStr}    Hora: ${horaStr}`, 200, 18, { align: "right" });

        doc.setFontSize(14);
        doc.text("USO CONSOLIDADO DE PRODUCTOS", 14, 35);

        // Tabla
        const columnas = ["Producto", "Cantidad"];
        doc.autoTable({
            startY: 40,
            head: [columnas],
            body: filas,
            theme: 'grid',
            headStyles: { fillColor: [255, 140, 66], halign: 'center', valign: 'middle' },
            columnStyles: {
                0: { halign: 'center', valign: 'middle' },  // Producto centrado
                1: { halign: 'center', valign: 'middle' }   // Cantidad centrada
            },
            styles: { fontSize: 10, cellPadding: 3 }
        });

        const nombrePDF = `Uso_Consolidado_${fechaStr.replace(/\//g,"-")}_${ahora.getHours()}h${ahora.getMinutes()}m.pdf`;
        doc.save(nombrePDF);
    };
};


// Nueva función para eliminar un reporte específico
function eliminarReporte(event, index) {
  event.stopPropagation(); // Evita que se abra el reporte al hacer clic en la X
  if (confirm("¿Estás seguro de eliminar este reporte permanentemente?")) {
      historialReportes.splice(index, 1);
      localStorage.setItem("historialReportes", JSON.stringify(historialReportes));
      renderizarTarjetas();
  }
}

// --- BOTÓN HACER REPORTE (MODIFICADO) ---
reporteBtn.onclick = () => {
    const now = new Date();
    const fecha = now.toLocaleDateString();
    const hora = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const id = `${now.toISOString()}`;

    const dataReporte = [];

    productosBase.forEach(prod => {
        const inicial = (parseInt(dataGuardada[`${prod}_conteo`]) || 0) + 
                        (parseInt(dataGuardada[`${prod}_ingreso`]) || 0);

        const uso = (parseInt(dataGuardada[`${prod}_ventas`]) || 0) + 
                    (parseInt(dataGuardada[`${prod}_mesas`]) || 0) + 
                    (parseInt(dataGuardada[`cortesias_${prod}`]) || 0) + 
                    (parseInt(dataGuardada[`${prod}_uso`]) || 0);

        let final = 0;
        for (let i = 0; i < 5; i++) {
            final += parseInt(dataGuardada[`${prod}_final_${i}`]) || 0;
        }

        const esperado = inicial - uso;
        let estadoStr = "";
        if (esperado === final) estadoStr = "✅ Cuadra";
        else if (esperado > final) estadoStr = `❌ Falta ${esperado - final}`;
        else estadoStr = `⚠️ Sobra ${final - esperado}`;

        dataReporte.push({
            producto: prod,
            inicial: inicial,
            uso: uso,
            esperado: esperado,
            final: final,
            estado: estadoStr
        });
    });

    // Guardar en el historial
    const nuevoReporte = { id, fecha, hora, data: dataReporte };
    historialReportes.push(nuevoReporte);
    localStorage.setItem("historialReportes", JSON.stringify(historialReportes));

    // ACTUALIZAR INTERFAZ
    renderizarTarjetas(); // Crea la tarjeta en la pantalla principal
    mostrarReporteGuardado(nuevoReporte); // Abre el modal con el detalle
};

function mostrarReporteGuardado(reporte) {
    cuadreBody.innerHTML = "";
    modalReporte.style.display = "block";

    // Crear Encabezado
    const header = document.createElement("div");
    header.className = "cuadre-header";
  
    ["Producto", "Inicial", "Uso", "Esperado", "Fin", "Estado"].forEach(text => {
        const span = document.createElement("span");
        span.textContent = text;
        header.appendChild(span);
    });
    cuadreBody.appendChild(header);

    // Filas de productos
    reporte.data.forEach(item => {
        const row = document.createElement("div");
        row.className = "cuadre-item";

        const estadoClass = item.estado.includes("Cuadra") ? "cuadra" : 
                            item.estado.includes("Falta") ? "falta" : "sobra";

        [item.producto, item.inicial, item.uso, item.esperado, item.final, item.estado].forEach((val, idx) => {
            const span = document.createElement("span");
            span.textContent = val;

            // Alinear el nombre del producto a la izquierda, los demás al centro
            if (idx === 0) span.style.textAlign = "left";
            if (idx === 5) span.className = `resultado-cuadre ${estadoClass}`;

            row.appendChild(span);
        });
        cuadreBody.appendChild(row);
    });
}

// Cerrar modales
closeReporte.onclick = () => modalReporte.style.display = "none";
window.addEventListener("click", (e) => {
    if (e.target === modalReporte) modalReporte.style.display = "none";
});
// --- AL FINAL DE TODO TU SCRIPT ---

// Esta función se encarga de que al abrir la web, se lean los datos guardados
document.addEventListener("DOMContentLoaded", () => {
    renderizarTarjetas();
});

// Ajuste en el cierre del modal (para que sea más limpio)
closeReporte.onclick = () => {
    modalReporte.style.display = "none";
};

// Si haces clic fuera del contenido blanco del modal, también se cierra
window.addEventListener("click", (e) => {
    if (e.target === modalReporte) {
        modalReporte.style.display = "none";
    }
});
// Botones para descargar PDF
document.getElementById("btnDescargarPDF_Inicio").onclick = generarPDF;
document.getElementById("btnDescargarPDF_Reporte").onclick = generarPDF;

async function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const rutaLogo = "1762998569035-removebg-preview.png";

    const cargarImagen = (url) => new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });

    let titulo = "REPORTE";
    let filas = [];
    let columnas = [];

    // --- Recolección de datos ---
    const itemsCuadre = cuadreBody.querySelectorAll(".cuadre-item");
    if (itemsCuadre.length > 0 && modalReporte.style.display !== "none") {
        titulo = "REPORTE DE CUADRE";
        columnas = ["Producto", "Inicial", "Uso", "Esperado", "Final", "Estado"];
        itemsCuadre.forEach(item => {
            const spans = Array.from(item.querySelectorAll("span"));
            if (spans.length > 0) {
                const cells = spans.map(s => s.textContent.trim());
                // Separar Estado y número si están juntos
                let estado = "";
                let numero = "";
                if (cells[5]) {
                    const match = cells[5].match(/(Cuadra|Falta|Sobra)/i);
                    estado = match ? match[0] : "";
                    numero = cells[5].replace(/[^0-9]/g, ""); // solo número
                }
                filas.push([
                    cells[0] || "",
                    cells[1] || "",
                    cells[2] || "",
                    cells[3] || "",
                    cells[4] || "",
                    { estado: estado, numero: numero }
                ]);
            }
        });
    } else {
        const itemsResumen = resumenBody.querySelectorAll(".resumen-item");
        if (itemsResumen.length > 0) {
            titulo = document.querySelector("#modalInicio h2")?.textContent || "RESUMEN";
            columnas = ["Producto", "Cantidad"];
            itemsResumen.forEach(item => {
                const nombre = item.querySelector(".producto")?.textContent.trim();
                const cant = item.querySelector(".inicio-stock")?.textContent.trim();
                if (nombre) filas.push([nombre, cant]);
            });
        }
    }

    if (filas.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    // --- Encabezado ---
    try {
        const logoImg = await cargarImagen(rutaLogo);
        doc.addImage(logoImg, 'PNG', 14, 10, 25, 25);
    } catch (e) {
        console.warn("Logo no encontrado, continuando solo con texto.");
    }

    doc.setFontSize(22);
    doc.setTextColor(0);
    doc.text("PACHA SUNSET", 42, 22);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(titulo, 42, 30);

    const ahora = new Date();
    const fechaTexto = ahora.toLocaleDateString();
    const horaTexto = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    doc.setFontSize(9);
    doc.text(`Fecha: ${fechaTexto} | Hora: ${horaTexto}`, 14, 44);

    // --- Tabla ---
    doc.autoTable({
        startY: 48,
        head: [columnas],
        body: filas.map(f => f.map(cell => typeof cell === 'object' ? cell.estado : cell)),
        theme: 'plain',
        headStyles: { fillColor: [0,0,0], textColor: 255, halign: 'center' },
        columnStyles: columnas.reduce((acc, col, i) => {
            acc[i] = { halign: 'center', valign: 'middle' };
            return acc;
        }, {}),
        styles: { fontSize: 9, cellPadding: 3, fontStyle: 'normal' },
        didParseCell: function(data) {
            // Alternar color de fila
            if (data.section === 'body') {
                data.cell.styles.fillColor = (data.row.index % 2 === 0) ? [240,240,240] : [255,255,255];
            }

            // Colorear Estado
            if (data.section === 'body' && columnas.includes("Estado") && data.column.index === columnas.indexOf("Estado")) {
                const estado = filas[data.row.index][5].estado;
                const numero = filas[data.row.index][5].numero;

                // Colores ajustados según tu indicación
                if (estado.includes("Falta")) data.cell.styles.textColor = [231, 76, 60];    // rojo
                if (estado.includes("Sobra")) data.cell.styles.textColor = [255, 140, 0];    // naranja
                if (estado.includes("Cuadra")) data.cell.styles.textColor = [40, 167, 69];   // verde

                data.cell.text = [`${estado} ${numero}`]; // texto limpio + número
                data.cell.styles.fontStyle = 'bold';      // más grueso
            }
        }

    });

    // --- Nombre final ---
    const fechaParaNombre = fechaTexto.replace(/\//g, "-");
    const horaParaNombre = ahora.getHours() + "h" + ahora.getMinutes() + "m";
    const nombreFinal = `PachaSunset_${titulo.replace(/ /g, "_")}_${fechaParaNombre}_${horaParaNombre}.pdf`;

    doc.save(nombreFinal);
}
