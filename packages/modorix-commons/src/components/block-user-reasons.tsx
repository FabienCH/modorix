import { Badge } from '@modorix-ui/components/badge';
import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import { BlockReason } from '../models/block-reason';
import { BlockUserReasonsTooltip } from './block-user-reasons-tooltip';

interface BadgeDisplayConfig {
  visibleItems: BlockReason[];
  badgesWidth: number;
  remainingItems: number;
}

export const BlockUserReasons = ({ blockReasons }: { blockReasons: BlockReason[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const badgeRefs = blockReasons.map(() => useRef<HTMLSpanElement>(null));
  const [displayedBlockReasons, setDisplayedBlockReasons] = useState(blockReasons);
  const [remainingItems, setRemainingItems] = useState(0);
  const [mustTruncate, setMustTruncate] = useState(false);

  useLayoutEffect(() => {
    const containerWidth = ref.current?.offsetWidth ?? 0;
    const { visibleItems, badgesWidth, remainingItems } = badgeRefs.reduce<BadgeDisplayConfig>(
      (config, badgeRef, idx) => getBadgeDisplayConfig(config, idx, containerWidth, blockReasons, badgeRef),
      {
        visibleItems: [],
        badgesWidth: 0,
        remainingItems: 0,
      },
    );
    setDisplayedBlockReasons(visibleItems);
    setRemainingItems(remainingItems);
    setMustTruncate(badgesWidth > containerWidth);
  }, []);

  function getBadgeDisplayConfig(
    config: BadgeDisplayConfig,
    idx: number,
    containerWidth: number,
    blockReasons: BlockReason[],
    badgeRef: RefObject<HTMLSpanElement>,
  ) {
    if (config.badgesWidth < containerWidth) {
      config.visibleItems.push(blockReasons[idx]);
    } else {
      config.remainingItems++;
    }
    config.badgesWidth += badgeRef.current?.offsetWidth ?? 0;

    return config;
  }

  return (
    <div ref={ref} className="truncate flex flex-nowrap [&>*:not(:last-child)]:mr-2">
      {displayedBlockReasons.map((blockReason, idx) =>
        mustTruncate ? (
          <BlockUserReasonsTooltip
            buttonLabelRef={badgeRefs[idx]}
            buttonClassName={'truncate'}
            buttonLabel={blockReason.label}
            blockReasons={[blockReason]}
          ></BlockUserReasonsTooltip>
        ) : (
          <Badge variant={'secondary'} key={blockReason.id}>
            <span ref={badgeRefs[idx]}>{blockReason.label}</span>
          </Badge>
        ),
      )}
      {remainingItems ? (
        <BlockUserReasonsTooltip buttonLabel={`+${remainingItems}`} blockReasons={blockReasons}></BlockUserReasonsTooltip>
      ) : null}
    </div>
  );
};
