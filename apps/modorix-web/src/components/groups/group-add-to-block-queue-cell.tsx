import { XUser } from '@modorix-commons/domain/models/x-user';
import { ModorixTooltip } from '@modorix-ui/components/modorix-tooltip';
import { AddToQueueButton } from '../shared/add-to-queue-button';

interface GroupAddToBlockQueueCellProps {
  xUser: XUser;
  isGroupJoined: boolean;
  modorixUserId: string;
  onButtonClick: (xUser: XUser) => Promise<void>;
}

export default function GroupAddToBlockQueueCell({ xUser, isGroupJoined, modorixUserId, onButtonClick }: GroupAddToBlockQueueCellProps) {
  const alreadyBlocked = xUser.blockEvents.find((event) => event.modorixUserId === modorixUserId);
  const alreadyInQueue = xUser.blockQueueModorixUserIds.includes(modorixUserId);
  const tooltipContent = !isGroupJoined
    ? 'Join group to add this X user to your queue'
    : `Already ${alreadyBlocked ? 'blocked' : 'in queue'}`;
  const isAddToQueueDisabled = !isGroupJoined || alreadyBlocked || alreadyInQueue;
  const tooltipTrigger = (
    <span>
      <AddToQueueButton disabled onClick={() => onButtonClick(xUser)}></AddToQueueButton>
    </span>
  );

  return isAddToQueueDisabled ? (
    <ModorixTooltip trigger={tooltipTrigger} content={tooltipContent} asChild></ModorixTooltip>
  ) : (
    <AddToQueueButton onClick={() => onButtonClick(xUser)}></AddToQueueButton>
  );
}
