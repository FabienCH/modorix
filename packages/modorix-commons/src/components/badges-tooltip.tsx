import { Badge } from '@modorix-ui/components/badge';
import { ModorixTooltip } from '@modorix-ui/components/modorix-tooltip';
import { cn } from '@modorix-ui/utils/utils';

export type BadeTooltipVariant = 'outline' | 'outline-secondary';

interface BadgesTooltipProps {
  items: { id: string; label: string }[];
  buttonOptions: { label: string; className?: string; setLabelElem?: (el: HTMLDivElement) => void };
  badgeVariant: BadeTooltipVariant;
  contentClassName?: string;
}

export const BadgesTooltip = ({ items, buttonOptions, badgeVariant, contentClassName }: BadgesTooltipProps) => {
  const { label: buttonLabel, className: buttonClassName, setLabelElem } = buttonOptions;
  const tooltipTrigger = (
    <Badge ref={setLabelElem} variant={badgeVariant} className={cn('px-2.5 py-1 h-auto text-xs cursor-pointer', buttonClassName)}>
      <span className={buttonClassName}>{buttonLabel}</span>
    </Badge>
  );
  const tooltipContent = (
    <div className="flex flex-wrap gap-2 w-min">
      {items.map((item) => (
        <Badge className={'text-nowrap'} variant={badgeVariant} key={item.id}>
          {item.label}
        </Badge>
      ))}
    </div>
  );

  return (
    <ModorixTooltip
      trigger={tooltipTrigger}
      content={tooltipContent}
      contentClassName={items.length === 1 ? 'p-0 border-none' : `p-2 ${contentClassName}`}
      portalContent
      asChild
    ></ModorixTooltip>
  );
};
