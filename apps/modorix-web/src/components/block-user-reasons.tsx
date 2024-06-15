import { BlockUserReasonsTooltip } from '@modorix-commons/components/block-user-reasons-tooltip';
import { BlockReason } from '@modorix-commons/models/block-reason';
import { Badge } from '@modorix-ui/components/badge';
import { useLayoutEffect, useRef, useState } from 'react';

interface BadgeDisplayConfig {
  visibleItems: BlockReason[];
  badgesWidth: number;
  remainingItems: number;
}

export const BlockUserReasons = ({ blockReasons }: { blockReasons: BlockReason[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [displayedBlockReasons, setDisplayedBlockReasons] = useState(blockReasons);
  const [remainingItems, setRemainingItems] = useState(0);
  const [mustTruncate, setMustTruncate] = useState(false);

  useLayoutEffect(() => {
    const containerWidth = ref.current?.offsetWidth ?? 0;
    const { visibleItems, badgesWidth, remainingItems } = badgeRefs.current.reduce<BadgeDisplayConfig>(
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
  }, [blockReasons]);

  function getBadgeDisplayConfig(
    config: BadgeDisplayConfig,
    idx: number,
    containerWidth: number,
    blockReasons: BlockReason[],
    badgeRef: HTMLSpanElement | null,
  ) {
    if (config.badgesWidth < containerWidth) {
      config.visibleItems.push(blockReasons[idx]);
    } else {
      config.remainingItems++;
    }
    config.badgesWidth += badgeRef?.offsetWidth ?? 0;

    return config;
  }

  return (
    <div ref={ref} className="truncate flex flex-nowrap [&>*:not(:last-child)]:mr-2">
      {displayedBlockReasons.map((blockReason, idx) =>
        mustTruncate ? (
          <BlockUserReasonsTooltip
            buttonOptions={{ labelElem: badgeRefs.current[idx], className: 'truncate', label: blockReason.label }}
            blockReasons={[blockReason]}
          ></BlockUserReasonsTooltip>
        ) : (
          <Badge variant={'secondary'} key={blockReason.id}>
            <span ref={(el) => (badgeRefs.current[idx] = el)}>{blockReason.label}</span>
          </Badge>
        ),
      )}
      {remainingItems ? (
        <BlockUserReasonsTooltip
          buttonOptions={{ label: `+${remainingItems}` }}
          blockReasons={blockReasons}
          contentClassName="max-w-[min(400px,40vw)]"
        ></BlockUserReasonsTooltip>
      ) : null}
    </div>
  );
};
