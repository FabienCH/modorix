import { Badge } from '@modorix-ui/components/badge';
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger, Tooltips } from '@modorix-ui/components/tooltip';
import { cn } from '@modorix-ui/utils/utils';

interface BadgesTooltipProps {
  items: { id: string; label: string }[];
  buttonOptions: { label: string; className?: string; setLabelElem?: (el: HTMLDivElement) => void };
  badgeVariant: 'outline' | 'secondary';
  contentClassName?: string;
}

export const BadgesTooltip = ({ items, buttonOptions, badgeVariant, contentClassName }: BadgesTooltipProps) => {
  const { label: buttonLabel, className: buttonClassName, setLabelElem } = buttonOptions;

  return (
    <TooltipProvider>
      <Tooltips delayDuration={400}>
        <TooltipTrigger asChild>
          <Badge ref={setLabelElem} variant={badgeVariant} className={cn('px-2.5 py-1 h-auto text-xs cursor-pointer', buttonClassName)}>
            <span className={buttonClassName}>{buttonLabel}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className={items.length === 1 ? 'p-0' : `p-2 ${contentClassName}`}>
            <div className="flex flex-wrap gap-2 w-min">
              {items.map((item) => (
                <Badge className={'text-nowrap'} variant={badgeVariant} key={item.id}>
                  {item.label}
                </Badge>
              ))}
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltips>
    </TooltipProvider>
  );
};
