const SUPABASE_URL = "https://jznvgenzkuezhlwwqcqv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6bnZnZW56a3Vlemhsd3dxY3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyODM1NDAsImV4cCI6MjEwNjg1OTU0MH0.GUurSZwQihQBpLxDEeL5vRCwi-3e9vShUl-RXSxPO6M";

const clienteSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/*async function probarConexion() {
  const { data, error } = await clienteSupabase
    .from("actividades")
    .select("*");

  console.log("data:", data);
  console.log("error:", error);
}
probarConexion();
*/

//constantes del Dom//
const formulario = document.getElementById("formulario");
const inputTitulo = document.getElementById("titulo");
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");
const selectorOrden = document.getElementById("orden");
const selectorCategoria = document.getElementById("categoria");
const selectorFiltro = document.getElementById("filtro");
const inputFecha = document.getElementById("fecha");
const selectorPrioridad = document.getElementById("prioridad");
const NOMBRES_PRIORIDAD = { 1: "Alta", 2: "Media", 3: "Baja" };

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
  setTimeout(function () {
    mensaje.textContent = "";
    mensaje.className = "";
  }, 3000);
}

function fechaDeHoy() {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return ahora.getFullYear() + "-" + mes + "-" + dia;
}

function formatearFecha(fecha) {
  const partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

/*function agregarActividad(texto) {
  const item = document.createElement("li");
  item.textContent = texto;
  lista.appendChild(item);
}
*/

function agregarActividad(actividad) {
  const item = document.createElement("li");

  const texto = document.createElement("span");
  texto.textContent = actividad.titulo;

  const casilla = document.createElement("input");
    casilla.type = "checkbox";
    casilla.checked = actividad.completada;
    texto.classList.toggle("completada", actividad.completada);
    casilla.addEventListener("change", function () {
      marcarCompletada(actividad.id, casilla.checked);
    });

  const prioridad = document.createElement("span");
    prioridad.className = "prioridad prioridad-" + actividad.prioridad;
    prioridad.textContent = NOMBRES_PRIORIDAD[actividad.prioridad];

  const etiqueta = document.createElement("span");
  etiqueta.className = "categoria";
  if (actividad.categorias) {
    etiqueta.textContent = actividad.categorias.nombre;
  }

  const fecha = document.createElement("span");
  fecha.className = "fecha";
  if (actividad.fecha_limite) {
    fecha.textContent = "Vence: " + formatearFecha(actividad.fecha_limite);
    const vencida = actividad.fecha_limite < fechaDeHoy() && !actividad.completada;
    fecha.classList.toggle("vencida", vencida);
  }


  const botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";
    botonEditar.className = "editar";
    botonEditar.addEventListener("click", function () {
      const nuevoTitulo = prompt("Edita la actividad:", actividad.titulo);
      if (nuevoTitulo === null || nuevoTitulo.trim() === "") return;
      actualizarActividad(actividad.id, nuevoTitulo.trim());
    });

  const botonEliminar = document.createElement("button");
  botonEliminar.textContent = "Eliminar";
  botonEliminar.addEventListener("click", function () {
    eliminarActividad(actividad.id);
  });

  item.appendChild(casilla);  
  item.appendChild(texto);
  item.appendChild(prioridad);
  item.appendChild(etiqueta);
  item.appendChild(fecha);
  item.appendChild(botonEditar);
  item.appendChild(botonEliminar);
  lista.appendChild(item);
}

/*
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const texto = inputTitulo.value.trim();
  if (texto === "") return;

  agregarActividad(texto);
  inputTitulo.value = "";
  inputTitulo.focus();
});
*/
formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const texto = inputTitulo.value.trim();
  if (texto === "") return;

  mostrarMensaje("Guardando actividad...", "info");
//  const guardada = await guardarActividad(texto);
/*  const guardada = await guardarActividad(
    texto,
    selectorCategoria.value,
    inputFecha.value
  );
*/

  const guardada = await guardarActividad({
      titulo: texto,
      categoria_id: selectorCategoria.value || null,
      fecha_limite: inputFecha.value || null,
      prioridad: Number(selectorPrioridad.value)
    });

if (!guardada) return;

  mostrarMensaje("Actividad guardada con éxito.", "exito");
  await cargarActividades();
  inputTitulo.value = "";
  inputFecha.value = "";
  inputTitulo.focus();
});

