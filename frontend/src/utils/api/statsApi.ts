import axiosInstance from "../service/axiosInstance";

export const getGeneralStat = async (): Promise<any> => {
    return await axiosInstance.get(`/api/stats/`)
}

// export const getUserActivityStat = async(days: number): Promise<any> => {
//     return await axiosInstance.get(`/api/stats/get-user-activity-stat?${days}/`)
// }

export const getPopularSongsStat = async (): Promise<any> => {
    return await axiosInstance.get(`/api/stats/songs/popular/`)
}

export const getTopArtistsStat = async (): Promise<any> => {
    return await axiosInstance.get(`/api/stats/artists/top/`)
}