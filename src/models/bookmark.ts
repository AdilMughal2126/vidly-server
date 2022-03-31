import { model, Schema } from "mongoose";
import { BookmarkInt } from "../interfaces/BookmarkInt";

export const Bookmark = model<BookmarkInt>(
	"Bookmark",
	new Schema<BookmarkInt>({
		user: {
			type: new Schema({
				name: {
					type: String,
					required: true,
				},
			}),
			required: true,
		},
		bookmarks: {
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
