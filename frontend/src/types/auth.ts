export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
  role: number;
}

export interface AuthRegisterResponse {
  sucess: boolean;
  message: string;
  data: {
    user: {
      name: string;
      email: string;
      role: {
        identifier: number;
        role: string;
      };
    };
  };
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}
export interface AuthLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      name: string;
      email: string;
      role: {
        identifier: number;
        role: string;
      };
    };
    token: string;
  };
}
