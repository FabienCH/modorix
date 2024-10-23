import { showErrorToast } from '@modorix-commons/components/show-error-toast';
import { OptionalColConfig, XUsersTable } from '@modorix-commons/components/x-users-table';
import { GroupDetails } from '@modorix-commons/domain/models/group';
import { XUser } from '@modorix-commons/domain/models/x-user';
import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import { buttonVariants } from '@modorix-ui/components/button';
import { ModorixTooltip } from '@modorix-ui/components/modorix-tooltip';
import { cn } from '@modorix-ui/utils/utils';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import BackIcon from '../../public/icon/back-arrow.svg?react';
import { addToBlockQueue } from '../adapters/gateways/block-x-user-gateway';
import { getGroup } from '../adapters/gateways/group-gateway';
import GroupAddToBlockQueueCell from '../components/groups/group-add-to-block-queue-cell';
import MembershipButton from '../components/groups/membership-button';
import { AutoResizeBadgesWithTooltip } from '../components/shared/auto-resize-badges-with-tooltip';
import { addXUserToQueue } from '../domain/block-x-user/add-user-to-queue-usecase';
import { toggleMembership } from '../domain/group/toggle-group-membership-usecase';
import { ROUTES } from '../routes';

export default function GroupPage() {
  const [group, setGroup] = useState<GroupDetails>(useLoaderData() as GroupDetails);
  const [optionalColsConfig, setOptionalColsConfig] = useState<OptionalColConfig[] | undefined>();
  const { dependencies } = useDependenciesContext();
  const { userSessionInfos, setUserSessionInfos } = useUserSessionInfos();

  const runAddXUserToQueue = useCallback(
    async (xUser: XUser): Promise<void> => {
      const { userSessionStorage } = dependencies;
      await addXUserToQueue(
        xUser,
        addToBlockQueue,
        async () => setGroup(await getGroup(group.id, dependencies.userSessionStorage.getItem)),
        showErrorToast,
        {
          userSessionStorage,
          setUserSessionInfos,
        },
      );
    },
    [group, dependencies, setUserSessionInfos],
  );

  useEffect(() => {
    if (userSessionInfos?.hasValidAccessToken) {
      const tooltipTrigger = (
        <span>
          Blocked by <sup>?</sup>
        </span>
      );
      const numberOfBlockColCOnfig = {
        index: 3,
        column: {
          cellElem: (
            <ModorixTooltip
              trigger={tooltipTrigger}
              content="Members that blocked this X user"
              contentClassName="font-normal"
            ></ModorixTooltip>
          ),
          className: 'z-[1]',
        },
        getCellElem: (xUser: XUser) => (
          <span className="flex justify-center w-full">
            {xUser.blockEvents.length} / {group.membersCount}
          </span>
        ),
      };
      const addToBlockQueueColConfig = {
        index: 4,
        column: { cellElem: 'Add To Queue' },
        getCellElem: (xUser: XUser) => (
          <GroupAddToBlockQueueCell
            modorixUserId={userSessionInfos.userId}
            xUser={xUser}
            isGroupJoined={group.isJoined}
            onButtonClick={runAddXUserToQueue}
          ></GroupAddToBlockQueueCell>
        ),
      };
      setOptionalColsConfig([numberOfBlockColCOnfig, addToBlockQueueColConfig]);
    }
  }, [group, runAddXUserToQueue, userSessionInfos]);

  async function handleMembershipClick(group: GroupDetails) {
    await toggleMembership(group, showErrorToast, { ...dependencies.userSessionStorage, setUserSessionInfos });
    setGroup(await getGroup(group.id, dependencies.userSessionStorage.getItem));
  }

  return (
    <section className="w-full mx-auto max-w-screen-md">
      <NavLink className={cn(buttonVariants({ variant: 'outline' }), 'mr-2')} to={ROUTES.Groups}>
        <BackIcon className="w-[12px] mr-2" /> Back
      </NavLink>
      <header className="flex justify-between items-center	my-3">
        <h1 className="main-title pb-0">{group.name}</h1>
        {userSessionInfos?.hasValidAccessToken ? <MembershipButton group={group} onClick={() => handleMembershipClick(group)} /> : null}
      </header>
      <div className="flex justify-between mb-4">
        <p>{group.description}</p>
        <p className="text-muted-foreground font-medium">{group.membersCount} members</p>
      </div>
      <XUsersTable
        BadgesComponent={AutoResizeBadgesWithTooltip}
        blockedUsers={group.blockedXUsers}
        optionalColsConfig={optionalColsConfig}
        rowGridCols="grid-cols-[1fr_1fr_2fr_7.25rem_8.5rem]"
      />
    </section>
  );
}
