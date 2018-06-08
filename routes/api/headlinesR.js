var routerR = require("express").Router();
var headlineControllerR = require("../../controllers/headlineR");

routerR.get("/", headlineControllerR.findAll);
routerR.delete("/", headlineControllerR.delete);


module.exports = routerR;


