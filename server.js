const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const colores = [
  '#00FFCC', // turquesa claro
  '#66FF66', // verde claro
  '#FF66CC', // rosa suave
  '#66CCFF', // azul cielo
  '#FFFF66', // amarillo pastel
  '#FF9966', // naranja suave
  '#CC99FF', // lila claro
  '#FFCCCC'  // rosado pastel
];

const usuarios = {};
const historialMensajes = []; //Aquí se guardan los mensajes

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Un usuario se conectó:', socket.id);

  socket.on('nuevo_usuario', (nombre) => {
    const color = colores[Object.keys(usuarios).length % colores.length];
    usuarios[socket.id] = { nombre, color };
    console.log(`${nombre} se ha conectado con el color ${color}`);

    // Enviar el historial de mensajes al nuevo usuario
    historialMensajes.forEach((mensaje) => {
      socket.emit('mensaje_chat', mensaje);
    });
  });

  socket.on('mensaje_chat', (msg) => {
    const user = usuarios[socket.id];
    if (user) {
      const mensajeFormateado = {
        nombre: user.nombre,
        color: user.color,
        mensaje: escaparHTML(msg)
      };

      // Guardar en el historial
      historialMensajes.push(mensajeFormateado);

      // Emitir a todos
      io.emit('mensaje_chat', mensajeFormateado);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', usuarios[socket.id]?.nombre || socket.id);
    delete usuarios[socket.id];
  });
});

function escaparHTML(texto) {
  return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

server.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
