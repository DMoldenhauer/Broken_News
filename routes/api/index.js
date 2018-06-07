var router = require("express").Router();
var fetchRoutes = require("./fetch");
var fetchRoutesR = require("./fetchR");
var headlineRoutes = require("./headlines");
var headlineRoutesR = require("./headlinesR");

router.use("/fetch", fetchRoutes);
router.use("/fetchR", fetchRoutesR);
router.use("/headlines", headlineRoutes);
router.use("/headlinesR", headlineRoutesR);

module.exports = router;
