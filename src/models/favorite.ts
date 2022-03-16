import { model, Schema } from "mongoose";
import { FavoriteType } from "../types/FavoriteType";

export const Favorite = model<FavoriteType>(
	"Favorite",
	new Schema<FavoriteType>({
		user: {
			type: new Schema({
				name: {
					type: String,
					required: true,
				},
			}),
			required: true,
		},
		movie: {
			type: new Schema({
				title: {
					type: String,
					required: true,
				},
				url: {
					type: String,
					required: true,
				},
				voteAverage: {
					type: String,
					required: true,
				},
				likes: {
					type: [{ _id: String }],
				},
			}),
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	})
);