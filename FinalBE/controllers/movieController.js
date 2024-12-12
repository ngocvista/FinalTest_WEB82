import MovieModel from "../models/movie.js";
import multer from 'multer'
import cloudinary from 'cloudinary'

export const getMovies = async (req, res) => {
  try {
    const movies = await MovieModel.find();
    res.send(movies);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const addMovie = async (req, res) => {
  try {
    const { name, time, year, image, introduce } = req.body;
    const movie = await MovieModel.create({
      name,
      time,
      year,
      image,
      introduce,
    });

    res.status(201).json({
      message: "Thêm danh sách phim thành công",
      data: movie,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      data: null,
    });
  }
};

export const searchMovies = async (req, res) => {
  const { keyword } = req.query;
  try {
    const movies = await MovieModel.find({ name: new RegExp(keyword, "i") }); // Tìm phim
    res.status(200).send({
      message: "Tìm kiếm thành công",
      data: movies,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    await MovieModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sortMovies = async (req, res) => {
  try {
    const { order } = req.query;
    const sortOrder = order === "desc" ? -1 : 1; // Xác định thứ tự sắp xếp
    const movies = await MovieModel.find().sort({ year: sortOrder }); // Sắp xếp theo năm
    res.status(500).send({
      message: "Sắp xếp tăng dần hoặc giảm dần",
      data: movies,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, time, year, introduce } = req.body;
    const image = req.file;
    const crrmovie = await MovieModel.findById(id);
    if (!crrmovie) {
      res.status(400).send({
        message: "Not found movie",
        data: null,
      });
    } else {
      if (name) crrmovie.name = name;
      if (time) crrmovie.time = time;
      if (year) crrmovie.year = year;
      if (introduce) crrmovie.introduce = introduce;
    }

    if (image) {
      const dataUrl = `data:${image.mimetype};base64,${image.buffer.toString(
        "base64"
      )}`;
      const result = await cloudinary.uploader.upload(dataUrl, {
        resource_type: "auto",
      });
      crrmovie.image = result.secure_url;
    }
    await crrmovie.save();
    res.status(201).send({
      message: "Updated",
      data: crrmovie,
    });
  } catch (error) {
    res.status(201).send({
      message: error.message,
      data: null,
    });
  }
};

