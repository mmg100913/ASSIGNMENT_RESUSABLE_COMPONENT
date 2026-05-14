import { Accordion, type AccordionItem } from './components/Accordion/Accordion';

const productFaq: AccordionItem[] = [
  {
    id: 'usage',
    title: 'How do I use this component?',
    content:
      'Pass an array of item data. The component handles accessible button and region wiring for each panel.',
  },
  {
    id: 'state',
    title: 'Can I control the expanded state?',
    content:
      'Yes. Use expandedIds with onExpandedChange when the parent application should own the state.',
  },
  {
    id: 'multiple',
    title: 'Can several panels be open?',
    content:
      'Multiple expanded panels are allowed by default. Set shouldAllowMultipleExpanded to false for single-panel behavior.',
  },
];

export function App() {
  return (
    <main className="demo-shell">
      <section className="demo-panel" aria-labelledby="demo-title">
        <div className="demo-copy">
          <p className="demo-kicker">DLS component foundation</p>
          <h1 id="demo-title">Accordion</h1>
          <p>
            A reusable, typed React component with keyboard-friendly controls, stable ARIA
            relationships, and flexible state management.
          </p>
        </div>

        <Accordion items={productFaq} ariaLabel="Accordion component example" />
      </section>
    </main>
  );
}
