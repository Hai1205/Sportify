import { toast } from "react-toastify";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Album, Song } from "@/utils/types";
import {
	deleteAlbum,
	getAlbum,
	getAllAlbum,
	getUserAlbums,
	uploadAlbum,
	updateAlbum,
	searchAlbums,
	likeAlbum,
	getUserLikedAlbum
} from "@/utils/api/albumApi";
import {
	deleteSong,
	getFeaturedSongs,
	getMadeForYouSongs,
	getAllSong,
	getTrendingSongs,
	getSong,
	updateSong,
	addSongToAlbum,
	downloadSong,
	searchSongs,
	increaseSongView,
	uploadSong,
	likeSong,
	getUserLikedSong,
	getUserSongs
} from "@/utils/api/songApi";
import { useAuthStore } from "./useAuthStore";

interface MusicStore {
  isLoading: boolean;
  error: string | null;
  status: number;
  message: string | null;
  songs: Song[];
  albums: Album[];
  featuredSongs: Song[];

  getAllAlbum: () => Promise<any>;
  uploadAlbum: (userId: string, formData: FormData) => Promise<any>;
  getAlbum: (albumId: string) => Promise<any>;
  updateAlbum: (albumId: string, formData: FormData) => Promise<any>;
  deleteAlbum: (albumId: string, userId: string) => Promise<any>;
  getUserAlbums: (userId: string) => Promise<any>;
  getUserSongs: (userId: string) => Promise<any>;
  searchAlbums: (query: string) => Promise<any>;
  getFeaturedSongs: () => Promise<any>;
  getMadeForYouSongs: () => Promise<any>;
  getTrendingSongs: () => Promise<any>;
  getAllSong: () => Promise<any>;
  getSong: (songId: string) => Promise<any>;
  uploadSong: (userId: string, formData: FormData) => Promise<any>;
  updateSong(songId: string, formData: FormData): Promise<any>;
  addSongToAlbum(songId: string, albumId: string): Promise<any>;
  downloadSong: (id: string) => Promise<any>;
  deleteSong: (songId: string, userId: string, albumId: string) => Promise<any>;
  searchSongs: (query: string) => Promise<any>;
  increaseSongView: (songId: string) => Promise<any>;
  likeSong: (userId: string, songId: string) => Promise<any>;
  getUserLikedSong: (userId: string) => Promise<any>;
  likeAlbum: (userId: string, albumId: string) => Promise<any>;
  getUserLikedAlbum: (userId: string) => Promise<any>;
  deleteSongFromManagement: (songId: string) => void;
  deleteAlbumFromManagement: (albumId: string) => void;
  reset: () => any;
}

const initialState = {
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	song: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	status: 0,
	message: null
}

