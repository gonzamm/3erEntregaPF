const express = require("express");
const multer  = require('multer')
const upload = multer({ dest: 'public/avatars/' })

const app = express();
const { Router } = express;
const router = new Router();
const passportConfig = require("../src/passport/passportConfig")

//POST REGISTER LOCALSIGNUP
router.post("/", upload.single('avatar'), passportConfig.authenticate("local-signup",{
    successRedirect:"/login.html",
    failureRedirect:"/registerError.html"
}))

//EXPORT MODULO ROUTER
module.exports = router;
