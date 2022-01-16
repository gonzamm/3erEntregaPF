const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ContenedorMongoDB = require ("../../contenedores/ContenedorMongoDb")
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Logs
const logs = require("../../logs/loggers");
const loggerConsola = logs.getLogger("consola");
const loggerError = logs.getLogger("error");


class UsersDaoMongoDb extends ContenedorMongoDB {

    constructor() {
        super('users',new Schema({
            email: {type: String, required: true},
            password: {type: String, required: true},
            nombre: {type: String, required: true},
            direccion: {type: String, required: true},
            edad: {type: Number, required: true},
            telefono: {type: String, required: true},
            avatar: {type: String, default: "8f474fbb3d5be1GGbab2f6629bee0jl4.png", required: false},
            isAdmin: {type: Boolean, default: false, required: true},
            carrito: {type: Schema.ObjectId, ref: "carritos"}
        }))
    }

    async getByUser(username){
        try{
            let docs = false;
            docs = await super.getAll();
            for (const user of docs) {
                if (user.email === username){
                    return user;
                }
            }
            return false;
        }
        catch(error){
            loggerError.error(error)
            throw Error("Error en getByUsername");
        }
    }
}

module.exports = UsersDaoMongoDb