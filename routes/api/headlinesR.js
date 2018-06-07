var routerR = require("express").Router();
var headlineControllerR = require("../../controllers/headlineR");

routerR.get("/", headlineControllerR.findAll);
// router.delete("/:id", headlineControllerR.delete);
// router.put("/:id", headlineControllerR.update);

module.exports = routerR;


