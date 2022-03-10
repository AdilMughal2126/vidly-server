export type JwtPayload = {
	_id?: string;
	name?: string;
	email?: string;
	isAdmin?: boolean;
	imageUrl?: string;
	iat?: number;
};