/*async function guardarActividad(titulo) {
  const { error } = await clienteSupabase
    .from("actividades")
    .insert({ titulo: titulo });
*/
/*
async function eliminarActividad(id) {
  const { error } = await clienteSupabase
    .from("actividades")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar:", error);
    mostrarMensaje("Error al eliminar la actividad.", "error");
    return;
  }
  mostrarMensaje("Actividad eliminada con éxito.", "exito");
  await cargarActividades();
}
*/

async function guardarActividad(datos) {
  const { error } = await clienteSupabase
    .from("actividades")
    .insert(datos);

  if (error) {
    console.error("Error al guardar:", error);
    mostrarMensaje("Error al guardar la actividad.", "error");
    return false;
  }
  return true;
}

async function actualizarActividad(id, nuevoTitulo) {
  const { error } = await clienteSupabase
    .from("actividades")
    .update({ titulo: nuevoTitulo })
    .eq("id", id);

  if (error) {
    console.error("Error al actualizar:", error);
    mostrarMensaje("Error al actualizar la actividad.", "error");
    return;
  }
  await cargarActividades();
}

async function marcarCompletada(id, completada) {
  const { error } = await clienteSupabase
    .from("actividades")
    .update({ completada: completada })
    .eq("id", id);

  if (error) {
    console.error("Error al marcar:", error);
    mostrarMensaje("No se pudo cambiar el estado", "error");
  }
  await cargarActividades();
}


function aplicarOrden(consulta, criterio) {
  if (criterio === "recientes") {
    return consulta.order("creada_en", { ascending: false });
  }
  if (criterio === "estado") {
    return consulta
      .order("completada", { ascending: true })
      .order("creada_en", { ascending: true });
  }
  if (criterio === "alfabetico") {
    return consulta.order("titulo", { ascending: true });
  }
  return consulta.order("creada_en", { ascending: true });
  if (criterio === "fecha") {
    return consulta
      .order("fecha_limite", { ascending: true, nullsFirst: false })
      .order("creada_en", { ascending: true });
  }
  if (criterio === "prioridad") {
      return consulta
        .order("prioridad", { ascending: true })
        .order("creada_en", { ascending: true });
  }

function aplicarFiltro(consulta, categoriaId) {
  if (categoriaId === "") return consulta;
  if (categoriaId === "sin") return consulta.is("categoria_id", null);
  return consulta.eq("categoria_id", categoriaId);
}

function crearOpcion(categoria) {
  const opcion = document.createElement("option");
  opcion.value = categoria.id;
  opcion.textContent = categoria.nombre;
  return opcion;
}

async function cargarCategorias() {
  const { data, error } = await clienteSupabase
    .from("categorias")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al cargar categorías:", error);
    mostrarMensaje("Error al cargar las categorías.", "error");
    return;
  }

 /* data.forEach(function (categoria) {
    const opcion = document.createElement("option");
    opcion.value = categoria.id;
    opcion.textContent = categoria.nombre;
    selectorCategoria.appendChild(opcion);
  });
*/
  data.forEach(function (categoria) {
    selectorCategoria.appendChild(crearOpcion(categoria));
    selectorFiltro.appendChild(crearOpcion(categoria));
  });

}

async function cargarActividades() {
 /* const { data, error } = await clienteSupabase
    .from("actividades")
    .select("*")
    .order("creada_en", { ascending: true });
*/

//let consulta = clienteSupabase.from("actividades").select("*");
let consulta = clienteSupabase
    .from("actividades")
    .select("*, categorias(nombre)");

  consulta = aplicarFiltro(consulta, selectorFiltro.value);
  consulta = aplicarOrden(consulta, selectorOrden.value);
  //consulta = aplicarOrden(consulta, selectorOrden.value);
  const { data, error } = await consulta;


  if (error) {
    console.error("Error al cargar:", error);
    mostrarMensaje("Error al cargar las actividades.", "error");
    return;
  }

  lista.innerHTML = "";
  data.forEach(function (actividad) {
    agregarActividad(actividad);
  });
}

const ordenGuardado = localStorage.getItem("orden");
if (ordenGuardado !== null) {
  selectorOrden.value = ordenGuardado;
}
cargarActividades();
cargarCategorias();

selectorOrden.addEventListener("change", function () {
  localStorage.setItem("orden", selectorOrden.value);
  cargarActividades();
});

selectorFiltro.addEventListener("change", cargarActividades);

