import { model, Schema } from "mongoose";
import { BookmarkType } from "../types/BookmarkType";

export const Bookmark = model<BookmarkType>(
	"Bookmark",
	new Schema<BookmarkType>({
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
				bookmarks: {
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
