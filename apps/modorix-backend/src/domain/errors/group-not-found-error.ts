export class GroupNotFoundError extends Error {
  constructor(groupId: string) {
    super(`group with id "${groupId}" was not found`);
  }
}
