import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { renderWithUser } from '../../test/renderWithUser';
import { Accordion, type AccordionItem } from './Accordion';

const panels: AccordionItem[] = [
  {
    id: 'panel-one',
    title: 'Panel one',
    content: 'Content for panel one',
  },
  {
    id: 'panel-two',
    title: 'Panel two',
    content: 'Content for panel two',
  },
  {
    id: 'panel-three',
    title: 'Panel three',
    content: 'Content for panel three',
  },
];

function renderAccordion(props = {}) {
  return <Accordion items={panels} {...props} />;
}

describe('Accordion', () => {
  test('renders accordion with multiple panels', () => {
    render(renderAccordion());
    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(3);
    expect(screen.queryByText('Content for panel one')).toBeNull();
    expect(screen.queryByText('Content for panel two')).toBeNull();
    expect(screen.queryByText('Content for panel three')).toBeNull();
  });

  test('shows content for the clicked panel and hides the rest', async () => {
    const { user } = renderWithUser(renderAccordion());
    const buttons = screen.getAllByRole('button');

    await user.click(buttons[1]);

    expect(screen.getByText('Content for panel two')).toBeVisible();
    expect(screen.queryByText('Content for panel one')).toBeNull();
    expect(screen.queryByText('Content for panel three')).toBeNull();
  });

  test('hides content when an expanded panel is clicked again', async () => {
    const { user } = renderWithUser(renderAccordion());
    const buttons = screen.getAllByRole('button');

    await user.click(buttons[2]);
    expect(screen.getByText('Content for panel three')).toBeVisible();

    await user.click(buttons[2]);
    expect(screen.queryByText('Content for panel three')).toBeNull();
  });

  test('can expand multiple panels at the same time by default', async () => {
    const { user } = renderWithUser(renderAccordion());
    const buttons = screen.getAllByRole('button');

    await user.click(buttons[0]);
    await user.click(buttons[2]);

    expect(screen.getByText('Content for panel one')).toBeVisible();
    expect(screen.queryByText('Content for panel two')).toBeNull();
    expect(screen.getByText('Content for panel three')).toBeVisible();
  });

  describe('when shouldAllowMultipleExpanded is false', () => {
    test('only one panel is visible at a time', async () => {
      const { user } = renderWithUser(renderAccordion({ shouldAllowMultipleExpanded: false }));
      const buttons = screen.getAllByRole('button');

      await user.click(buttons[0]);
      expect(screen.getByText('Content for panel one')).toBeVisible();

      await user.click(buttons[2]);
      expect(screen.getByText('Content for panel three')).toBeVisible();
      expect(screen.queryByText('Content for panel one')).toBeNull();
    });
  });

  describe('accessibility', () => {
    test('each button has aria-controls pointing to its content region', () => {
      render(renderAccordion());
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        const controlsId = button.getAttribute('aria-controls');

        expect(controlsId).toBeTruthy();
        expect(document.getElementById(controlsId!)).toBeInTheDocument();
      });
    });

    test('content regions have aria-labelledby pointing back to their header', () => {
      render(renderAccordion());
      const regions = screen.getAllByRole('region', { hidden: true });

      regions.forEach((region) => {
        const labelledBy = region.getAttribute('aria-labelledby');

        expect(labelledBy).toBeTruthy();
        expect(document.getElementById(labelledBy!)).toBeInTheDocument();
      });
    });

    test('can expand and collapse a panel with the keyboard', async () => {
      const { user } = renderWithUser(renderAccordion());
      const secondButton = screen.getByRole('button', { name: /panel two/i });

      secondButton.focus();
      await user.keyboard('{Enter}');
      expect(screen.getByText('Content for panel two')).toBeVisible();

      await user.keyboard(' ');
      expect(screen.queryByText('Content for panel two')).toBeNull();
    });

    test('moves focus through the panel triggers in document order', async () => {
      const { user } = renderWithUser(renderAccordion());
      const buttons = screen.getAllByRole('button');

      await user.tab();
      expect(buttons[0]).toHaveFocus();

      await user.tab();
      expect(buttons[1]).toHaveFocus();

      await user.tab();
      expect(buttons[2]).toHaveFocus();
    });
  });

  test('supports controlled expanded state changes', async () => {
    const onExpandedChange = vi.fn();
    const { user } = renderWithUser(
      <Accordion items={panels} expandedIds={['panel-one']} onExpandedChange={onExpandedChange} />,
    );

    await user.click(screen.getByRole('button', { name: /panel three/i }));

    expect(screen.getByText('Content for panel one')).toBeVisible();
    expect(onExpandedChange).toHaveBeenCalledWith(['panel-one', 'panel-three']);
  });
});
