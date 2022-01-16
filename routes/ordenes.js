const express = require("express");
const Daos = require("../src/daos/configDb");
const nodemailerConfig = require("../src/nodemailer-twilio/nodemailerConfig");
const twilioConfig = require("../src/nodemailer-twilio/twilioConfig")
const middlewares = require("../src/middlewares/middlewares");

const router = express.Router();

//Logs
const logs = require("../src/logs/loggers");
const loggerConsola = logs.getLogger("consola");
const loggerError = logs.getLogger("error");


//CLASE CONTENEDORA DE CARRITO Y PRODUCTO
let carros = Daos.carritos;
let ordenes = Daos.ordenes;

//FUNCION FECHA
function darFecha() {
  const fecha = new Date();
  let fechaOK =
    fecha.getDate() +
    "/" +
    (fecha.getMonth() + 1) +
    " - " +
    fecha.getHours() +
    ":" +
    fecha.getMinutes() +
    ":" +
    fecha.getSeconds();
  return fechaOK;
}

//GET TODAS LAS ORDENES
router.get("/", middlewares.isAdmin, async (req, res) => {
  try {
    let aux = await ordenes.getAll();
    res.send(aux);
  } catch (error) {
    loggerError.error(error)
    throw Error("Error en todos los productos");
  }
});

//POST GENERA NUEVA ORDEN SEGUN EL CARRITO
router.post("/:idCarrito", middlewares.isRegister, async (req, res) => {
  try {
    //Busco el carrito con el id enviado por parametro
    let carrito = await carros.getById(req.params.idCarrito);
    if (carrito) {
      const productos = carrito.productos;
      //Armo una nueva orden
      let newObj = {
        timestamp: darFecha(),
        user: req.user.id,
        productos,
      };
      await ordenes.save(newObj); //Agrego la orden

      /*****Envio de mensajes *****/
      //Envio mail al administrador
      const mailOptions = {
        from: "Servidor node.js",
        to: "gon.moure@gmail.com",
        subject: "Nuevo pedido de " + req.user.nombre +" "+ req.user.email,
        html: "Productos solicitados <br>" + JSON.stringify(productos, null, 2),
      };
      const info = await nodemailerConfig.sendMail(mailOptions);
      //Envio whatsapp al administrador
      const whpoptions = {
        body: "Productos solicitados: " + JSON.stringify(productos, null, 2),
        from: "whatsapp:+14155238886",
        to: "whatsapp:+5492996301879",
      };
      const message = await twilioConfig.messages.create(whpoptions);
      //Envio de mensaje al cliente
/*       const sms = await twilioConfig.messages.create({
        body: "Gracias por su compra, estamos procesando su pedido",
        from: "+19383333990",
        to: "+542996301879", //Por ahora este numero para que funcione en twilio. Dsps deberia ser req.user.telefono
      }); */

      /*****Fin de Envio de mensajes *****/

      res.send(newObj);
    } else {
      res.status(400);
      res.send({ error: "Carrito con ID solicitado no existe" });
    }
  } catch (error) {
    loggerError.error(error)
    throw Error(error);
  }
});

//EXPORT MODULO ROUTER
module.exports = router;
