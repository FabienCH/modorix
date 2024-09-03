export class UserSignUpValidationError extends Error {
  constructor() {
    super(`Passwords must be the same`);
  }
}
