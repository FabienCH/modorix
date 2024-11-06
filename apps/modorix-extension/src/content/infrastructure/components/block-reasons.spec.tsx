import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { MockInstance } from 'vitest';
import * as BlockReasonsGateway from '../gateways/block-reasons-gateway';
import * as GroupsGateway from '../gateways/groups-gateway';
import { BlockReasonDialog } from './block-reason-dialog';

async function clickOnCheckbox(name: string) {
  const checkbox = await screen.findByRole('checkbox', { name });
  act(() => {
    fireEvent.click(checkbox);
  });
}

function clickToSubmitForm() {
  const submitButton = screen.getByRole('button', { name: 'Block Xusername' });
  fireEvent.click(submitButton);
}

describe('Block user reasons', () => {
  const blockReasons = [
    {
      id: '0',
      label: 'Harassment',
    },
    {
      id: '1',
      label: 'Racism / Xenophobia',
    },
    {
      id: '2',
      label: 'Spreading fake news',
    },
  ];
  const groups = [
    {
      id: 'FR',
      name: 'France',
      description: '',
      isJoined: true,
    },
    {
      id: 'scientists',
      name: 'Scientists',
      description: '',
      isJoined: true,
    },
  ];
  let getBlockReasonsSpy: MockInstance;
  let getGroupsSpy: MockInstance;
  let selectedBlockReasonIds: string[] | undefined;
  let selectedGroupIds: string[] | undefined;

  beforeEach(async () => {
    getBlockReasonsSpy = vi.spyOn(BlockReasonsGateway, 'getBlockReasons');
    getGroupsSpy = vi.spyOn(GroupsGateway, 'getJoinedGroups');
    getBlockReasonsSpy.mockReturnValue(await blockReasons);
    getGroupsSpy.mockReturnValue(await groups);
    selectedBlockReasonIds = undefined;
    selectedGroupIds = undefined;

    render(
      <BlockReasonDialog
        container={document.body}
        username="Xusername"
        onSubmit={(blockReasonIds, groupIds) => {
          selectedBlockReasonIds = blockReasonIds;
          selectedGroupIds = groupIds;
        }}
      />,
    );

    const openDialogButton = screen.getByText('Block with Modorix');
    await act(async () => {
      await fireEvent.click(openDialogButton);
    });
  });

  describe('When blocking a user', () => {
    it('should block a user with a least one reason', async () => {
      await clickOnCheckbox('Harassment');

      clickToSubmitForm();

      expect(selectedBlockReasonIds).toEqual(['0']);
    });

    it('should block a user with multiple reasons and groups', async () => {
      await clickOnCheckbox('Harassment');
      await clickOnCheckbox('Racism / Xenophobia');
      await clickOnCheckbox('France');

      clickToSubmitForm();

      expect(selectedBlockReasonIds).toEqual(['0', '1']);
      expect(selectedGroupIds).toEqual(['FR']);
    });

    it('should not block a user with no reason', async () => {
      clickToSubmitForm();

      expect(selectedBlockReasonIds).toBeUndefined();
    });

    it('should not display an error message if no reason selected but the form has not been submitted', async () => {
      await clickOnCheckbox('Harassment');
      await clickOnCheckbox('Harassment');

      const errorMessage = screen.queryByText('Please select at least one reason.');

      expect(errorMessage).not.toBeInTheDocument();
      expect(selectedBlockReasonIds).toBeUndefined();
    });

    it('should display an error message if no reason selected and the form has been submitted', async () => {
      clickToSubmitForm();

      const errorMessage = screen.queryByText('Please select at least one reason.');

      expect(errorMessage).toBeInTheDocument();
      expect(selectedBlockReasonIds).toBeUndefined();
    });

    it('should display an error message if form has been submitted and no reason is selected ', async () => {
      clickToSubmitForm();

      await clickOnCheckbox('Harassment');

      const notDisplayedErrorMessage = screen.queryByText('Please select at least one reason.');
      expect(notDisplayedErrorMessage).not.toBeInTheDocument();

      await clickOnCheckbox('Harassment');

      const displayedErrorMessage = screen.queryByText('Please select at least one reason.');
      expect(displayedErrorMessage).toBeInTheDocument();
    });
  });
});
