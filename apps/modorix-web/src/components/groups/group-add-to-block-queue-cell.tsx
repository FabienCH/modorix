import { XUser } from '@modorix-commons/domain/models/x-user';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@modorix-ui/components/tooltip';
import { AddToQueueButton } from '../shared/add-to-queue-button';

interface GroupAddToBlockQueueCellProps {
  xUser: XUser;
  isGroupJoined: boolean;
  modorixUserId: string;
  onButtonClick: (xUser: XUser) => Promise<void>;
}

export default function GroupAddToBlockQueueCell({ xUser, isGroupJoined, modorixUserId, onButtonClick }: GroupAddToBlockQueueCellProps) {
  const alreadyBlocked = xUser.blockEvents.find((event) => event.modorixUserId === modorixUserId);
  console.log('🚀 ~ GroupAddToBlockQueueCell ~ alreadyBlocked:', alreadyBlocked);
  const alreadyInQueue = xUser.blockQueueModorixUserIds.includes(modorixUserId);
  console.log('🚀 ~ GroupAddToBlockQueueCell ~ alreadyInQueue:', alreadyInQueue);
  console.log('🚀 ~ GroupAddToBlockQueueCell ~ isGroupJoined:', isGroupJoined);
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
