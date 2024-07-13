import { Button } from '@modorix-ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogPrimitive,
  DialogTitle,
  DialogTrigger,
  contentClassName,
} from '@modorix-ui/components/dialog';
import { useState } from 'react';
import { FormBlockReason } from '../../models/form-block-reason';
import { validateSelectedReasons } from '../../validate-block-reasons';
import { getBlockReasons } from '../gateways/block-reasons-gateway';
import { BlockReasonForm } from './block-reason-form';

interface BlockReasonDialogProps {
  container: HTMLElement;
  username: string;
  onSubmit: (blockReasonIds: string[]) => void;
}

export function BlockReasonDialog({ container, username, onSubmit }: BlockReasonDialogProps) {
  const [open, setOpen] = useState(false);
  const [hasSubmit, setHasSubmit] = useState(false);
  const [noReasonSelected, setNoReasonSelected] = useState(false);
  const [blockReasonsData, setBlockReasonsData] = useState<FormBlockReason[]>([]);

  async function retrieveBlockedUsersList() {
    const blockReasons = await getBlockReasons();
    setBlockReasonsData(blockReasons.map((blockReason) => ({ ...blockReason, checked: false })));
  }

  function handleOpenChange(open: boolean): void {
    retrieveBlockedUsersList();
    setOpen(open);
  }

  function handleSubmit(): void {
    if (!hasSubmit) {
      setHasSubmit(true);
    }

    const blockReasonError = validateSelectedReasons(blockReasonsData);
    setNoReasonSelected(blockReasonError instanceof Error);
    if (blockReasonError) {
      return;
    }

    onSubmit(getSelectedReasons());
    setOpen(false);
  }

  function getSelectedReasons(updatedBlockReasons?: FormBlockReason[]): string[] {
    return (updatedBlockReasons ?? blockReasonsData).filter((blockReason) => blockReason.checked).map((blockReason) => blockReason.id);
  }

  function handleCheckedChange(blockReason: FormBlockReason): void {
    const updatedBlockReasons = blockReasonsData.map((blockReasonItem) => {
      if (blockReasonItem.id !== blockReason.id) {
        return blockReasonItem;
      }

      return { ...blockReasonItem, checked: !blockReasonItem.checked };
    });
    setBlockReasonsData(updatedBlockReasons);

    if (hasSubmit) {
      const blockReasonError = validateSelectedReasons(updatedBlockReasons);
      setNoReasonSelected(blockReasonError instanceof Error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="my-4 text-[15px]" variant="destructive">
          Block with Modorix
        </Button>
      </DialogTrigger>
      <DialogPortal container={container}>
        <DialogOverlay />
        <DialogPrimitive.Content className={contentClassName}>
          <DialogHeader>
            <DialogTitle>Block {username}</DialogTitle>
            <DialogDescription>Please choose at least one reason to block {username}</DialogDescription>
          </DialogHeader>
          <BlockReasonForm
            formBlockReasons={blockReasonsData}
            displayNoSelectionError={noReasonSelected}
            onCheckedChange={handleCheckedChange}
          ></BlockReasonForm>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleSubmit}>
              Block {username}
            </Button>
          </DialogFooter>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
