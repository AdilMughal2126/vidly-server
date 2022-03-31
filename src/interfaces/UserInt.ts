import mongoose from "mongoose";

export interface UserInt {
	_id?: mongoose.Types.ObjectId;
	name?: string;
	email: string;
	password: string;
	hash?: string;
	isAdmin?: boolean;
	imageUrl?: string;
	imageId?: string;
	createAt?: Date;
}

export interface UpdatePasswordInt {
	currentPassword: string;
	newPassword: string;
}
