import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AutoResizeBadgesWithTooltip } from './auto-resize-badges-with-tooltip';

describe('Badges display', () => {
  function setup(containerOffsetWidth: number) {
    setMockRefElement(containerOffsetWidth);
    render(<AutoResizeBadgesWithTooltip items={blockReasons} badgeVariant="outline" />);
  }

  let nbOfUseRefCalls = 0;
  const badgesPaddings = 16;
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

  const setMockRefElement = (containerOffsetWidth: number): void => {
    const mockRef = {
      get current() {
        return {
          offsetWidth: containerOffsetWidth,
          map: () => [80, 100, 50],
        };
      },
      set current(_) {},
    };

    jest.spyOn(React, 'useRef').mockImplementation(() => {
      if (nbOfUseRefCalls < 8) {
        nbOfUseRefCalls++;
        return mockRef;
      }
      return jest.requireActual('react').useRef;
    });
  };

  beforeEach(async () => {
    nbOfUseRefCalls = 0;
  });

  it('should display all badges entirely when container is big enough', async () => {
    setup(80 + 100 + 50 + badgesPaddings);

    const harassment = screen.getByText('Harassment');
    const racism = screen.getByText('Racism / Xenophobia');
    const fakeNews = screen.getByText('Spreading fake news');

    expect(harassment.className).not.toContain('truncate');
    expect(racism.className).not.toContain('truncate');
    expect(fakeNews.className).not.toContain('truncate');
  });

  it('should display all badges truncated when container is a little bit too small', async () => {
    setup(80 + 100 + 49 + badgesPaddings);

    const harassment = screen.getByText('Harassment');
    const racism = screen.getByText('Racism / Xenophobia');
    const fakeNews = screen.getByText('Spreading fake news');

    expect(harassment.className).toContain('truncate');
    expect(racism.className).toContain('truncate');
    expect(fakeNews.className).toContain('truncate');
  });

  it('should not display all badges when container small', async () => {
    setup(80 + 100 + badgesPaddings);

    const harassment = screen.getByText('Harassment');
    const racism = screen.getByText('Racism / Xenophobia');
    const fakeNews = screen.queryByText('Spreading fake news');
    const showAllBadgesTooltip = screen.queryByText('+1');

    expect(harassment.className).toContain('truncate');
    expect(racism.className).toContain('truncate');
    expect(fakeNews).not.toBeInTheDocument();
    expect(showAllBadgesTooltip).toBeInTheDocument();
  });
});
