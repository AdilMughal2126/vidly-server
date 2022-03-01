export type FavoriteType = {
	user: { name: string };
	movie: { title: string };
	date: Date;
};

export type FavoriteRequestType = {
	userId: string;
	movieId: string;
};
