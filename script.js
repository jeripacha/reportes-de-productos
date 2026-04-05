const historialReportes = JSON.parse(localStorage.getItem("historialReportes")) || [];
// ================== INPUT NUMÉRICO (CELULAR) ==================
function crearInputNumerico(valorInicial, onChange) {
  const input = document.createElement("input");
  input.type = "number";
  input.inputMode = "numeric";
  input.pattern = "[0-9]*";
  input.min = "0";
  input.value = valorInicial || "";
  input.style.width = "100%";
  input.style.textAlign = "center";
  input.style.border = "none";
  input.style.background = "transparent";

  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, "");
    onChange(input.value);
  });

  return input;
}

const sidebar = document.getElementById("sidebar");
const modal = document.getElementById("modal");
const menuBtn = document.getElementById("openMenu");
const modalTitle = document.getElementById("modal-title");
const addProductBtn = document.getElementById("add-product-btn");
const tableBody = document.getElementById("table-body");
const tableHead = document.getElementById("table-head");

const productosBase = [
  "Fernet Buhero","Fernet Branca","Havana Especial 700ml","havana especial 1L","havana 7 años","T olmeca chocolate","T olmeca reposado","Flor de caña 7 años","Flor de caña 5 años",
  "Ron Havana","Beefeater Pink","Gyn Andina","Gyn Frutilla","Gyn Amazónico","Gyn Frutos del Bosque",
  "Cerveza Huari","Cerveza Budweiser","Cerveza Corona","Latas Paceña","Golden",
  "Viuda","Parrales","Casa Real","Agua Pacha","Agua Vital Normal","Agua Vital con Gas",
  "Sens Maracuyá","Sens Achachairú","Sens Limón","Sens Arándano","Sens Cereza",
  "Sens Açaí","Vodka 1825","Tequila Jose Cuervo","Jager","Tres plumas chocolate blanco",
  "Tres plumas chocolate","Tres plumas amareto","Tres plumas menta","Black Label 750 ml",
  "Red Label","Black Label 1L","Altosama","Coca-Cola 3L","Sprite 3L","Coca-Cola 2L",
  "Sprite 2L","Simba Pomelo","Monster","Red Bull","Agua Tónica 900 ml","Ginger 900 ml","Ginger 1.5L",
  "Pura Vida","Sprite 2.5L","Blue Curacao","Granadina","Cocalero","Chivas","Harry el limonero",
  "Supay","Limoncello","Camel 2 click Grande","Camel 2 click Pequeño",
  "Camel 1 click Grande","Camel 1 click Pequeño","Arancello","Tundiqui"
];

const productosMesas = [
  "Parrales","Monster","Red Bull","Jager","Viuda","Gyn Amazónico","Havana Especial 700ml","Fernet Buhero",
  "Coca-Cola 2L","Ginger 1.5L","Simba Pomelo","Vodka 1825","Agua Tónica 900 ml"
];

