import axiosInstance from "../service/axiosInstance";

export const followUser = async (currentUserId: string, opponentId: string): Promise<any> => {
  return await axiosInstance.post(`/api/users/${currentUserId}/followings/${opponentId}/`);
};

export const getAllUser = async (): Promise<any> => {
  return await axiosInstance.get(`/api/users/`);
};

export const getUserByRole = async (role: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/search/?role=${role}`);
};

export const getSuggestedUsers = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/${userId}/suggested/`);
};

export const getUser = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/${userId}/`);
};

export const getFollowings = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/${userId}/followings/`);
};

export const createUser = async (
  formData: FormData
): Promise<any> => {
  return await axiosInstance.post(`/api/users/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUser = async (
  userId: string,
  formData: FormData
): Promise<any> => {
  return await axiosInstance.put(`/api/users/${userId}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUser = async (userId: string): Promise<any> => {
  return await axiosInstance.delete(`/api/users/${userId}/`);
};

export const requireUpdateUserToArtist = async (userId: string, formData: FormData): Promise<any> => {
  return await axiosInstance.post(`/api/users/${userId}/artist-applications/`, formData);
};

export const responseUpdateUserToArtist = async (applicationId: string, formData: FormData): Promise<any> => {
  return await axiosInstance.put(`/api/users/artist-applications/${applicationId}/`, formData);
};

export const searchUsers = async (queryString: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/search/${queryString}`);
}

export const getArtistApplications = async (queryString: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/artist-applications/${queryString}`);
}

export const getArtistApplication = async (userId: string): Promise<any> => {
  return await axiosInstance.get(`/api/users/${userId}/artist-applications/`);
}

export const deleteArtistApplication = async (applicationId: string): Promise<any> => {
  return await axiosInstance.delete(`/api/users/artist-applications/${applicationId}/`);
}