import { XUser } from '../domain/models/x-user';

interface XUserData {
  xUsername: string;
  firstBlockedAt: string;
  blockReasons: {
    id: string;
    label: string;
  }[];
}

export const mapToXUserData = (xUser: XUser): XUserData => {
  const minBlockedAtTimestamp = Math.min(...xUser.blockEvents.map((blockEvent) => blockEvent.blockedAt.getTime()));
  const firstBlockedAt = new Date(minBlockedAtTimestamp).toLocaleDateString();

  const blockReasonsWithCount = xUser.blockEvents.reduce<{ id: string; label: string; count: number }[]>((blockReasonsAcc, blockEvent) => {
    if (!blockReasonsAcc.length) {
      blockReasonsAcc = blockEvent.blockReasons.map((blockReason) => ({ id: blockReason.id, label: blockReason.label, count: 1 }));
    } else {
      blockEvent.blockReasons.forEach((blockReason) => {
        const currentBlockReason = blockReasonsAcc.find((br) => br.id === blockReason.id);
        if (currentBlockReason) {
          currentBlockReason.count++;
        } else {
          blockReasonsAcc.push({ id: blockReason.id, label: blockReason.label, count: 1 });
        }
      });
    }

    return blockReasonsAcc;
  }, []);

  return {
    xUsername: xUser.xUsername,
    firstBlockedAt,
    blockReasons: blockReasonsWithCount.map((blockReason) => ({
      id: blockReason.id,
      label: blockReason.count <= 1 ? blockReason.label : `${blockReason.label} (${blockReason.count})`,
    })),
  };
};
