export interface UserResponse {
  id: number
  name: string
  nickname: string,
  email: string
  currentAvatar: string
  level: number
  createdAt: string
  totalXP: number
  totalCoins: number
};

export interface UserCreateRequest {
  name: string
  nickname: string
  password: string
  email: string
}