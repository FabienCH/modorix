import { Badge } from '@modorix-ui/components/badge';
import { Button } from '@modorix-ui/components/button';
import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@modorix-ui/components/tooltip';
import { cn } from '@modorix-ui/utils/utils';
import { RefObject } from 'react';
import { BlockReason } from '../models/block-reason';

interface BlockUserReasonsTooltipProps {
  blockReasons: BlockReason[];
  buttonLabel: string;
  buttonClassName?: string;
  buttonLabelRef?: RefObject<HTMLSpanElement>;
}

export const BlockUserReasonsTooltip = ({ blockReasons, buttonLabel, buttonClassName, buttonLabelRef }: BlockUserReasonsTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={400}>
        <TooltipTrigger asChild>
          <Button variant="secondary" className={cn('px-2.5 py-1 h-auto text-xs', buttonClassName)}>
            <span ref={buttonLabelRef} className={buttonClassName}>
              {buttonLabel}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className={blockReasons.length === 1 ? 'p-0' : 'grid grid-cols-[auto_auto] gap-2'}>
            {blockReasons.map((blockReason) => (
              <div>
                <Badge variant={'secondary'} key={blockReason.id}>
                  {blockReason.label}
                </Badge>
              </div>
            ))}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
