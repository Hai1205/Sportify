export interface User {
	id: string;
	albums: Album[] | string[];
	songs: Song[] | string[];
	likedSongs: Song[] | string[];
	likedAlbums: Album[] | string[];
	followers: User[] | string[];
	following: User[] | string[];
	username: string;
	email: string;
	fullName: string;
	avatarUrl: string;
	biography: string;
	status: string;
	website: string;
	instagram: string;
	twitter: string;
	facebook: string;
	youtube: string;
	role: string;
	country: string;
	joinDate: string;
}

export interface Album {
	id: string;
	user: User;
	title: string;
	thumbnailUrl: string;
	releaseDate: string;
	songs: Song[];
}

export interface Song {
	id: string;
	title: string;
	user: User;
	album: Album | null;
	thumbnailUrl: string;
	audioUrl: string;
	videoUrl: string;
	duration: number;
	releaseDate: string;
	views: number;
	lyrics: string;
	updatedAt: string;
}

export interface ArtistApplication {
	id: string;
	user: User | null;
	songs: Song[];
	biography: string;
	achievements: string;
	reason: string;
	submitDate: string;
	status: string;
}

export interface GeneralStat {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	id: string;
	tempId?: string;
	senderId: string;
	receiverId?: string;
	roomId?: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	pending?: boolean;
	error?: boolean;
}

export interface FileState {
	thumbnail: File | null;
	audio: File | null;
}

// export interface UserData {
//   id: string;
//   username: string;
//   email: string;
//   fullName: string;
//   avatarUrl: string;
//   status: string;
//   role: string;
//   country: string;
//   // Các trường khác
// }

export interface ChatMember {
  id: string;
  conversation: string;
  user: string;
  user_data?: User;
  role: string;
  joined_at: string;
  last_read_at: string;
  // Trường legacy
  fullName?: string;
  avatarUrl?: string;
  username?: string;
}

export interface ChatRoom {
  id: string;
  name?: string;
  roomType?: 'direct' | 'group';  // Trường cũ
  conversation_type?: 'direct' | 'group';  // Trường từ API
  members: (User | ChatMember)[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;  // Từ API
  updated_at?: string;  // Từ API
  display_name?: string;  // Tên hiển thị của người đối thoại
}