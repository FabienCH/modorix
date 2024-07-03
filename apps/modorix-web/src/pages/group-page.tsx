import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { GroupDetails } from '@modorix-commons/models/group';
import { XUser } from '@modorix-commons/models/x-user';
import { buttonVariants } from '@modorix-ui/components/button';
import { cn } from '@modorix-ui/utils/utils';
import { useState } from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../packages/ui/src/components/tooltip';
import BackIcon from '../../public/icon/back-arrow.svg?react';
import { addToBlockQueue } from '../adapters/gateways/block-user-gateway';
import { getGroup } from '../adapters/gateways/group-gateway';
import { AddToQueueButton } from '../components/add-to-queue-button';
import { AutoResizeBadgesWithTooltip } from '../components/auto-resize-badges-with-tooltip';
import MembershipButton from '../components/membership-button';
import { toggleMembership } from '../domain/toggle-group-membership-usecase';
import { ROUTES } from '../routes';

export default function GroupPage() {
  const [group, setGroup] = useState<GroupDetails>(useLoaderData() as GroupDetails);
  const addToBlockQueueColConfig = {
    index: 4,
    columnLabel: 'Add To Queue',
    getCellElem: (xUser: XUser) => {
      const alreadyBlocked = xUser.blockingModorixUserIds.includes('1');
      const alreadyInQueue = xUser.blockQueueModorixUserIds.includes('1');

      return alreadyBlocked || alreadyInQueue ? (
        <TooltipProvider>
          <Tooltip delayDuration={400}>
            <TooltipTrigger className={buttonVariants({ variant: 'default', size: 'sm' })} disabled>
              Add to queue
            </TooltipTrigger>
            <TooltipContent>Already {alreadyBlocked ? 'blocked' : 'in queue'} </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <AddToQueueButton onClick={() => addXUserToQueue(xUser)}></AddToQueueButton>
      );
    },
  };

  async function addXUserToQueue(xUser: XUser): Promise<void> {
    await addToBlockQueue('1', xUser.id);
    setGroup(await getGroup(group.id));
  }

  async function handleMembershipClick(group: GroupDetails) {
    await toggleMembership(group);
    setGroup(await getGroup(group.id));
  }

  return (
    <section className="w-full mx-auto max-w-screen-md">
      <NavLink className={cn(buttonVariants({ variant: 'outline' }), 'mr-2')} to={ROUTES.Groups}>
        <BackIcon className="w-[12px] mr-2" /> Back
      </NavLink>
      <div className="flex justify-between items-center	my-3">
        <h1 className="main-title pb-0">{group.name}</h1>
        <MembershipButton group={group} onClick={() => handleMembershipClick(group)} />
      </div>
      <p className="mb-4">{group.description}</p>
      <XUsersTable
        BadgesComponent={AutoResizeBadgesWithTooltip}
        blockedUsers={group.blockedXUsers}
        optionalColsConfig={[addToBlockQueueColConfig]}
        rowGridCols="grid-cols-[1fr_1fr_2fr_auto]"
      />
    </section>
  );
}
