import { Router } from "express";
import { getMovies, addMovie, deleteMovie, updateMovie,searchMovies,sortMovies,upload, uploadMovieImage } from '../controllers/movieController.js';

const MovieRouter = Router();

MovieRouter.get('/', getMovies);
MovieRouter.post('/add', addMovie);
MovieRouter.get('/search', searchMovies);
MovieRouter.delete('/delete/:movieId', deleteMovie);
MovieRouter.get('/sort', sortMovies);
MovieRouter.put('/update/:movieId', upload.single('image'), updateMovie);

export default MovieRouter;