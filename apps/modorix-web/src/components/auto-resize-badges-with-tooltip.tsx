import { BadgesTooltip } from '@modorix-commons/components/badges-tooltip';
import { BlockReason } from '@modorix-commons/models/block-reason';
import { Badge } from '@modorix-ui/components/badge';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UpdatedBadgeDisplayConfig {
  newVisibleItems: BlockReason[];
  newBadgesWidth: number;
  newRemainingItems: number;
}

interface AutoResizeBadgesWithTooltipProps {
  items: { id: string; label: string }[];
  badgeVariant: 'outline' | 'secondary';
}

export const AutoResizeBadgesWithTooltip = ({ items, badgeVariant }: AutoResizeBadgesWithTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [displayedItems, setDisplayedItems] = useState(items);
  const [areItemsUpToDate, setAreItemsUpToDate] = useState(false);
  const [remainingItems, setRemainingItems] = useState(0);
  const [badgeWidths, setBadgeWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mustTruncate, setMustTruncate] = useState(false);

  useEffect(() => {
    setDisplayedItems(items);
    setRemainingItems(0);
    setMustTruncate(false);
    setAreItemsUpToDate(false);
  }, [items]);

  useLayoutEffect(() => {
    if (areItemsUpToDate) {
      return;
    }
    setContainerWidth(ref.current?.offsetWidth ?? 0);
    setBadgeWidths(badgeRefs.current.map((badgeRef) => badgeRef?.offsetWidth ?? 0));

    const { newVisibleItems, newBadgesWidth, newRemainingItems } = badgeWidths.reduce<UpdatedBadgeDisplayConfig>(
      (config, badgeWidth, idx) => getBadgeDisplayConfig(config, idx, containerWidth, items, badgeWidth),
      {
        newVisibleItems: [],
        newBadgesWidth: 0,
        newRemainingItems: 0,
      },
    );
    setDisplayedItems(newVisibleItems);
    setRemainingItems(newRemainingItems);
    setMustTruncate(newBadgesWidth > containerWidth);
    setAreItemsUpToDate(true);
  }, [items, areItemsUpToDate, badgeWidths, containerWidth]);

  function getBadgeDisplayConfig(
    config: UpdatedBadgeDisplayConfig,
    idx: number,
    containerWidth: number,
    items: BlockReason[],
    badgeWidth: number,
  ) {
    if (config.newBadgesWidth < containerWidth) {
      config.newVisibleItems.push(items[idx]);
    } else {
      config.newRemainingItems++;
    }
    const badgePadding = 8;
    config.newBadgesWidth += badgeWidth + (idx < items.length - 1 ? badgePadding : 0);

    return config;
  }

  return (
    <div ref={ref} className="truncate flex flex-nowrap [&>*:not(:last-child)]:mr-2">
      {displayedItems.map((blockReason, idx) =>
        mustTruncate ? (
          <BadgesTooltip
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
            items={[blockReason]}
            badgeVariant={badgeVariant}
          ></BadgesTooltip>
        ) : (
          <Badge
            ref={(el) => {
              if (el) {
                badgeRefs.current[idx] = el;
              }
            }}
            variant={badgeVariant}
            key={blockReason.id}
          >
            <span>{blockReason.label}</span>
          </Badge>
        ),
      )}
      {remainingItems ? (
        <BadgesTooltip
          buttonOptions={{ label: `+${remainingItems}` }}
          items={items}
          badgeVariant={badgeVariant}
          contentClassName="max-w-[min(400px,40vw)]"
        ></BadgesTooltip>
      ) : null}
    </div>
  );
};
