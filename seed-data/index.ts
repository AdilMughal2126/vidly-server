import { connectDB } from "../db/db";
import { Genre } from "../models/genre";
import { movies } from "./data";

void connectDB();

const insertSeedData = async () => {
	console.log(`🌱 Inserting Seed Data: ${movies.length} Movies`);

	for (const movie of movies) {
		// console.log(`  🛍️ Adding Movie: ${movie.genres}`);
		const genres = movie.genres.filter(
			async (g) => g !== (await Genre.findOne(g))
		);
		const insertedGenres = await Genre.insertMany(genres);
		console.log({ insertedGenres });
	}
	console.log(`✅ Seed Data Inserted: ${movies.length} Movies`);
	process.exit();
};

void insertSeedData();
