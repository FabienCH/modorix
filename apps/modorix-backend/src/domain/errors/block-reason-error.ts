export class BlockReasonError extends Error {
  constructor(userId: string, error: 'empty' | 'notFound') {
    const errorDetails = error === 'empty' ? 'no reason was given' : 'at least one reason does not exist';
    super(`could not block user "${userId}" because ${errorDetails}`);
  }
}
