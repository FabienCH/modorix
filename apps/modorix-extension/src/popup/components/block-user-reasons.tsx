import { BadgesTooltip } from '@modorix-commons/components/badges-tooltip';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';

export const BlockUserReasons = ({ items }: { items: BlockReason[] }) => {
  const label = items.length > 1 ? items.length.toString() : items[0].label;
  const className = `m-auto ${items.length <= 1 ? 'truncate' : ''}`;
  return (
    <BadgesTooltip
      buttonOptions={{ label, className }}
      items={items}
      badgeVariant="outline-secondary"
      contentClassName="max-w-[calc(100vw-1rem)]"
    ></BadgesTooltip>
  );
};
