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

const formulario = document.getElementById("formulario");
const inputTitulo = document.getElementById("titulo");
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
  setTimeout(function () {
    mensaje.textContent = "";
    mensaje.className = "";
  }, 3000);
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
  const guardada = await guardarActividad(texto);
  if (!guardada) return;

  mostrarMensaje("Actividad guardada con éxito.", "exito");
  await cargarActividades();
  inputTitulo.value = "";
  inputTitulo.focus();
});

async function guardarActividad(titulo) {
  const { error } = await clienteSupabase
    .from("actividades")
    .insert({ titulo: titulo });

  if (error) {
    console.error("Error al guardar:", error);
    mostrarMensaje("Error al guardar la actividad.", "error");
    return false;

  }
  return true;
}

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

async function cargarActividades() {
  const { data, error } = await clienteSupabase
    .from("actividades")
    .select("*")
    .order("creada_en", { ascending: true });

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

cargarActividades();
