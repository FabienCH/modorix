export class UserSignUpPasswordValidationError extends Error {
  constructor(reason: 'passwordMissmatch' | 'passwordComplexity') {
    super(UserSignUpPasswordValidationError.getErrorMessage(reason));
  }

  private static getErrorMessage(reason: string): string {
    if (reason === 'passwordMissmatch') {
      return `Passwords must be the same`;
    }
    return `Passwords must be at least 8 characters long and contains at least 1 uppercase letter, 1 lowercase letter and 1 digit`;
  }
}
