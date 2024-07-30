import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AutoResizeBadgesWithTooltip } from './auto-resize-badges-with-tooltip';

describe('Badges display', () => {
  async function setup(containerOffsetWidth: number) {
    await setMockRefElement(containerOffsetWidth);
    render(<AutoResizeBadgesWithTooltip items={blockReasons} badgeVariant="outline" />);
  }

  const setMockRefElement = async (containerOffsetWidth: number): Promise<void> => {
    const { mockContainerRef, mockBadgesRef, setContainerOffsetWidth } = await vi.hoisted(async () => {
      let containerOffsetWidth = 0;
      return {
        mockContainerRef: {
          get current() {
            return { offsetWidth: containerOffsetWidth };
          },
          set current(_) {},
        },
        mockBadgesRef: {
          get current() {
            return [{ offsetWidth: 80 }, { offsetWidth: 100 }, { offsetWidth: 50 }];
          },
          set current(_) {},
        },
        setContainerOffsetWidth: (offsetWidth: number) => {
          containerOffsetWidth = offsetWidth;
        },
      };
    });
    setContainerOffsetWidth(containerOffsetWidth);
    vi.mock('react', async (importOriginal) => {
      const react: typeof React = await importOriginal();

      return {
        ...react,
        useRef: (initialVal: unknown) => (Array.isArray(initialVal) ? mockBadgesRef : mockContainerRef),
      };
    });
  };

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

  it('should display all badges entirely when container is big enough', async () => {
    await setup(80 + 100 + 50 + badgesPaddings);

    const harassment = screen.getByText('Harassment');
    const racism = screen.getByText('Racism / Xenophobia');
    const fakeNews = screen.getByText('Spreading fake news');

    expect(harassment.className).not.toContain('truncate');
    expect(racism.className).not.toContain('truncate');
    expect(fakeNews.className).not.toContain('truncate');
  });

  it('should display all badges truncated when container is a little bit too small', async () => {
    await setup(80 + 100 + 49 + badgesPaddings);

    const harassment = screen.getByText('Harassment');
    const racism = screen.getByText('Racism / Xenophobia');
    const fakeNews = screen.getByText('Spreading fake news');

    expect(harassment.className).toContain('truncate');
    expect(racism.className).toContain('truncate');
    expect(fakeNews.className).toContain('truncate');
  });

  it('should not display all badges when container small', async () => {
    await setup(80 + 100 + badgesPaddings);

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
