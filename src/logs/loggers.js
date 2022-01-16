const log4js = require('log4js');

log4js.configure({
    appenders: {
        miLoggerConsole:{type:"console"},
        miLoggerError: {type: "file", filename:"error.log"},
    },
    categories: {
        default: {appenders:["miLoggerConsole"], level:"info"},
        consola: {appenders:["miLoggerConsole"], level:"trace"},
        error: {appenders:["miLoggerError", "miLoggerConsole"], level:"warn"},
    }
})

module.exports = log4js