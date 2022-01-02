import express from "express";
import mongoose from "mongoose";
// import Joi from "joi";

const router = express.Router();

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

// const validateGenre = (genre: Object) => {
//   const schema = Joi.object({
//     name: Joi.string().min(5).max(50).required(),
//   });

//   return schema.validate(genre);
// };

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.json(genres);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

export { router as genres };
