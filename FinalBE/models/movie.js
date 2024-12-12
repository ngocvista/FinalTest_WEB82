import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    introduce: {
        type: String,
        required: true,
    }
})

const MovieModel = mongoose.model.movie || mongoose.model("movies", movieSchema);

export default MovieModel;