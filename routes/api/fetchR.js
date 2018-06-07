var routerR = require("express").Router();
var fetchControllerR = require("../../controllers/fetchR");

routerR.get("/", fetchControllerR.scrapeHeadlinesR);

module.exports = routerR;

