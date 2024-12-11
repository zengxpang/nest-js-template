export interface JwtSign {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
}

export interface Payload {
  userId: string;
  username: string;
  email: string;
}
