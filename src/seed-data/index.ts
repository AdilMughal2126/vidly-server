import { connectDB } from "../db/db";
import { Genre } from "../models/genre";
import { Movie } from "../models/movie";
import { movies } from "./data";

void connectDB();

const insertSeedData = async () => {
	console.log(`🌱 Inserting Seed Data: ${movies.length} Movies`);

	for (const movie of movies) {
		console.log(`🎥 Adding Movie: ${movie.title}`);
		const { _id, genre } = await Movie.create(movie);
		console.log(` 📽️  Adding Genre: ${genre.name}`);
		const genreInDb = await Genre.findOne({ name: genre.name });
		if (genreInDb) {
			await Movie.findByIdAndUpdate(_id, {
				$set: { genre: { _id: genreInDb._id, name: genreInDb.name } },
			});
		} else {
			await Genre.insertMany(genre);
		}
	}

	console.log(`✅ Seed Data Inserted: ${movies.length} Movies`);
	process.exit(1);
};

void insertSeedData();
