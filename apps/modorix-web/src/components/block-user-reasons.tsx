import { BlockUserReasonsTooltip } from '@modorix-commons/components/block-user-reasons-tooltip';
import { BlockReason } from '@modorix-commons/models/block-reason';
import { Badge } from '@modorix-ui/components/badge';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UpdatedBadgeDisplayConfig {
  newVisibleItems: BlockReason[];
  newBadgesWidth: number;
  newRemainingItems: number;
}

export const BlockUserReasons = ({ blockReasons }: { blockReasons: BlockReason[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [displayedBlockReasons, setDisplayedBlockReasons] = useState(blockReasons);
  const [isDisplayedReasonsUpToDate, setIsDisplayedReasonsUpToDate] = useState(false);
  const [remainingItems, setRemainingItems] = useState(0);
  const [badgeWidths, setBadgeWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mustTruncate, setMustTruncate] = useState(false);

  useEffect(() => {
    setDisplayedBlockReasons(blockReasons);
    setRemainingItems(0);
    setMustTruncate(false);
    setIsDisplayedReasonsUpToDate(false);
  }, [blockReasons]);

  useLayoutEffect(() => {
    if (isDisplayedReasonsUpToDate) {
      return;
    }
    setContainerWidth(ref.current?.offsetWidth ?? 0);
    setBadgeWidths(badgeRefs.current.map((badgeRef) => badgeRef?.offsetWidth ?? 0));

    const { newVisibleItems, newBadgesWidth, newRemainingItems } = badgeWidths.reduce<UpdatedBadgeDisplayConfig>(
      (config, badgeWidth, idx) => getBadgeDisplayConfig(config, idx, containerWidth, blockReasons, badgeWidth),
      {
        newVisibleItems: [],
        newBadgesWidth: 0,
        newRemainingItems: 0,
      },
    );
    setDisplayedBlockReasons(newVisibleItems);
    setRemainingItems(newRemainingItems);
    setMustTruncate(newBadgesWidth > containerWidth);
    setIsDisplayedReasonsUpToDate(true);
  }, [blockReasons, isDisplayedReasonsUpToDate, badgeWidths, containerWidth]);

  function getBadgeDisplayConfig(
    config: UpdatedBadgeDisplayConfig,
    idx: number,
    containerWidth: number,
    blockReasons: BlockReason[],
    badgeWidth: number,
  ) {
    if (config.newBadgesWidth < containerWidth) {
      config.newVisibleItems.push(blockReasons[idx]);
    } else {
      config.newRemainingItems++;
    }
    config.newBadgesWidth += badgeWidth;

    return config;
  }

  return (
    <div ref={ref} className="truncate flex flex-nowrap [&>*:not(:last-child)]:mr-2">
      {displayedBlockReasons.map((blockReason, idx) =>
        mustTruncate ? (
          <BlockUserReasonsTooltip
            key={blockReason.id}
            buttonOptions={{
              setLabelElem: (el) => {
                if (el) {
                  badgeRefs.current[idx] = el;
                }
              },
              className: 'truncate',
              label: blockReason.label,
            }}
            blockReasons={[blockReason]}
          ></BlockUserReasonsTooltip>
        ) : (
          <Badge variant={'secondary'} key={blockReason.id}>
            <span
              ref={(el) => {
                if (el) {
                  badgeRefs.current[idx] = el;
                }
              }}
            >
              {blockReason.label}
            </span>
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
