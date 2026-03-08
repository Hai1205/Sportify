import axiosInstance from "../service/axiosInstance";

export const getAllSong = async (): Promise<any> => {
    return await axiosInstance.get(`/api/songs/`)
}

export const getUserLikedSong = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`/api/songs/liked/users/${userId}/`)
}

export const likeSong = async (userId: string, songId: string): Promise<any> => {
    return await axiosInstance.post(`/api/songs/${songId}/likes/${userId}/`);
};

export const getUserSongs = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`/api/songs/users/${userId}/`)
}

export const uploadSong = async (
    userId: string,
    formData: FormData
): Promise<any> => {
    return await axiosInstance.post(`/api/songs/users/${userId}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteSong = async (songId: string, userId: string, albumId: string): Promise<any> => {
    return await axiosInstance.delete(`/api/songs/${songId}/users/${userId}/albums/${albumId}/`)
}

export const getSong = async (songId: string): Promise<any> => {
    return await axiosInstance.get(`/api/songs/${songId}/`)
}

export const getFeaturedSongs = async (): Promise<any> => {
    return await axiosInstance.get(`/api/songs/featured/`);
}

export const getMadeForYouSongs = async (): Promise<any> => {
    return await axiosInstance.get(`/api/songs/made-for-you/`);
}

export const getTrendingSongs = async (): Promise<any> => {
    return await axiosInstance.get(`/api/songs/trending/`);
}

export const updateSong = async (songId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.put(`/api/songs/${songId}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const addSongToAlbum = async (songId: string, albumId: string): Promise<any> => {
    return await axiosInstance.put(`/api/songs/${songId}/albums/${albumId}/`);
}

export const downloadSong = async (songId: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`/api/songs/${songId}/download/`, {
            responseType: 'blob'
        });

        const filename = 'song.mp3';

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        return { status: 200, message: "Downloaded song successfully" };
    } catch (error) {
        console.error("Error downloading song:", error);
        throw error;
    }
};

export const searchSongs = async (queryString: string): Promise<any> => {
    return await axiosInstance.get(`/api/songs/search/${queryString}`);
}

export const increaseSongView = async (songId: string): Promise<any> => {
    return await axiosInstance.put(`/api/songs/${songId}/views/`);
}