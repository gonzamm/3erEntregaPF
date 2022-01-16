const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv").config();

//Logs
const logs = require("./src/logs/loggers");
const loggerConsola = logs.getLogger("consola");
const loggerError = logs.getLogger("error");



const app = express();
const PORT = process.env.PORT || 8080;

//MIDLEWARES
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/views'))
app.use(express.json({ extended: true })); // body-parser
app.use(express.urlencoded());

  //Sesiones
app.use(session({
    cookie: { maxAge: 600000 },
    secret:`${process.env.SESSION_SECRET}`,
    resave:false,
    saveUninitialized:false,
    rolling:true
}))
app.use(passport.initialize());
app.use(passport.session());

  //Routes
const produtosRoute = require("./routes/productos");
app.use("/api/productos", produtosRoute);
const carritoRoute = require("./routes/carrito");
app.use("/api/carrito", carritoRoute);
const register = require("./routes/register");
app.use("/register", register);
const login = require("./routes/login");
app.use("/login", login);
const logout = require("./routes/logout");
app.use("/logout", logout);
const ordenes = require("./routes/ordenes");
app.use("/api/ordenes", ordenes)

  //Manejo error 404
app.use((req, res, next) => {
  res.status(404);
  res.send({error: -2, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no implementada`});
});


//Servidor HTTP
const http = require("http");
const server = http.createServer(app);

//Servidor de Socket
const { Server } = require("socket.io");
const { logger } = require("./src/nodemailer-twilio/nodemailerConfig");
const io = new Server(server);

io.on("connection", (socket)=> {
  socket.emit("render", "")
  socket.on("actualizacion", ()=>{
    io.sockets.emit("render", "")
  })
})

//COMIENZO SERVIDOR
server.listen(PORT, () => {
    loggerConsola.info(`Server is run on port ${server.address().port}`)
  })
  server.on('error', error => loggerError.error(`Error en servidor ${error}`))
