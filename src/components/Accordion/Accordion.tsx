import { useId, useMemo, useState, type ReactNode } from 'react';
import './Accordion.css';

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  shouldAllowMultipleExpanded?: boolean;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  className?: string;
  ariaLabel?: string;
};

function toggleExpandedId(
  currentIds: string[],
  selectedId: string,
  shouldAllowMultipleExpanded: boolean,
) {
  const isExpanded = currentIds.includes(selectedId);

  if (isExpanded) {
    return currentIds.filter((id) => id !== selectedId);
  }

  if (shouldAllowMultipleExpanded) {
    return [...currentIds, selectedId];
  }

  return [selectedId];
}

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function Accordion({
  items,
  shouldAllowMultipleExpanded = true,
  defaultExpandedIds = [],
  expandedIds,
  onExpandedChange,
  className,
  ariaLabel,
}: AccordionProps) {
  const reactId = useId();
  const [internalExpandedIds, setInternalExpandedIds] = useState(defaultExpandedIds);
  const activeExpandedIds = expandedIds ?? internalExpandedIds;

  const availableIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);
  const visibleExpandedIds = activeExpandedIds.filter((id) => availableIds.has(id));

  const setExpandedIds = (nextExpandedIds: string[]) => {
    if (expandedIds === undefined) {
      setInternalExpandedIds(nextExpandedIds);
    }

    onExpandedChange?.(nextExpandedIds);
  };

  return (
    <div className={cx('dls-accordion', className)} aria-label={ariaLabel}>
      {items.map((item) => {
        const isExpanded = visibleExpandedIds.includes(item.id);
        const triggerId = `${reactId}-${item.id}-trigger`;
        const panelId = `${reactId}-${item.id}-panel`;

        return (
          <div className="dls-accordion__item" key={item.id}>
            <button
              aria-controls={panelId}
              aria-expanded={isExpanded}
              className="dls-accordion__trigger"
              disabled={item.disabled}
              id={triggerId}
              type="button"
              onClick={() => {
                setExpandedIds(
                  toggleExpandedId(visibleExpandedIds, item.id, shouldAllowMultipleExpanded),
                );
              }}
            >
              <span className="dls-accordion__title">{item.title}</span>
              <span aria-hidden="true" className="dls-accordion__icon" />
            </button>

            <div
              aria-labelledby={triggerId}
              className="dls-accordion__panel"
              hidden={!isExpanded}
              id={panelId}
              role="region"
            >
              {isExpanded ? <div className="dls-accordion__content">{item.content}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
