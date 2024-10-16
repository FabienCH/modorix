import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@modorix-ui/components/alert-dialog';
import { Button, buttonVariants } from '@modorix-ui/components/button';
import { type VariantProps } from 'class-variance-authority';

interface LeaveGroupDialogProps {
  group: Group | GroupDetails;
  buttonSize: VariantProps<typeof buttonVariants>['size'];
  onClick: () => void;
}

export function LeaveGroupDialog({ group, onClick, buttonSize }: LeaveGroupDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-[8px]" variant="destructive" size={buttonSize}>
          Leave
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave {group.name}</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to leave {group.name} group ? </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={onClick}>
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
