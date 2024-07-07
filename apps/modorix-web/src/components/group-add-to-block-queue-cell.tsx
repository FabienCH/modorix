import { XUser } from '../../../../packages/modorix-commons/src/models/x-user';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../packages/ui/src/components/tooltip';
import { AddToQueueButton } from './add-to-queue-button';

interface GroupAddToBlockQueueCellProps {
  xUser: XUser;
  isGroupJoined: boolean;
  onButtonClick: (xUser: XUser) => Promise<void>;
}

export default function GroupAddToBlockQueueCell({ xUser, isGroupJoined, onButtonClick }: GroupAddToBlockQueueCellProps) {
  const alreadyBlocked = xUser.blockingModorixUserIds.includes('1');
  const alreadyInQueue = xUser.blockQueueModorixUserIds.includes('1');
  const tooltipContent = !isGroupJoined
    ? 'Join group to add this X user to your queue'
    : `Already ${alreadyBlocked ? 'blocked' : 'in queue'}`;
  const isAddToQueueDisabled = !isGroupJoined || alreadyBlocked || alreadyInQueue;

  return isAddToQueueDisabled ? (
    <TooltipProvider>
      <Tooltip delayDuration={400}>
        <TooltipTrigger asChild>
          <span>
            <AddToQueueButton disabled onClick={() => onButtonClick(xUser)}></AddToQueueButton>
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <AddToQueueButton onClick={() => onButtonClick(xUser)}></AddToQueueButton>
  );
}
