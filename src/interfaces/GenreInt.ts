import mongoose from "mongoose";

export interface GenreInt {
	_id?: mongoose.Types.ObjectId;
	name: string;
}
