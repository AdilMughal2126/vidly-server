import mongoose from "mongoose";

export type GenreType = {
	_id?: mongoose.Types.ObjectId;
	name: string;
};
