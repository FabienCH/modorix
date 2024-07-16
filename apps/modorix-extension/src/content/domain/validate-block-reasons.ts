import { FormBlockReason } from '../models/form-block-reason';

export function validateSelectedReasons(formBlockReasons: FormBlockReason[]): void | Error {
  const hasNoBlockReason = !formBlockReasons.find((blockReason) => blockReason.checked);
  if (hasNoBlockReason) {
    return new Error('No block reason was given');
  }
}
