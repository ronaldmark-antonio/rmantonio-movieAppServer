const express = require("express");
const movieController = require("../controllers/movie");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/addMovie", verify, verifyAdmin, movieController.addMovie);
router.get("/getMovies", movieController.getAllMovies);
router.get("/getMovie/:movieId", movieController.getMovieById);
router.patch("/updateMovie/:movieId", verify, verifyAdmin, movieController.updateMovie);
router.delete("/deleteMovie/:movieId", verify, verifyAdmin, movieController.deleteMovie);
router.patch("/addComment/:movieId", verify, movieController.addMovieComment);
router.get("/getComments/:movieId", verify, movieController.getMovieComments);

module.exports = router;
