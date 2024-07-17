import { XUsersTable } from '@modorix-commons/components/x-users-table';
import { Button } from '@modorix-ui/components/button';
import { useEffect, useState } from 'react';
import { BlocksQueueUpdateMessageData, RunQueueStatus } from '../../shared/messages/event-message';
import { BlockUserReasons } from './block-user-reasons';

interface BlocksQueueProps extends BlocksQueueUpdateMessageData {
  onRunQueueClick: () => Promise<void>;
}

function getButtonLabel(runQueueStatus: RunQueueStatus) {
  if (runQueueStatus === 'waitingHeaders') {
    return 'Waiting headers';
  }
  if (runQueueStatus === 'running') {
    return 'Running queue';
  }
  return 'Run queue';
}

export function BlocksQueue({ blockQueue, runQueueStatus, onRunQueueClick }: BlocksQueueProps) {
  const [state, setState] = useState<{ flexJustify: string; button: { disabled: boolean; label: string } }>({
    flexJustify: 'justify-end',
    button: { disabled: false, label: 'Run queue' },
  });

  useEffect(() => {
    const flexJustify = runQueueStatus === 'error' ? 'justify-between' : 'justify-end';
    const disabled = blockQueue.length === 0 || runQueueStatus === 'running' || runQueueStatus === 'waitingHeaders';
    const label = getButtonLabel(runQueueStatus);
    setState({ flexJustify, button: { disabled, label } });
  }, [blockQueue, runQueueStatus]);

  return (
    <>
      <div className={`flex ${state.flexJustify}`}>
        {runQueueStatus === 'error' ? (
          <p className="pr-2.5 text-destructive text-xs">Couldn't run blocks queue, make sure you are logged on X</p>
        ) : null}
        <Button className="self-end mb-2" disabled={state.button.disabled} onClick={onRunQueueClick}>
          {state.button.label}
        </Button>
      </div>
      <XUsersTable BadgesComponent={BlockUserReasons} blockedUsers={blockQueue} rowGridCols="grid-cols-[1fr_107px_140px]" />
    </>
  );
}
