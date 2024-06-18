import { Group, GroupDetails } from '@modorix-commons/models/group';
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

interface LeaveGroupDialogProps {
  group: Group | GroupDetails;
  onClick: () => void;
}

export function LeaveGroupDialog({ group, onClick }: LeaveGroupDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-[5px]" variant="destructive">
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
