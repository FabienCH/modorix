export class XUserNotInQueueError extends Error {
  constructor(xUserId: string) {
    super(`X user with id "${xUserId}" is not in Modorix's user queue`);
  }
}
