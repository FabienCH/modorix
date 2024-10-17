export class GroupNotJoinedError extends Error {
  constructor(xUsername: string, groupIds: string[]) {
    super(`could not block user "${xUsername}" because user has not joined the following groups: ${groupIds.join(', ')}`);
  }
}
