import { BlockReason } from '@modorix-commons/models/block-reason';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockReasonsRepository {
  private readonly blockReasons: BlockReason[] = [
    { id: '0', label: 'Harassment' },
    { id: '1', label: 'Racism, Xenophobia' },
    { id: '2', label: 'Spreading fake news' },
    { id: '3', label: 'Homophobia Transphobia' },
    { id: '4', label: 'Incitement to hatred, violence or discrimination' },
    { id: '5', label: 'Trolling Spamming' },
    { id: '6', label: 'Scamming' },
    { id: '7', label: 'Other' },
  ];

  blockedReasonsList(): BlockReason[] {
    return this.blockReasons;
  }
}
