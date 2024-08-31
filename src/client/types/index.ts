export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
  target?: string;
  rel: string;
};

export type IAdmin = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  reset_password_token: string;
  reset_password_expires: Date;
  avatarUrl: string;
  profilePic: string;
  last_login: Date;
  role: string;
  created_at: Date;
  admin_registrationid: number;
};

export type IAdminRegistration = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type INewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type IUser = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  reset_password_token: string;
  reset_password_expires: Date;
  bio: string;
  status: string;
  avatarUrl: string;
  profilePic: string;
  last_login: Date;
  role: string;
  created_at: Date;
  user_registrationid: number;
};

export type IFollower = {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: Date;
};

export type IFollowing = {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: Date;
};

export type INewPost = {
  id: string | number;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  id: number;
  caption: string;
  imageUrl: string;
  location: string;
  tags: string;
  likes_count: number;
  created_at: Date;
  creator_id: string;
  updated_at: Date;
  User: IUser;
};

export type IStory = {
  id: number;
  user_id: number;
  storyUrl: string;
  created_at: Date;
  expires_at: Date;
  User: IUser;
};
