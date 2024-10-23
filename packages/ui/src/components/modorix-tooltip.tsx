import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from './tooltip';

interface ModorixTooltipProps {
  trigger: JSX.Element;
  content: JSX.Element | string;
  contentClassName?: string;
  asChild?: boolean;
  portalContent?: boolean;
}

export function ModorixTooltip({ trigger, content, contentClassName, portalContent, ...props }: ModorixTooltipProps) {
  const tooltipContent = <TooltipContent className={contentClassName}>{content}</TooltipContent>;
  return (
    <TooltipProvider>
      <Tooltip delayDuration={400}>
        <TooltipTrigger {...props}>{trigger}</TooltipTrigger>
        {portalContent ? <TooltipPortal>{tooltipContent}</TooltipPortal> : tooltipContent}
      </Tooltip>
    </TooltipProvider>
  );
}