const productosAreas = {
  "Basines": ["Blue Curacao","Parrales","Sprite 3L"],
  "Cumpleaños": ["Blue Curacao","Parrales","Sprite 3L"],
  "Vasos": ["Fernet Buhero","Parrales","Flor de caña 5 años","Flor de caña 7 años","Viuda","Agua Vital Normal","Agua Vital con Gas","Ginger 1.5L","Coca-Cola 3L","Sprite 3L","Simba Pomelo","Blue Curacao","Agua Tónica 900 ml","Jager","Pura Vida","Gyn Amazónico","Vodka 1825","Tequila Jose Cuervo"]
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
const ventasBtn = document.getElementById("ventasBtn");




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
    ventasBtn.style.display = "none"; // <-- Aseguramos que ventas se oculte también
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
          const inputConteo = crearInputNumerico(
            dataGuardada[`${prod}_conteo`],
            (valor) => {
              dataGuardada[`${prod}_conteo`] = valor;
              localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
            }
          );
          tdConteo.appendChild(inputConteo);

          const tdIngreso = document.createElement("td");
          const inputIngreso = crearInputNumerico(
            dataGuardada[`${prod}_ingreso`],
            (valor) => {
              dataGuardada[`${prod}_ingreso`] = valor;
              localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
            }
          );
          tdIngreso.appendChild(inputIngreso);


        row.appendChild(tdNombre);
        row.appendChild(tdConteo);
        row.appendChild(tdIngreso);
        tableBody.appendChild(row);
      });
      return;
    }
      // ------------------ ÁREAS ------------------
      if (title.includes("Áreas")) {
        Object.keys(productosAreas).forEach(area => {

          // Fila título del área
          const catRow = document.createElement("tr");
          const catCell = document.createElement("td");
          catCell.colSpan = 4;
          catCell.textContent = area;
          catCell.style.fontWeight = "bold";
          catCell.style.background = "#ffcccb";
          catCell.style.textAlign = "center";
          catRow.appendChild(catCell);
          tableBody.appendChild(catRow);

          // Encabezados
          const headerRow = document.createElement("tr");
          ["Producto", "Entrega", "Devolución", "Uso"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
          });
          tableBody.appendChild(headerRow);

          productosAreas[area].forEach(prod => {
            const row = document.createElement("tr");

            // Producto
            const tdNombre = document.createElement("td");
            tdNombre.textContent = prod;

            // USO (solo lectura)
            const tdUso = document.createElement("td");
            tdUso.textContent = dataGuardada[`${area}_${prod}_uso`] || "0";
            tdUso.style.fontWeight = "600";
            tdUso.style.textAlign = "center";


            const calcularUso = (entrega, devolucion) => {
              const uso = (Number(entrega) || 0) - (Number(devolucion) || 0);
              tdUso.textContent = uso;
              dataGuardada[`${area}_${prod}_uso`] = uso;
              localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
            };



            // Entrega
            const tdEntrega = document.createElement("td");
            const inputEntrega = crearInputNumerico(
              dataGuardada[`${area}_${prod}_entrega`] || "",
              (valor) => {
                dataGuardada[`${area}_${prod}_entrega`] = Number(valor) || 0;
                localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
                calcularUso(
                  dataGuardada[`${area}_${prod}_entrega`],
                  dataGuardada[`${area}_${prod}_devolucion`] || 0
                );
              }
            );
            tdEntrega.appendChild(inputEntrega);

            // Devolución
            const tdDevolucion = document.createElement("td");
            const inputDevolucion = crearInputNumerico(
              dataGuardada[`${area}_${prod}_devolucion`] || "",
              (valor) => {
                dataGuardada[`${area}_${prod}_devolucion`] = Number(valor) || 0;
                localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
                calcularUso(
                  dataGuardada[`${area}_${prod}_entrega`] || 0,
                  dataGuardada[`${area}_${prod}_devolucion`]
                );
              }
            );
            tdDevolucion.appendChild(inputDevolucion);


            // Armar fila
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

          // Producto (select)
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

          // Cantidad (input numérico)
          const tdCantidad = document.createElement("td");
          const inputCantidad = crearInputNumerico(
            item.cantidad || "",
            (valor) => {
              const prodSeleccionado = select.value;
              dataGuardada[`cortesias_${prodSeleccionado}`] = valor;
              item.nombre = prodSeleccionado;
              item.cantidad = valor;

              localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
              localStorage.setItem("productosCortesiasDinamicos", JSON.stringify(productosCortesiasDinamicos.map(p => ({nombre: p.nombre, cantidad: p.cantidad}))));
            }
          );
          tdCantidad.appendChild(inputCantidad);

          // Evento select
          select.addEventListener("change", () => {
            const valor = inputCantidad.value;
            const prodSeleccionado = select.value;
            dataGuardada[`cortesias_${prodSeleccionado}`] = valor;
            item.nombre = prodSeleccionado;
            item.cantidad = valor;

            localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
            localStorage.setItem("productosCortesiasDinamicos", JSON.stringify(productosCortesiasDinamicos.map(p => ({nombre: p.nombre, cantidad: p.cantidad}))));
          });

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

            const input = crearInputNumerico(
              dataGuardada[`${prod}_final_${i}`],
              (valor) => {
                dataGuardada[`${prod}_final_${i}`] = valor;
                localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
              }
            );

            td.appendChild(input);
            row.appendChild(td);
          }

        tableBody.appendChild(row);
      });

      clearDataBtn.style.display = "block";
      inicioBtn.style.display = "block";
      usoBtn.style.display = "block";
      finalBtn.style.display = "block";
      reporteBtn.style.display = "block";
      ventasBtn.style.display = "block";


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
        const inputCantidad = crearInputNumerico(
          dataGuardada[`${prod}_${tipoRegistro}`] || "",
          (valor) => {
            dataGuardada[`${prod}_${tipoRegistro}`] = valor;
            localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
          }
        );
        tdCantidad.appendChild(inputCantidad);

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
    const inputCantidad = crearInputNumerico("", (valor) => {
        const prodSeleccionado = select.value;
        item.nombre = prodSeleccionado;
        item.cantidad = valor;

        // Guardar en dataGuardada
        dataGuardada[`cortesias_${prodSeleccionado}`] = valor;

        localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
        localStorage.setItem("productosCortesiasDinamicos", JSON.stringify(productosCortesiasDinamicos.map(p => ({nombre: p.nombre, cantidad: p.cantidad}))));
    });
    tdCantidad.appendChild(inputCantidad);

    // Crear el objeto item **antes de cualquier cambio**
    const item = { row, nombre: select.value, cantidad: inputCantidad.value || "0" };

    // Guardar valor inicial inmediatamente
    dataGuardada[`cortesias_${item.nombre}`] = item.cantidad;
    productosCortesiasDinamicos.push(item);
    localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
    localStorage.setItem("productosCortesiasDinamicos", JSON.stringify(productosCortesiasDinamicos.map(p => ({nombre: p.nombre, cantidad: p.cantidad}))));

    // Actualizar cuando cambie el select
    select.addEventListener("change", () => {
        const prodSeleccionado = select.value;
        item.nombre = prodSeleccionado;
        item.cantidad = inputCantidad.value || "0";
        dataGuardada[`cortesias_${prodSeleccionado}`] = item.cantidad;

        localStorage.setItem("dataGuardada", JSON.stringify(dataGuardada));
        localStorage.setItem("productosCortesiasDinamicos", JSON.stringify(productosCortesiasDinamicos.map(p => ({nombre: p.nombre, cantidad: p.cantidad}))));
    });

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

    // Áreas
    Object.keys(productosAreas).forEach(area => {
      if (productosAreas[area].includes(prod)) {
        totalUso += parseInt(dataGuardada[`${area}_${prod}_uso`] || 0);
      }
    });

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
ventasBtn.onclick = () => {
  resumenBody.innerHTML = "";

  productosBase.forEach(prod => {
    const ventas = Number(dataGuardada[`${prod}_ventas`]) || 0;

    if (ventas > 0) {
      const item = document.createElement("div");
      item.className = "resumen-item";
      item.innerHTML = `
        <span class="producto">${prod}</span>
        <span class="inicio-stock">${ventas}</span>
      `;
      resumenBody.appendChild(item);
    }
  });

  document.querySelector("#modalInicio h2").textContent = "VENTAS POR PRODUCTO";
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

  /* ===============================
     VALIDACIÓN
  =============================== */
  const checkboxes = document.querySelectorAll(".select-reporte:checked");
  if (checkboxes.length === 0) {
    alert("Selecciona al menos un reporte para consolidar.");
    return;
  }

  /* ===============================
     CONSOLIDACIÓN DE DATOS
  =============================== */
  const usoCons = {}, ingrCons = {}, faltCons = {};

  productosBase.forEach(p => {
    usoCons[p] = 0;
    ingrCons[p] = 0;
    faltCons[p] = 0;
  });

  checkboxes.forEach(cb => {
    const rep = historialReportes[cb.dataset.index];
    rep.data.forEach(item => {
      usoCons[item.producto] += item.uso || 0;
      ingrCons[item.producto] += item.ingreso || 0;
      faltCons[item.producto] += (item.final || 0) - (item.esperado || 0);
    });
  });

  const filasPrincipal = productosBase
    .filter(p => usoCons[p] > 0 || ingrCons[p] > 0 || faltCons[p] !== 0)
    .map(p => [p, ingrCons[p], usoCons[p]]);

  const datosUso = productosBase.filter(p => usoCons[p] >= 50).map(p => [p, usoCons[p]]);
  const datosPedidos = productosBase.filter(p => ingrCons[p] >= 80).map(p => [p, ingrCons[p]]);
  const descuadres = productosBase
    .filter(p => faltCons[p] !== 0)
    .map(p => [p, Math.abs(faltCons[p]), faltCons[p] < 0 ? "FALTA" : "SOBRA"]);

  /* ===============================
     FECHAS Y UTILIDADES
  =============================== */
  const { jsPDF } = window.jspdf;
  const ahora = new Date();

  const fechaInput = document.getElementById("fechaReporte")?.value;
  const fechaBase = fechaInput ? new Date(fechaInput + "T12:00:00") : ahora;
  const fechaTextoMes = fechaBase
    .toLocaleDateString("es-ES", { month: "long", year: "numeric" })
    .toUpperCase()
    .replace(" DE ", " ");

  const rutaLogo = "1762998569035-removebg-preview.png";

  const cargarImagen = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

  let logoImg = null;
  try { logoImg = await cargarImagen(rutaLogo); } catch {}

  function encabezado(doc, titulo) {
    if (logoImg) doc.addImage(logoImg, "PNG", 10, 4, 40, 40);
    doc.setFontSize(22).setFont("helvetica", "bold").text("PACHA SUNSET", 42, 22);
    doc.setFontSize(13).text(titulo, 42, 30);

    const w = doc.internal.pageSize.getWidth();
    doc.setFontSize(14).setFont(undefined, "bold");
    doc.text(
      `${fechaTextoMes}\nHora: ${ahora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      w - 14,
      22,
      { align: "right" }
    );
  }

  /* ===============================
     PDF 1 — BALANCE GENERAL
  =============================== */
  const pdfBalance = new jsPDF();
  encabezado(pdfBalance, "BALANCE GENERAL DE INVENTARIO");

  pdfBalance.autoTable({
    startY: 48,
    head: [["Producto", "Pedidos", "Consumo"]],
    body: filasPrincipal,
    theme: "plain",
    headStyles: {
      fillColor: [0,0,0],
      textColor: 255,
      halign: "center",
      fontSize: 15,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { halign: "center", valign: "middle", fontSize: 15 },
      1: { halign: "center", valign: "middle", fontSize: 18, fontStyle: "bold" },
      2: { halign: "center", valign: "middle", fontSize: 18, fontStyle: "bold" }
    },
    styles: { cellPadding: 4 }
  });

  pdfBalance.save(`Balance_General_${fechaTextoMes}.pdf`);

  /* ===============================
     PDF 2 — ROTACIÓN Y ABASTECIMIENTO
  =============================== */
  const pdfRotacion = new jsPDF();
  encabezado(pdfRotacion, "ROTACIÓN Y ABASTECIMIENTO");

  let y = 48;

  if (datosUso.length > 0) {
    pdfRotacion.autoTable({
      startY: y,
      head: [["Producto de Alta Rotación", "Consumo"]],
      body: datosUso,
      theme: "plain",
      headStyles: {
        fillColor: [41,128,185],
        textColor: 255,
        halign: "center",
        fontSize: 15,
        fontStyle: "bold"
      },
      columnStyles: {
        0: { halign: "center", valign: "middle", fontSize: 16 },
        1: { halign: "center", valign: "middle", fontSize: 18, fontStyle: "bold" }
      },
      styles: { cellPadding: 4 }
    });
    y = pdfRotacion.lastAutoTable.finalY + 12;
  }

  if (datosPedidos.length > 0) {
    pdfRotacion.autoTable({
      startY: y,
      head: [["Producto Abastecido", "Pedidos"]],
      body: datosPedidos,
      theme: "plain",
      headStyles: {
        fillColor: [52,73,94],
        textColor: 255,
        halign: "center",
        fontSize: 15,
        fontStyle: "bold"
      },
      columnStyles: {
        0: { halign: "center", valign: "middle", fontSize: 16 },
        1: { halign: "center", valign: "middle", fontSize: 18, fontStyle: "bold" }
      },
      styles: { cellPadding: 4 }
    });
  }

  pdfRotacion.save(`Rotacion_Abastecimiento_${fechaTextoMes}.pdf`);

  /* ===============================
     PDF 3 — AUDITORÍA DE FALTANTES
  =============================== */
  const pdfAuditoria = new jsPDF();
  encabezado(pdfAuditoria, "AUDITORÍA DE INVENTARIO");

  pdfAuditoria.autoTable({
    startY: 48,
    head: [["Producto", "Diferencia", "Estado"]],
    body: descuadres.length ? descuadres : [["Sin novedades", "0", "CUADRA"]],
    theme: "plain",
    headStyles: {
      fillColor: [0,0,0],
      textColor: 255,
      halign: "center",
      fontSize: 15,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { halign: "center", valign: "middle", fontSize: 15 },
      1: { halign: "center", valign: "middle", fontSize: 18, fontStyle: "bold" },
      2: { halign: "center", valign: "middle", fontSize: 16, fontStyle: "bold" }
    },
    styles: { cellPadding: 4 },
    didParseCell(data) {
      if (data.section === "body" && data.column.index === 2) {
        if (data.cell.raw === "FALTA") data.cell.styles.textColor = [231,76,60];
        if (data.cell.raw === "SOBRA") data.cell.styles.textColor = [255,140,0];
        if (data.cell.raw === "CUADRA") data.cell.styles.textColor = [40,167,69];
      }
    }
  });

  const totalFaltas = productosBase.reduce(
    (acc, p) => acc + (faltCons[p] < 0 ? Math.abs(faltCons[p]) : 0),
    0
  );

  let fy = pdfAuditoria.lastAutoTable.finalY + 12;

  pdfAuditoria.setDrawColor(0);
  pdfAuditoria.setFillColor(240,240,240);
  pdfAuditoria.rect(14, fy, 182, 30, "FD");

  pdfAuditoria.setFontSize(14).setFont(undefined, "bold")
    .text("VEREDICTO DE AUDITORÍA:", 20, fy + 10);

  pdfAuditoria.setFontSize(12).setFont(undefined, "normal");
  pdfAuditoria.text(
    totalFaltas === 0
      ? "EXCELENTE: Gestión operativa impecable. Inventario sin pérdidas."
      : `ATENCIÓN: Se detectó un faltante total de ${totalFaltas} unidades.`,
    20,
    fy + 20
  );

  pdfAuditoria.save(`Auditoria_Faltantes_${fechaTextoMes}.pdf`);
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
   const fechaInput = document.getElementById("fechaReporte").value;

   // Fecha base elegida por el usuario (o hoy si no puso nada)
   const fechaBase = fechaInput
     ? new Date(fechaInput + "T12:00:00")
     : new Date();

   const fecha = fechaBase.toLocaleDateString();
   const hora = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
   const id = `${Date.now()}`;


    const dataReporte = [];
  productosBase.forEach(prod => {
      // Separamos los valores para no perder el dato del ingreso
      const conteoFisicoInicial = (parseInt(dataGuardada[`${prod}_conteo`]) || 0);
      const ingresoNuevo = (parseInt(dataGuardada[`${prod}_ingreso`]) || 0);

      // El inicial total para el cálculo del cuadre sigue siendo la suma de ambos
      const inicialTotalCalculo = conteoFisicoInicial + ingresoNuevo;

      // ------------------- USO -------------------
      let uso = (parseInt(dataGuardada[`${prod}_ventas`]) || 0) + 
                (parseInt(dataGuardada[`${prod}_mesas`]) || 0) + 
                (parseInt(dataGuardada[`cortesias_${prod}`]) || 0);

      Object.keys(productosAreas).forEach(area => {
          if (productosAreas[area].includes(prod)) {
              uso += parseInt(dataGuardada[`${area}_${prod}_uso`] || 0);
          }
      });

      // ------------------- FIN -------------------
      let final = 0;
      for (let i = 0; i < 5; i++) {
          final += parseInt(dataGuardada[`${prod}_final_${i}`]) || 0;
      }

      const esperado = inicialTotalCalculo - uso;
      let estadoStr = "";
      if (esperado === final) estadoStr = "✅ Cuadra";
      else if (esperado > final) estadoStr = `❌ Falta ${esperado - final}`;
      else estadoStr = `⚠️ Sobra ${final - esperado}`;

      // GUARDAMOS EL REPORTE
      dataReporte.push({
          producto: prod,
          conteoInicialSolo: conteoFisicoInicial, // Guardamos el inicio puro
          ingreso: ingresoNuevo,                 // <--- AQUÍ GUARDAMOS EL INGRESO SOLO
          inicial: inicialTotalCalculo,          // La suma (para el reporte diario)
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
  const ahora = new Date(); // ← AGREGA SOLO ESTO
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
        titulo = "REPORTE DE VERIFICACIÓN DE STOCK";
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
          titulo = document.querySelector("#modalInicio h2")?.textContent || "RESUMEN";
          columnas = ["Producto", "Cantidad"];

          productosBase.forEach(prod => {
              let cantidad = 0;

             // LÓGICA DE VENTAS (Añadida para que se vea en el PDF)
             if (titulo.includes("VENTAS")) {
                 cantidad = Number(dataGuardada[`${prod}_ventas`]) || 0;
             } 
             else if (titulo.includes("INICIAL")) {
                 cantidad = (Number(dataGuardada[`${prod}_conteo`]) || 0) + (Number(dataGuardada[`${prod}_ingreso`]) || 0);
             }

              else if (titulo.includes("USO")) {
                  cantidad += Number(dataGuardada[`${prod}_ventas`]) || 0;
                  cantidad += Number(dataGuardada[`${prod}_mesas`]) || 0;
                  cantidad += Number(dataGuardada[`cortesias_${prod}`]) || 0;

                  Object.keys(productosAreas).forEach(area => {
                      if (productosAreas[area].includes(prod)) {
                          cantidad += Number(dataGuardada[`${area}_${prod}_uso`]) || 0;
                      }
                  });
              }

              else if (titulo.includes("FINAL")) {
                  for (let i = 0; i < 5; i++) {
                      cantidad += Number(dataGuardada[`${prod}_final_${i}`]) || 0;
                  }
              }

              // 👉 AQUÍ LA CLAVE: se agrega aunque sea 0
              filas.push([prod, cantidad]);
          });
      }


    if (filas.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    // --- Encabezado ---
    try {
        const logoImg = await cargarImagen(rutaLogo);
       doc.addImage(logoImg, 'PNG', 10, 4, 40, 40);

    } catch (e) {
        console.warn("Logo no encontrado, continuando solo con texto.");
    }

    doc.setFontSize(22);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("PACHA SUNSET", 42, 22);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(titulo, 42, 30);

  const fechaInput = document.getElementById("fechaReporte").value;

  // Si no eliges fecha, usar la de hoy como respaldo
  const fechaBase = fechaInput 
  ? new Date(fechaInput + "T12:00:00") 
  : new Date();


  const fechaTexto = fechaBase.toLocaleDateString();
  const horaTexto = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

   const pageWidth = doc.internal.pageSize.getWidth();

   doc.setFontSize(15);
   doc.setFont(undefined, 'bold');
   doc.text(
       `Fecha: ${fechaTexto}\nHora: ${horaTexto}`,
       pageWidth - 14, // margen derecho
       20,
       { align: 'right' }
   );
   doc.setFont(undefined, 'normal');


    // --- Tabla ---
   doc.autoTable({
     startY: 48,
     head: [columnas],
     body: filas.map(f => f.map(cell => typeof cell === 'object' ? cell.estado : cell)),
     theme: 'plain',
     headStyles: { 
         fillColor: [0,0,0],    // fondo negro
         textColor: 255,        // texto blanco
         halign: 'center',
         fontSize: 15,           // <- tamaño del encabezado
         fontStyle: 'bold'       // <- negrita
     },
     columnStyles: columnas.reduce((acc, col, i) => {
         acc[i] = { halign: 'center', valign: 'middle' };
         return acc;
     }, {}),
     styles: { fontSize: 9, cellPadding: 3, fontStyle: 'normal' },

      
        didParseCell: function(data) {
          // Agrandar los números de cuadre
          if (data.section === 'body' && modalReporte.style.display !== "none") {
              const colsNumeros = ["Inicial", "Uso", "Esperado", "Final"];
              if (colsNumeros.includes(columnas[data.column.index])) {
                  data.cell.styles.fontSize = 17; // Tamaño que quieras
               
              }
          }

          // --- Agrandar el nombre del producto ---
          if (
              data.section === 'body' &&
              columnas.includes("Producto") &&
              data.column.index === columnas.indexOf("Producto")
          ) {
              data.cell.styles.fontSize = 14;   // tamaño del nombre
            
          }

          // 👉 SOLO agrandar el número de la columna "Cantidad"
          if (
              data.section === 'body' &&
              columnas.includes("Cantidad") &&
              data.column.index === columnas.indexOf("Cantidad")
          ) {
              data.cell.styles.fontSize = 17;   // ← tamaño del número
              
          }

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
               data.cell.styles.fontSize = 17;  // <- aquí agrandas
            }
        }

    });

    // --- Nombre final ---
  const fechaParaNombre = fechaBase.toISOString().split("T")[0];
    const horaParaNombre = ahora.getHours() + "h" + ahora.getMinutes() + "m";
    const nombreFinal = `PachaSunset_${titulo.replace(/ /g, "_")}_${fechaParaNombre}_${horaParaNombre}.pdf`;

    doc.save(nombreFinal);
}
