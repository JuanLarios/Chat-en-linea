const socket = io();

let nombre = '';
const loginDiv = document.getElementById('login');
const chatDiv = document.getElementById('chat');
const inputNombre = document.getElementById('nombre-usuario');
const botonIngresar = document.getElementById('ingresar');

const formulario = document.getElementById('formulario-chat');
const inputMensaje = document.getElementById('mensaje');
const chatBox = document.getElementById('chat-box');

// Cuando el usuario hace clic en "Entrar al chat"
botonIngresar.addEventListener('click', () => {
  const nombreIngresado = inputNombre.value.trim();
  if (nombreIngresado) {
    nombre = nombreIngresado;
    socket.emit('nuevo_usuario', nombre);
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'block';
  }
});

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const mensaje = inputMensaje.value.trim();
  if (mensaje) {
    socket.emit('mensaje_chat', mensaje);
    inputMensaje.value = '';
  }
});

socket.on('mensaje_chat', (data) => {
  const mensajeDiv = document.createElement('div');
  mensajeDiv.innerHTML = `<strong style="color:${data.color}">${data.nombre}:</strong> ${data.mensaje}`;
  chatBox.appendChild(mensajeDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});
