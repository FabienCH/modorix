export interface SignUpUserRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ConfirmSignUpUserRequest {
  tokenHash: string;
  type: string;
}
