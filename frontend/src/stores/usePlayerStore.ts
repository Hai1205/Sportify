import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Song } from "@/utils/types";
// import { useChatStore } from "./useChatStore";
import { useMusicStore } from "./useMusicStore";

interface PlayerStore {
	isLoading: boolean;
	error: string | null;
	status: number;
	message: string | null;
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	reset: () => void;
}

const initialState = {
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	isLoading: false,
	error: null,
	status: 0,
	message: null
}

export const usePlayerStore = create<PlayerStore>()(
	persist(
		(set, get) => ({
			...initialState,

			initializeQueue: (songs: Song[]) => {
				set({
					queue: songs,
					currentSong: get().currentSong || songs[0],
					currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
				});
			},

			playAlbum: async (songs: Song[], startIndex = 0) => {
				if (songs.length === 0) return;

				const song = songs[startIndex];
				const currentSong = get().currentSong;

				if (!currentSong || currentSong.id !== song.id) {
					await useMusicStore.getState().increaseSongView(song.id);
				}

				set((state) => ({
					...state,
					queue: songs,
					currentSong: song,
					currentIndex: startIndex,
					isPlaying: true,
				}));
			},

			setCurrentSong: async (song: Song | null) => {
				if (!song) return;

				const songIndex = get().queue.findIndex((s) => s.id === song.id);
				const currentSong = get().currentSong;

				if (!currentSong || currentSong.id !== song.id) {
					await useMusicStore.getState().increaseSongView(song.id);
				}

				set({
					currentSong: song,
					isPlaying: true,
					currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
				});
			},

			togglePlay: () => {
				const willStartPlaying = !get().isPlaying;

				set({
					isPlaying: willStartPlaying,
				});
			},

			playNext: async () => {
				const { currentIndex, queue } = get();
				const nextIndex = currentIndex + 1;

				if (nextIndex < queue.length) {
					const nextSong = queue[nextIndex];

					await useMusicStore.getState().increaseSongView(nextSong.id);

					// const socket = useChatStore.getState().socket;
					// if (socket.auth) {
					// 	socket.emit("update_activity", {
					// 		userId: socket.auth.userId,
					// 		activity: `Playing ${nextSong.title} by ${nextSong.user.id}`,
					// 	});
					// }

					set({
						currentSong: nextSong,
						currentIndex: nextIndex,
						isPlaying: true,
					});
				} else {
					set({ isPlaying: false });

					// const socket = useChatStore.getState().socket;
					// if (socket.auth) {
					// 	socket.emit("update_activity", {
					// 		userId: socket.auth.userId,
					// 		activity: `Idle`,
					// 	});
					// }
				}
			},

			playPrevious: async () => {
				const { currentIndex, queue } = get();
				const prevIndex = currentIndex - 1;

				if (prevIndex >= 0) {
					const prevSong = queue[prevIndex];

					await useMusicStore.getState().increaseSongView(prevSong.id);

					// const socket = useChatStore.getState().socket;
					// if (socket.auth) {
					// 	socket.emit("update_activity", {
					// 		userId: socket.auth.userId,
					// 		activity: `Playing ${prevSong.title} by ${prevSong.user.id}`,
					// 	});
					// }

					set({
						currentSong: prevSong,
						currentIndex: prevIndex,
						isPlaying: true,
					});
				} else {
					set({ isPlaying: false });

					// const socket = useChatStore.getState().socket;
					// if (socket.auth) {
					// 	socket.emit("update_activity", {
					// 		userId: socket.auth.userId,
					// 		activity: `Idle`,
					// 	});
					// }
				}
			},

			reset: () => {
				set({ ...initialState });
			},
		}),

		{
			name: "player-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);