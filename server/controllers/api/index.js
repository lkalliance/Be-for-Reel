const router = require("express").Router();

const movieRoutes = require("./movie-routes");
const emailRoutes = require("./email-routes");

router.use("/movies", movieRoutes);
router.use("/email", emailRoutes);

module.exports = router;
