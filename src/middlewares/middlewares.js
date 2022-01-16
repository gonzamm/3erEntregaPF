module.exports = {
    isAdmin: function(req, res, next){
        if(req.user === undefined){
            res.redirect("/login.html");
        }else{
            if(req.user.isAdmin){
                next()
            } else {
                res.status(403);
                res.send({error: -1, descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizada`});
            }
        }
    },
    isRegister: function(req,res,next){
        if (req.user === undefined){
            res.redirect("/login.html")
        } else {
            next();
        }
    }
}