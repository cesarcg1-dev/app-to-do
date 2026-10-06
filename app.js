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

function agregarActividad(texto) {
  const item = document.createElement("li");
  item.textContent = texto;
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

  const guardada = await guardarActividad(texto);
  if (!guardada) return;

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
    return false;
  }
  return true;
}






async function cargarActividades() {
  const { data, error } = await clienteSupabase
    .from("actividades")
    .select("*")
    .order("creada_en", { ascending: true });

  if (error) {
    console.error("Error al cargar:", error);
    return;
  }

  lista.innerHTML = "";
  data.forEach(function (actividad) {
    agregarActividad(actividad.titulo);
  });
}

cargarActividades();
