import { BlockReason } from '@modorix-commons/domain/models/block-reason';

export interface FormBlockReason extends BlockReason {
  checked: boolean;
}
