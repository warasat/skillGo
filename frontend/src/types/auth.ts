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
      _id: string;
      name: string;
      email: string;
      role: {
        _id: string;
        identifier: number;
        role: string;
      };
      status: "active" | "inactive";
      permissions: string[];
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    token: string;
    roleIdentifier: number;
  };
}
