import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { GroupDetails } from '@modorix-commons/models/group';
import { buttonVariants } from '@modorix-ui/components/button';
import { cn } from '@modorix-ui/utils/utils';
import { useState } from 'react';
import { NavLink, useLoaderData } from 'react-router-dom';
import BackIcon from '../../public/icon/back-arrow.svg?react';
import { getGroup } from '../adapters/gateways/group-gateway';
import { BlockUserReasons } from '../components/block-user-reasons';
import MembershipButton from '../components/membership-button';
import { toggleMemberShip } from '../domain/toggle-group-membership-usecase';
import { ROUTES } from '../routes';

export default function GroupPage() {
  const [group, setGroup] = useState<GroupDetails>(useLoaderData() as GroupDetails);
  async function handleClick(group: GroupDetails) {
    await toggleMemberShip(group);
    setGroup(await getGroup(group.id));
  }

  return (
    <section className="w-full mx-auto max-w-screen-md">
      <NavLink className={cn(buttonVariants({ variant: 'outline' }), 'mr-2')} to={ROUTES.Groups}>
        <BackIcon className="w-[12px] mr-2" /> Back
      </NavLink>
      <div className="flex justify-between items-center	my-3">
        <h1 className="main-title pb-0">{group.name}</h1>
        <MembershipButton group={group} onClick={() => handleClick(group)} />
      </div>
      <p className="mb-4">{group.description}</p>
      <XUsersTable BlockReasonComponent={BlockUserReasons} blockedUsers={group.blockedXUsers} rowGridCols="grid-cols-[1fr_1fr_2fr]" />
    </section>
  );
}
