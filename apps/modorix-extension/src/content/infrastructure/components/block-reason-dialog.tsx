import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { Button } from '@modorix-ui/components/button';
import {
  Dialog,
  DialogClose,
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
import { retrieveBlockReasonsList } from '../../domain/usecases/retrieve-block-reasons-usecase';
import { validateSelectedReasons } from '../../domain/validate-block-reasons';
import { FormBlockReason } from '../../models/form-block-reason';
import { FormGroup } from '../../models/form-group';
import { getBlockReasons } from '../gateways/block-reasons-gateway';
import { getJoinedGroups } from '../gateways/groups-gateway';
import { BlockReasonForm } from './block-reason-form';
import { GroupsToBlockForm } from './groups-to-block-form';

interface BlockReasonDialogProps {
  container: HTMLElement;
  username: string;
  onSubmit: (blockReasonIds: string[]) => void;
}

export function BlockReasonDialog({ container, username, onSubmit }: BlockReasonDialogProps) {
  const [open, setOpen] = useState(false);
  const [hasSubmit, setHasSubmit] = useState(false);
  const [noReasonSelected, setNoReasonSelected] = useState(false);
  const [loadReasonsError, setLoadReasonsError] = useState<string | null>(null);
  const [blockReasonsData, setBlockReasonsData] = useState<FormBlockReason[]>([]);
  const [groups, setGroups] = useState<FormGroup[]>([]);
  const { dependencies } = useDependenciesContext();

  async function runRetrieveBlockReasonsList() {
    const { blockReasons, errorMessage } = await retrieveBlockReasonsList(getBlockReasons, dependencies.userSessionStorage);
    setLoadReasonsError(errorMessage);
    setBlockReasonsData(blockReasons.map((blockReason) => ({ ...blockReason, checked: false })));
  }

  async function runRetrieveJoinedGroups() {
    const groups = await getJoinedGroups(dependencies.userSessionStorage);

    if ('error' in groups === false) {
      setGroups(groups.map((group) => ({ ...group, checked: false })));
    }
  }

  function handleOpenChange(open: boolean): void {
    runRetrieveBlockReasonsList();
    runRetrieveJoinedGroups();
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

  function handleBlockReasonsCheckedChange(blockReason: FormBlockReason): void {
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

  function handleGroupsCheckedChange(group: FormGroup): void {
    const updatedGroup = groups.map((groupItem) => {
      if (groupItem.id !== group.id) {
        return groupItem;
      }

      return { ...groupItem, checked: !groupItem.checked };
    });
    setGroups(updatedGroup);
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
          </DialogHeader>
          {loadReasonsError ? (
            <p className="text-error py-2">{loadReasonsError}</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Please choose at least one reason to block {username}</p>
              <BlockReasonForm
                formBlockReasons={blockReasonsData}
                displayNoSelectionError={noReasonSelected}
                onCheckedChange={handleBlockReasonsCheckedChange}
              ></BlockReasonForm>
              <p className="text-sm text-muted-foreground">Please select in which of your groups you want to block {username}</p>
              {groups.length ? (
                <GroupsToBlockForm formGroups={groups} onCheckedChange={handleGroupsCheckedChange}></GroupsToBlockForm>
              ) : (
                <p className="pr-2.5 text-sm text-warning">You haven't joined any group yet</p>
              )}
            </>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" disabled={!!loadReasonsError} onClick={handleSubmit}>
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
