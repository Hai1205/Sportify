import { User, ChatMember, ChatRoom } from "./types";

export const isChatMember = (member: User | ChatMember): member is ChatMember => {
  return 'user_data' in member || 'user' in member || 'conversation' in member;
};

export const getOtherUserFromRoom = (room: ChatRoom, currentUserId: string): User | null => {
  if (!room?.members || room.members.length === 0) return null;
  
  // Đảm bảo ID được chuyển thành string và cắt bỏ khoảng trắng
  const currentUserIdStr = String(currentUserId).trim();
  
  console.log("Finding other user. Current user ID:", currentUserIdStr);
  console.log("Room members:", JSON.stringify(room.members));

  // Tìm member khác với current user
  const otherMember = room.members.find(member => {
    if (isChatMember(member)) {
      // Kiểm tra user id trong user_data và user field
      const userDataId = member.user_data?.id ? String(member.user_data.id).trim() : "";
      const userId = String(member.user).trim();
      
      // Log để debug
      console.log("Member ID check:", { userDataId, userId, currentUserIdStr });
      
      // So sánh với cả hai giá trị
      return userDataId !== currentUserIdStr && userId !== currentUserIdStr;
    } else {
      return String(member.id).trim() !== currentUserIdStr;
    }
  });
  
  if (!otherMember) {
    console.warn("No other user found in room", room.id);
    return null;
  }

  console.log("Found other member:", otherMember);
  
  if (isChatMember(otherMember)) {
    const userData = otherMember.user_data;
    if (!userData || Object.keys(userData).length === 0) {
      // Fallback nếu không có user_data
      return {
        id: otherMember.user,
        username: '',
        fullName: room.display_name || '',
        avatarUrl: '',
        email: '',
        // Các trường khác theo User interface...
        role: 'user',
        status: 'active',
        biography: '', 
        website: '',
        country: '',
        joinDate: '',
        instagram: '',
        twitter: '',
        facebook: '',
        youtube: '',
        albums: [],
        songs: [],
        likedSongs: [],
        likedAlbums: [],
        followers: [],
        following: []
      };
    }
    
    // Trả về user data với đầy đủ thông tin
    return {
      id: userData.id,
      username: userData.username || '',
      fullName: userData.fullName || room.display_name || '',
      avatarUrl: userData.avatarUrl || '',
      email: userData.email || '',
      role: userData.role || 'user',
      status: userData.status || 'active',
      biography: userData.biography || '', 
      website: userData.website || '',
      country: userData.country || '',
      joinDate: userData.joinDate || '',
      instagram: userData.instagram || '',
      twitter: userData.twitter || '',
      facebook: userData.facebook || '',
      youtube: userData.youtube || '',
      albums: [],
      songs: [],
      likedSongs: [],
      likedAlbums: [],
      followers: [],
      following: []
    };
  }
  
  return otherMember;
};