import { model, Schema } from "mongoose";
import { FavoriteInt } from "../interfaces/FavoriteInt";

export const Favorite = model<FavoriteInt>(
	"Favorite",
	new Schema<FavoriteInt>({
		user: {
			type: new Schema({
				name: {
					type: String,
					required: true,
				},
			}),
			required: true,
		},
		favorites: {
			type: [
				{
					_id: false,
					movieId: String,
					date: {
						type: Date,
						default: Date.now,
					},
				},
			],
			required: true,
		},
	})
);
