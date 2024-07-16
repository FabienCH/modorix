export class XUserNotFoundError extends Error {
  constructor(xUserId: string) {
    super(`X user with id "${xUserId}" was not found`);
  }
}
