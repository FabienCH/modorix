import { Badge } from '@modorix-ui/components/badge';
import { Button } from '@modorix-ui/components/button';
import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@modorix-ui/components/tooltip';
import { cn } from '@modorix-ui/utils/utils';
import { BlockReason } from '../models/block-reason';

interface BlockUserReasonsTooltipProps {
  blockReasons: BlockReason[];
  buttonOptions: { label: string; className?: string; setLabelElem?: (el: HTMLSpanElement) => void };
  contentClassName?: string;
}

export const BlockUserReasonsTooltip = ({ blockReasons, buttonOptions, contentClassName }: BlockUserReasonsTooltipProps) => {
  const { label: buttonLabel, className: buttonClassName, setLabelElem } = buttonOptions;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={400}>
        <TooltipTrigger asChild>
          <Button variant="secondary" className={cn('px-2.5 py-1 h-auto text-xs', buttonClassName)}>
            <span ref={setLabelElem} className={buttonClassName}>
              {buttonLabel}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className={blockReasons.length === 1 ? 'p-0' : `p-2 ${contentClassName}`}>
            <div className="flex flex-wrap gap-2 w-min">
              {blockReasons.map((blockReason) => (
                <Badge className={'text-nowrap'} variant={'secondary'} key={blockReason.id}>
                  {blockReason.label}
                </Badge>
              ))}
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
