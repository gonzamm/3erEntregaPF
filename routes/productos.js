const express = require("express");
const Daos = require("../src/daos/configDb");
const middlewares = require("../src/middlewares/middlewares");

const router = express.Router();

let productos = Daos.productos;

//Logs
const logs = require("../src/logs/loggers");
const loggerConsola = logs.getLogger("consola");
const loggerError = logs.getLogger("error");


//FECHA
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
//GET TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
  try {
    let aux = await productos.getAll();
    res.send(aux);
  } catch (error) {
    throw Error("Error en todos los productos");
  }
});

//GET PRODUCTO POR ID
router.get("/:id", async (req, res) => {
  try {
    let ptoId = await productos.getById(req.params.id);
    //Me fijo si existe el PTO con el ID solicitado
    if (Object.keys(ptoId).length != 0) {
      //Pto con ID solicitado encontrado, envio respuesta
      res.send(ptoId);
    } else {
      //Pto con ID solicitado NO encontrado, envio error
      res.status(400);
      res.send({ error: "producto no encontrado" });
    }
  } catch (error) {
    loggerError.error(error)
    throw Error("Error buscando producto por id");
  }
});

//POST CON PTO NUEVO ENVIADO POR PARAMETRO
router.post("/", middlewares.isAdmin, async (req, res) => {
  try {
    //Armo un nuevo PTO con los datos recibidos por parametro y datos locales como fecha
    let { nombre, descripcion, codigo, thumbail, precio, stock } = req.body;
    let newObj = {
      timestamp: darFecha(),
      nombre,
      descripcion,
      codigo,
      thumbail,
      precio,
      stock,
    };
    await productos.save(newObj); //Agrego el producto
    res.send(newObj);
  } catch (error) {
    loggerError.error(error)
    throw Error("Error en post productos");
  }
});

//PUT MODIFICANDO SEGUN ID
router.put("/:id", middlewares.isAdmin, async (req, res) => {
  try {
    //Armo un nuevo PTO con los datos recibidos por parametro
    let { nombre, descripcion, codigo, thumbail, precio, stock } = req.body;
    let ptoMod = {
      id: req.params.id,
      timestamp: darFecha(),
      nombre,
      descripcion,
      codigo,
      thumbail,
      precio,
      stock,
    };
    //Me fijo si existe el PTO con el ID solicitado
    let flag = await productos.getById(req.params.id);
    if (Object.keys(flag).length != 0) {
      //Pto con ID solicitado encontrado
      //Borro el PTO con el ID solicitado, y envio respuesta
      await productos.update(ptoMod);
      res.send(ptoMod);
    } else {
      //Pto con ID solicitado NO encontrado, envio error
      res.status(400);
      res.send({ error: "producto no encontrado" });
    }
  } catch (error) {
    loggerError.error(error)
    throw Error("Error en put modificacion productos");
  }
});

//DELETE SEGUN ID
router.delete("/:id", middlewares.isAdmin, async (req, res) => {
  try {
    //Me fijo si existe el PTO con el ID solicitado
    let flag = await productos.getById(req.params.id);

    if (Object.keys(flag).length != 0) {
      //Pto con ID solicitado encontrado
      //Borro el PTO con el ID solicitado, y envio respuesta
      await productos.deleteById(req.params.id);
      res.send(await productos.getAll());
    } else {
      //PTO con ID no encontrado, envio error
      res.status(400);
      res.send({ error: "producto no encontrado" });
    }
  } catch (error) {
    loggerError.error(error)
    throw Error("Error en el delete por id");
  }
});

//EXPORT MODULO ROUTER
module.exports = router;
