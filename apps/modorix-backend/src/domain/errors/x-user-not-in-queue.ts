export class XUserNotInQueueError extends Error {
  constructor(xUserId: number) {
    super(`X user with id "${xUserId}" is not in Modorix's user queue`);
  }
}
