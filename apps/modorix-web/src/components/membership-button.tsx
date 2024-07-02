import { Group, GroupDetails } from '@modorix-commons/models/group';
import { Button } from '@modorix-ui/components/button';
import { LeaveGroupDialog } from './leave-group-dialog';

interface MembershipCellProps {
  group: Group | GroupDetails;
  onClick: () => void;
}

export default function MembershipButton({ group, onClick }: MembershipCellProps) {
  return group.isJoined ? (
    <LeaveGroupDialog group={group} onClick={onClick} />
  ) : (
    <Button className="ml-3.5" size={'sm'} onClick={onClick}>
      Join
    </Button>
  );
}
