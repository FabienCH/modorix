export class UserSignUpEmailValidationError extends Error {
  constructor(email: string) {
    super(`Email ${email} is already used`);
  }
}
