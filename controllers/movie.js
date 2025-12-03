const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const { errorHandler } = require('../auth');

module.exports.addMovie = (req, res) => {

    let newMovie = new Movie({
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        description: req.body.description,
        genre: req.body.genre
    });

    newMovie.save()
    .then(movie => {
        res.status(201).send(movie.toObject());
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllMovies = (req, res) => {

    Movie.find({})
    .then(movies => {

        if (movies.length > 0) {
            return res.status(200).send({ movies });
        } else {
            return res.status(200).send({ message: 'No movies found.' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getMovieById = (req, res) => {

    Movie.findById(req.params.movieId)
    .then(movie => {

        if (movie) {
            return res.status(200).send(movie);
        } else {
            return res.status(404).json({ message: 'Movie not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.updateMovie = (req, res) => {

    let updatedMovie = {
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        description: req.body.description,
        genre: req.body.genre
    };

    Movie.findByIdAndUpdate(req.params.movieId, updatedMovie, { new: true, runValidators: true })
    .then(movie => {

        if (movie) {
            res.status(200).send({
                message: "Movie updated successfully",
                updatedMovie: movie
            });
        } else {
            res.status(404).send({ message: "Movie not found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteMovie = (req, res) => {

    Movie.findByIdAndDelete(req.params.movieId)
    .then(movie => {

        if (movie) {
            return res.status(200).send({
                message: "Movie deleted successfully"
            });
        } else {
            return res.status(404).send({ message: "Movie not found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.addMovieComment = (req, res) => {
    
    const userId = req.user?.id;
    const movieId = req.params.movieId;
    const commentText = req.body.comment;

    if (!commentText || commentText.trim() === "") {
        return res.status(400).send({ error: "Comment is required." });
    }

    Movie.findById(movieId)
    .then(movie => {
        if (!movie) {
            return res.status(404).send({ error: "Movie not found." });
        }

        movie.comments.push({
            userId: userId,
            comment: commentText
        });

        return movie.save();
    })
    .then(updatedMovie => {
        return res.status(200).send({
            message: "Comment added successfully.",
            updatedMovie: updatedMovie
        });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getMovieComments = (req, res) => {

    let movieId = req.params.movieId;

    Movie.findById(movieId)
    .then(movie => {
        
        if (!movie) {
            return res.status(404).send({ error: "Movie not found." });
        }

        return res.status(200).send({ comments: movie.comments });
    })
    .catch(error => errorHandler(error, req, res));
};
