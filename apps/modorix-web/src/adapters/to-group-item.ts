import { BlockEvent } from '@modorix-commons/domain/models/block-event';

export const mapToGroupItem = (
  blockEvents: BlockEvent[],
): {
  id: string;
  label: string;
}[] => {
  return blockEvents.reduce<{ id: string; label: string }[]>((groupItemsAcc, blockEvent) => {
    if (!groupItemsAcc.length) {
      groupItemsAcc = blockEvent.blockedInGroups.map((group) => ({ id: group.id, label: group.name }));
    } else {
      blockEvent.blockedInGroups.forEach((group) => {
        const currentGroup = groupItemsAcc.find((item) => item.id === group.id);
        if (!currentGroup) {
          groupItemsAcc.push({ id: group.id, label: group.name });
        }
      });
    }

    return groupItemsAcc;
  }, []);
};
