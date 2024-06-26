import { BadgesTooltip } from '@modorix-commons/components/badges-tooltip';
import { BlockReason } from '@modorix-commons/models/block-reason';

export const BlockUserReasons = ({ items }: { items: BlockReason[] }) => {
  return (
    <BadgesTooltip
      buttonOptions={{ label: `${items.length}`, className: 'm-auto' }}
      items={items}
      badgeVariant="secondary"
      contentClassName="max-w-[calc(100vw-1rem)]"
    ></BadgesTooltip>
  );
};