export const useMusicStore = create<MusicStore>()(
	persist(
		(set) => ({
			...initialState,

			deleteSong: async (songId, userId, albumId) => {
				set({ error: null });

				try {
					const response = await deleteSong(songId, userId, albumId);
					const { message } = response.data;

					// useMusicStore.getState().deleteSongFromManagement(songId);

					toast.success(message);
					return true;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			deleteAlbum: async (albumId, userId) => {
				set({ error: null });

				try {
					const response = await deleteAlbum(albumId, userId);
					const { message } = response.data;

					// useMusicStore.getState().deleteAlbumFromManagement(albumId);

					toast.success(message);
					return true;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getAllSong: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await getAllSong();
					const { songs } = response.data;

					return songs;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			uploadAlbum: async (userId, formData) => {
				set({ error: null });

				try {
					const response = await uploadAlbum(userId, formData);
					const { message, album } = response.data;

					toast.success(message);
					return album;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			uploadSong: async (userId, formData) => {
				set({ error: null });

				try {
					const response = await uploadSong(userId, formData);
					const { message, song } = response.data;

					toast.success(message);
					return song;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			updateAlbum: async (id, formData) => {
				set({ error: null });

				try {
					const response = await updateAlbum(id, formData);
					const { message, album } = response.data;

					toast.success(message);
					return album;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			searchAlbums: async (query) => {
				set({ isLoading: true, error: null });

				try {
					const response = await searchAlbums(query);
					const { albums } = response.data;

					return albums;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getAllAlbum: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await getAllAlbum();
					const { albums } = response.data;

					return albums;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getAlbum: async (id) => {
				set({ isLoading: true, error: null });

				try {
					const response = await getAlbum(id);
					const { album } = response.data;

					return album;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getUserAlbums: async (userId) => {
				set({ error: null });

				try {
					const response = await getUserAlbums(userId);
					const { albums } = response.data;

					return albums;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getUserSongs: async (userId) => {
				set({ error: null });

				try {
					const response = await getUserSongs(userId);
					const { songs } = response.data;

					return songs;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getFeaturedSongs: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await getFeaturedSongs();
					const { songs } = response.data;

					return songs;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getMadeForYouSongs: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await getMadeForYouSongs();
					const { songs } = response.data;

					return songs;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getTrendingSongs: async () => {
				set({ isLoading: true, error: null });

				try {
					const response = await getTrendingSongs();
					const { songs } = response.data;

					return songs;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			updateSong: async (songId, formData) => {
				set({ error: null });

				try {
					const response = await updateSong(songId, formData);
					const { song, message } = response.data;

					toast.success(message);
					return song;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			addSongToAlbum: async (songId, albumId) => {
				set({ isLoading: true, error: null });

				try {
					const response = await addSongToAlbum(songId, albumId);
					const { message, song } = response.data;

					toast.success(message);
					return song;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			downloadSong: async (songId) => {
				set({ error: null });

				try {
					await downloadSong(songId);

					toast.success("Song downloaded successfully");
					return true;
				} catch (error: any) {
					console.error(error);
					let errorMessage = "Failed to download song";
					if (error.response && error.response.data && error.response.data.message) {
						errorMessage = error.response.data.message;
					}
					set({ error: errorMessage });

					toast.error(errorMessage);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			getSong: async (songId) => {
				set({ isLoading: true, error: null });

				try {
					const response = await getSong(songId);
					const { song } = response.data;

					return song;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			searchSongs: async (query) => {
				set({ isLoading: true, error: null });

				try {
					const response = await searchSongs(query);
					const { songs } = response.data;

					return songs;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			increaseSongView: async (songId) => {
				set({ error: null });

				try {
					await increaseSongView(songId);

					return true;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				}
			},

			likeSong: async (userId, songId) => {
				set({ error: null });

				try {
					const response = await likeSong(userId, songId);
					const { user, message } = response.data;

					await useAuthStore.getState().setUserAuth(user);
					toast.success(message);
					return user;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				}
			},

			getUserLikedSong: async (userId) => {
				set({ isLoading: true, error: null });

				try {
					const response = await getUserLikedSong(userId);
					const { songs } = response.data;

					return songs;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			likeAlbum: async (userId, albumId) => {
				set({ error: null });

				try {
					const response = await likeAlbum(userId, albumId);
					const { user, message } = response.data;

					await useAuthStore.getState().setUserAuth(user);
					toast.success(message);
					return user;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				}
			},

			getUserLikedAlbum: async (userId) => {
				set({ isLoading: true, error: null });

				try {
					const response = await getUserLikedAlbum(userId);
					const { albums } = response.data;

					return albums;
				} catch (error: any) {
					console.error(error)
					const { message } = error.response.data;
					set({ error: message });

					toast.error(message);
					return false;
				} finally {
					set({ isLoading: false });
				}
			},

			deleteSongFromManagement: async (songId: string) => {
				set((state) => ({
					songs: state.songs.filter((song) => song.id !== songId),
				}));
			},

			deleteAlbumFromManagement: async (albumId: string) => {
				set((state) => ({
					albums: state.albums.filter((album) => album.id !== albumId),
					songs: state.songs.map((song) =>
						song?.album?.id === state.albums.find((a) => a.id === albumId)?.title ? { ...song, album: null } : song
					),
				}));
			},

			reset: () => {
				set({ ...initialState });
			},
		}),

		{
			name: "music-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);