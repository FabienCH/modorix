import { BlockUserReasonsTooltip } from '@modorix-commons/components/block-user-reasons-tooltip';
import { BlockReason } from '@modorix-commons/models/block-reason';

export const BlockUserReasons = ({ blockReasons }: { blockReasons: BlockReason[] }) => {
  return (
    <BlockUserReasonsTooltip
      buttonOptions={{ label: `${blockReasons.length}`, className: 'm-auto' }}
      blockReasons={blockReasons}
      contentClassName="max-w-[calc(100vw-1rem)]"
    ></BlockUserReasonsTooltip>
  );
};
