const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const fs = require("fs");
const nodemailerConfig = require("../nodemailer-twilio/nodemailerConfig");
const Daos = require("../daos/configDb");

//Clase contenedora de users y carros
let carros = Daos.carritos;
let users = Daos.users;

//Logs
const logs = require("../logs/loggers");
const loggerConsola = logs.getLogger("consola");
const loggerError = logs.getLogger("error");

//Funciones y constantes
function darFecha() {
  const fecha = new Date();
  let fechaOK =
    fecha.getDate() +"/" +(fecha.getMonth() + 1) +" - " +fecha.getHours() +":" +fecha.getMinutes() +":" +fecha.getSeconds();
  return fechaOK;
}


//Sign up
passport.use("local-signup", new LocalStrategy({
  usernameField:"username",
  passwordField:"password",
  passReqToCallback:true
}, async(req, username, password, done)=>{
  //Valido el usuario
    let user = await users.getByUser(username)
    const hash = bcrypt.hashSync(password, saltRounds);
    let avatar = undefined;

    if(user){
        //Error al validar
        loggerConsola.warn("El usuario ya existe");
        return done(null, false);
    } //Usuario valido lo guardo en la base de datos
    
    //Me fijo si subio una imagen
    if (req.file){
      fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1]); //Funcion para agregar extension al archivo subido
      avatar = req.file.filename + '.' + req.file.mimetype.split('/')[1];
    }
    
    //Destructuracion de datos
    let {nombre, direccion, edad, telefono} = req.body;
    //Creo un nuevo carrito para el usuario
    let carrito = { timestamp: darFecha(), productos: []};
    let aux = await carros.save(carrito);
    carrito = aux.id;

    //Guardado en base de datos
    let userNew = await users.save({email: username, password:hash, nombre, direccion, edad, telefono, avatar, carrito})
    
    //Envio de mail al administrador de la pagina
    const mailOptions = {
      from:"Servidor node.js",
      to: "gon.moure@gmail.com",
      subject: "Nuevo registro",
      html : 'Datos del nuevo usuario <br>' + JSON.stringify(userNew)
    }
    const info = await nodemailerConfig.sendMail(mailOptions);

    //TODO OK retorno done con el usuario
    return done(null,userNew)
  }))

  
//Sign in
passport.use("local-login", new LocalStrategy(async (username, password, done)=>{
    //Validacion a la base de datos
    let user = await users.getByUser(username);
    
    if(user){
      if (bcrypt.compareSync(password, user.password)){
        return done(null, user);
      }
    }
    return done(null, false)
    })
  )

//Serializacion
passport.serializeUser((user, done)=>{
    done(null, user.id)
})

//Deserializacion
passport.deserializeUser(async(id, done)=>{
    //Validacion a la base de datos
    let user = await users.getById(id)
    done(null, user)
})
  

module.exports = passport;