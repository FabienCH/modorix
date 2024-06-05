import { Group } from '@modorix-commons/models/group';
import { Button } from '@modorix-ui/components/button';
import { LeaveGroupDialog } from './leave-group-dialog';

interface MembershipCellProps {
  group: Group;
  onClick: () => void;
}

export default function MembershipCell({ group, onClick }: MembershipCellProps) {
  return group.isJoined ? (
    <LeaveGroupDialog group={group} onClick={onClick} />
  ) : (
    <Button className="ml-2.5" onClick={onClick}>
      Join
    </Button>
  );
}
