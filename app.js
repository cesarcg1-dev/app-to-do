   console.log("app.js cargado");

const formulario = document.getElementById("formulario");
const inputTitulo = document.getElementById("titulo");
const lista = document.getElementById("lista");

function agregarActividad(texto) {
  const item = document.createElement("li");
  item.textContent = texto;
  lista.appendChild(item);
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const texto = inputTitulo.value.trim();
  if (texto === "") return;

  agregarActividad(texto);
  inputTitulo.value = "";
  inputTitulo.focus();
});