const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

//Logs
const logs = require("../logs/loggers");
const loggerConsola = logs.getLogger("consola");
const loggerError = logs.getLogger("error");

//Funciones utiles
const asPOJO = (obj) => JSON.parse(JSON.stringify(obj));

const renameField = (record, from, to) => {
  record[to] = record[from];
  delete record[from];
  return record;
};
const removeField = (record, field) => {
  const value = record[field];
  delete record[field];
  return value;
};

//Conexion a la base de datos

const main = () => {
  const conexion = `mongodb+srv://${process.env.USERPASSMONGO}@clustercoderhouse.jxmzx.mongodb.net/ecommerce?retryWrites=true&w=majority`;
  mongoose.connect(conexion);
  mongoose.connection.on("open", () => {
    loggerConsola.info("Base de datos conectada con exito!!")
  });
  mongoose.connection.on("error", () => {
    loggerError.error("Error al conectarse a la base de datos!!")
  });
};
main();

//Comienzo clase Contenedor
class ContenedorMongoDB {
  constructor(name, esquema) {
    this.coleccion = mongoose.model(name, esquema);
  }

  async save(nuevoElem) {
    try {
      let doc = await this.coleccion.create(nuevoElem);
      doc = asPOJO(doc);
      renameField(doc, "_id", "id");
      removeField(doc, "__v");
      return doc;
    } catch (error) {
      loggerError.error(error)
      throw Error("Error en el save");
    }
  }

  async getById(num) {
    try {
      let docs = false;
      docs = await this.coleccion.findOne({ _id: num }, { __v: 0 });
      if (docs) {
        const result = renameField(asPOJO(docs), "_id", "id");
        return result;
      } else {
        return false;
      }
    } catch (error) {
      loggerError.error(error)
      throw Error("Error en el getById");
    }
  }

  async getAll() {
    try {
      let docs = await this.coleccion.find({}, { __v: 0 }).lean();
      docs = docs.map(asPOJO);
      docs = docs.map((d) => renameField(d, "_id", "id"));
      return docs;
    } catch (error) {
      loggerError.error(error)
      throw Error("Error en el getAll");
    }
  }

  async deleteById(num) {
    try {
      const item = await this.coleccion.findOneAndDelete({ _id: num });
      if (item) {
        return item;
      } else {
        return { err: "Error en item, id no encontrado" };
      }
    } catch (error) {
      loggerError.error(error)
      throw Error("Error en el deleteById");
    }
  }

  async deleteAll() {
    try {
      await this.coleccion.deleteMany({});
      return { msg: "Todos los productos borrados" };
    } catch (error) {
      loggerError.error(error)
      throw Error("Error en el deleteAll()");
    }
  }

  async update(nuevoElem) {
    try {
      renameField(nuevoElem, "id", "_id");
      const { n, nModified } = await this.coleccion.replaceOne(
        { _id: nuevoElem._id },
        nuevoElem
      );
      if (n == 0 || nModified == 0) {
        throw new Error("Error al actualizar: no encontrado");
      } else {
        renameField(nuevoElem, "_id", "id");
        removeField(nuevoElem, "__v");
        return asPOJO(nuevoElem);
      }
    } catch (error) {
      loggerError.error(error)
      throw Error("Error en el update");
    }
  }
}

module.exports = ContenedorMongoDB;
