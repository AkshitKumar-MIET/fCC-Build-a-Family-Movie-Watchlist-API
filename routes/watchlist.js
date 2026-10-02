import express from 'express';
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import { getWatchlist, findById, addMovie, updateMovie, deleteMovie } from '../utils/db.js';

const router = express.Router();

router.get('/:userId', authenticate, (req, res) => {
    const watchlist = getWatchlist(Number(req.params.userId));

    if (watchlist === null) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(watchlist);
});

router.post('/:userId/movies', authenticate, authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const targetUser = findById(userId);
    if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const { title, genre } = req.body;
    if (!title || !genre) {
        return res.status(400).json({ message: "title and genre are required" });
    }

    const movie = addMovie(userId, { title, genre });
    return res.status(201).json({ message: "Movie added", movie });
});

router.put('/:userId/movies/:movieId', authenticate, authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const targetUser = findById(userId);
    if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const movieId = Number(req.params.movieId);
    if (Number.isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie id" });
    }

    const updatedMovie = updateMovie(userId, movieId, req.body);
    if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    return res.status(200).json({ message: "Movie updated", movie: updatedMovie });
});

router.delete('/:userId/movies/:movieId', authenticate, authorizeModification, (req, res) => {
    const userId = Number(req.params.userId);
    const targetUser = findById(userId);
    if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const movieId = Number(req.params.movieId);
    if (Number.isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie id" });
    }

    const deleted = deleteMovie(userId, movieId);
    if (!deleted) {
        return res.status(404).json({ message: "Movie not found" });
    }

    return res.status(200).json({ message: "Movie removed" });
});

export default router;
