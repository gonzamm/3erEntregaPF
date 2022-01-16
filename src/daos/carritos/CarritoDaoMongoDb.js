const ContenedorMongoDB = require ("../../contenedores/ContenedorMongoDb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

class CarritoDaoMongoDb extends ContenedorMongoDB {

    constructor() {
        super('carritos', new Schema({
            timestamp: {type: String, required: true},
            productos: {type: Array, required: true},
        }));
    }
}

module.exports = CarritoDaoMongoDb
