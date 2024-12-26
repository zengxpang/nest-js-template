declare global {
  namespace Express {
    interface Request {
      user?: Auth.IPayload;
    }
  }
  namespace Share {
    type IKeyValue = Record<string, any>;
  }
  namespace Auth {
    interface IPayload {
      userId: string;
      username: string;
    }

    interface IJwtSign {
      accessToken: string;
      refreshToken: string;
    }
  }
}

export {};
