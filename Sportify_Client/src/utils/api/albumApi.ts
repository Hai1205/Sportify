import axiosInstance from "../service/axiosInstance";

export const getAllAlbum = async (): Promise<any> => {
    return await axiosInstance.get(`/api/albums/`)
}

export const uploadAlbum = async (
    userId: string,
    formData: FormData
): Promise<any> => {
    return await axiosInstance.post(`/api/albums/upload-album/${userId}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getUserLikedAlbum = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`/api/albums/get-user-liked-albums/${userId}/`)
}

export const likeAlbum = async (userId: string, albumId: string): Promise<any> => {
    return await axiosInstance.post(`/api/albums/like-album/${userId}/${albumId}/`);
};

export const deleteAlbum = async (albumId: string, userId: string): Promise<any> => {
    return await axiosInstance.delete(`/api/albums/delete-album/${albumId}/${userId}/`);
}

export const getAlbum = async (albumId: string): Promise<any> => {
    return await axiosInstance.get(`/api/albums/get-album/${albumId}/`)
}

export const getUserAlbums = async (userId: string): Promise<any> => {
    return await axiosInstance.get(`/api/albums/get-user-albums/${userId}/`)
}

export const updateAlbum = async (updateId: string, formData: FormData): Promise<any> => {
    return await axiosInstance.put(`/api/albums/update-album/${updateId}/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

export const searchAlbums = async (queryString: string): Promise<any> => {
    return await axiosInstance.get(`api/albums/search-albums/${queryString}`);
}