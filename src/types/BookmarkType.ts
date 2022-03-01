export type BookmarkType = {
	user: { _id: string; name: string };
	movie: {
		_id: string;
		title: string;
		url: string;
		voteAverage: number;
		bookmarks: { userId: string }[];
	};
	date: Date;
};

export type BookmarkRequestType = {
	userId: string;
	movieId: string;
};
