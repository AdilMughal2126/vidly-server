export type FavoriteType = {
	user: { _id: string; name: string };
	movie: {
		_id: string;
		title: string;
		url: string;
		voteAverage: number;
		likes: { _id: string }[];
	};
	date: Date;
};

export type FavoriteRequestType = {
	userId: string;
	movieId: string;
};
