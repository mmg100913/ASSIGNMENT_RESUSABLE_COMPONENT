import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, type AccordionItem } from './Accordion';

const sampleItems: AccordionItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: 'Use the Accordion to group related content behind compact, scannable headings.',
  },
  {
    id: 'implementation',
    title: 'Implementation details',
    content:
      'Each trigger is a native button. Content regions stay connected through aria-controls and aria-labelledby.',
  },
  {
    id: 'guidance',
    title: 'Usage guidance',
    content:
      'Allow multiple panels for reference-heavy content. Limit to one panel when the panels are mutually exclusive.',
  },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: {
    items: sampleItems,
    ariaLabel: 'Accordion story example',
  },
  argTypes: {
    items: {
      control: 'object',
    },
    shouldAllowMultipleExpanded: {
      control: 'boolean',
    },
    defaultExpandedIds: {
      control: 'object',
    },
    expandedIds: {
      table: {
        disable: true,
      },
    },
    onExpandedChange: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MultiplePanels: Story = {
  args: {
    shouldAllowMultipleExpanded: true,
  },
};

export const SinglePanel: Story = {
  args: {
    shouldAllowMultipleExpanded: false,
    defaultExpandedIds: ['overview'],
  },
};

export const InitiallyExpanded: Story = {
  args: {
    defaultExpandedIds: ['overview', 'guidance'],
  },
};
