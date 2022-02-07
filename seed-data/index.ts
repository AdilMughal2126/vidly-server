import { connectDB } from "../db/db";
import { Genre } from "../models/genre";
import { Movie } from "../models/movie";
import { genres, movies } from "./data";

void connectDB();

/**
 * @todo: insert genres before and update genreId in movies data
 */

const insertSeedData = async () => {
	console.log(`🌱 Inserting Seed Data: ${genres.length} Genres`);
	await Genre.insertMany(genres);

	console.log(`🌱 Inserting Seed Data: ${movies.length} Movies`);
	for (const movie of movies) {
		console.log(` 🎥 Adding Movie: ${movie.title}`);
		await Movie.insertMany(movie);
	}

	console.log(`✅ Seed Data Inserted: ${genres.length} Movies`);
	console.log(`✅ Seed Data Inserted: ${movies.length} Movies`);
	process.exit();
};

void insertSeedData();
