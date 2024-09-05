import { Button, buttonVariants } from '@modorix-ui/components/button';
import { type VariantProps } from 'class-variance-authority';
import { Group, GroupDetails } from '../../../../../packages/modorix-commons/src/domain/models/group';
import { LeaveGroupDialog } from './leave-group-dialog';

interface MembershipButtonProps {
  group: Group | GroupDetails;
  size?: VariantProps<typeof buttonVariants>['size'];
  onClick: () => void;
}

export default function MembershipButton({ group, onClick, size }: MembershipButtonProps) {
  return group.isJoined ? (
    <LeaveGroupDialog group={group} buttonSize={size ?? 'default'} onClick={onClick} />
  ) : (
    <Button className="ml-3.5" size={size ?? 'default'} onClick={onClick}>
      Join
    </Button>
  );
}
