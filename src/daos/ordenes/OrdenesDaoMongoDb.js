const ContenedorMongoDB = require ("../../contenedores/ContenedorMongoDb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

class OrdenesDaoMongoDb extends ContenedorMongoDB {

    constructor() {
        super('ordenes',new Schema({
            timestamp: {type: String, required: true},
            productos: {type: Array, required: true},
            estado: {type: String, default:"generada", required: true},
            user: {type: Schema.ObjectId, ref: "users"},
        }))
    }
}

module.exports = OrdenesDaoMongoDb