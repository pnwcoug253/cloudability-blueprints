import { Tile, Tag, OverflowMenu, OverflowMenuItem } from '@carbon/react';

export default function WidgetCard({
  title,
  actionLabel,
  onAction = () => {},
  status,
  children,
  className = '',
}) {
  const tagKindMap = {
    green: 'green',
    yellow: 'teal',
    red: 'red',
    blue: 'blue',
  };

  return (
    <Tile className={`widget-card ${className}`}>
      <div className="widget-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ margin: 0 }}>{title}</h4>
          {status && (
            <Tag type={tagKindMap[status.type] || 'blue'} size="sm">
              {status.label}
            </Tag>
          )}
        </div>
        <OverflowMenu size="sm" flipped>
          <OverflowMenuItem itemText="View details" />
          <OverflowMenuItem itemText="Expand" />
          <OverflowMenuItem itemText="Remove from dashboard" hasDivider />
        </OverflowMenu>
      </div>

      <div className="widget-card__body">
        {children}
      </div>

      {actionLabel && (
        <div className="widget-card__action">
          <button className="action-link" onClick={onAction}>
            {actionLabel} &rarr;
          </button>
        </div>
      )}
    </Tile>
  );
}
