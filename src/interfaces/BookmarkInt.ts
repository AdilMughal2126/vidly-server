export interface BookmarkInt {
	user: { _id: string; name: string };
	bookmarks: { movieId: string; date?: Date }[];
}

export interface BookmarkReqInt {
	userId: string;
	movieId: string;
}
