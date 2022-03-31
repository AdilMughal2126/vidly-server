export interface FavoriteInt {
	user: { _id: string; name: string };
	favorites: { movieId: string; date?: Date }[];
}

export interface FavoriteReqInt {
	userId: string;
	movieId: string;
}
