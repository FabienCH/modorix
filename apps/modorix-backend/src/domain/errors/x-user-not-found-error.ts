export class XUserNotFoundError extends Error {
  constructor(xUserId: number) {
    super(`X user with id "${xUserId}" was not found`);
  }
}
