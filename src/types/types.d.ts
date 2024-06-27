export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  biography?: string;
  gender?: string;
  photoURL?: string;
  location?: string;
  favorites?: string[];
  characters?: string[];
  people?: string[];
  comments?: string[];
  friends?: string[];
  wishlist?: string[];
  mangaCollection?: string[];
  role?: string;
}

export interface EditUserProps {
  displayName: string;
  username: string;
  biography: string;
  gender: string;
  photoURL: string;
  location: string;
}

interface Volume {
  _id: string;
  volumeNumber: number;
  releaseDate: string;
  chapters: string[];
  image: string;
  volumeName: string;
  price?: number;
  link?: string;
}

export interface Characters {
  _id: string;
  name: string;
  photoUrl: string;
  spoiler: string;
  age: number;
  biography: string;
  voiceActors: string[];
}

export interface Manga {
  _id: string;
  imageUrl: string;
  title: string;
  alternativeTitles: string;
  author: string;
  synopsis: string;
  genres: string[];
  volumes: [Volume];
  publisherBy: string;
  score: number;
  releaseDate: string;
}

export interface Artist {
  _id: string;
  name: string;
  photoUrl: string;
  birthday: string;
  nationality: number;
  biography: string;
  role: string;
}

export interface Token {
  token: string;
}
