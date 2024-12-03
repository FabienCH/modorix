import { BadeTooltipVariant, BadgesTooltip } from '@modorix-commons/components/badges-tooltip';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { Badge } from '@modorix-ui/components/badge';
import { useLayoutEffect, useRef, useState } from 'react';

interface UpdatedBadgeDisplayConfig {
  newVisibleItems: BlockReason[];
  newBadgesWidth: number;
  newRemainingItems: number;
}

interface AutoResizeBadgesWithTooltipProps {
  items: { id: string; label: string }[];
  badgeVariant: BadeTooltipVariant;
}

export const AutoResizeBadgesWithTooltip = ({ items, badgeVariant }: AutoResizeBadgesWithTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [displayedItems, setDisplayedItems] = useState(items);
  const [areItemsUpToDate, setAreItemsUpToDate] = useState(false);
  const [remainingItems, setRemainingItems] = useState(0);
  const [mustTruncate, setMustTruncate] = useState(false);

  useLayoutEffect(() => {
    const containerWidth = ref.current?.offsetWidth ?? 0;
    const badgeWidths = badgeRefs.current.map((badgeRef) => badgeRef?.offsetWidth ?? 0);

    function getBadgeDisplayConfig(config: UpdatedBadgeDisplayConfig, idx: number, item: BlockReason) {
      if (config.newBadgesWidth < containerWidth) {
        config.newVisibleItems.push(item);
      } else {
        config.newRemainingItems++;
      }
      const badgePadding = 8;
      config.newBadgesWidth += badgeWidths[idx] + (idx < items.length - 1 ? badgePadding : 0);

      return config;
    }

    if (areItemsUpToDate || !items.length || items.length !== badgeRefs.current.length) {
      return;
    }

    const { newVisibleItems, newBadgesWidth, newRemainingItems } = items.reduce<UpdatedBadgeDisplayConfig>(
      (config, item, idx) => getBadgeDisplayConfig(config, idx, item),
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
  }, [items, areItemsUpToDate]);

  return (
    <div ref={ref} className="truncate flex flex-nowrap [&>*:not(:last-child)]:mr-2">
      {displayedItems.map((item, idx) =>
        mustTruncate ? (
          <BadgesTooltip
            key={item.id}
            buttonOptions={{
              setLabelElem: (el) => {
                if (el) {
                  badgeRefs.current[idx] = el;
                }
              },
              className: 'truncate h-fit',
              label: item.label,
            }}
            items={[item]}
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
            key={item.id}
            className="h-fit"
          >
            <span>{item.label}</span>
          </Badge>
        ),
      )}
      {remainingItems ? (
        <BadgesTooltip
          buttonOptions={{ label: `+${remainingItems}`, className: 'h-fit' }}
          items={items}
          badgeVariant={badgeVariant}
          contentClassName="max-w-[min(400px,40vw)]"
        ></BadgesTooltip>
      ) : null}
    </div>
  );
};
