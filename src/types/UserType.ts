import mongoose from "mongoose";

export type UserType = {
	_id?: mongoose.Types.ObjectId;
	name?: string;
	email: string;
	password: string;
	hash?: string;
	isAdmin?: boolean;
	imageUrl?: string;
	imageId?: string;
	createAt?: Date;
};

export type UpdatePasswordType = {
	currentPassword: string;
	newPassword: string;
};
