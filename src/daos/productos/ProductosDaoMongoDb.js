const ContenedorMongoDB = require ("../../contenedores/ContenedorMongoDb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

class ProductosDaoMongoDb extends ContenedorMongoDB {

    constructor() {
        super('productos',new Schema({
            timestamp: {type: String, required: true},
            nombre: {type: String, required: true},
            descripcion: {type: String, required: true},
            codigo: {type: Number, required: true},
            thumbail: {type: String, required: true},
            precio: {type: Number, required: true},
            stock: {type: Number, required: true}
        }))
    }
}

module.exports = ProductosDaoMongoDb