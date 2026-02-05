import { ProgressBar } from '@carbon/react';
import { CheckmarkFilled, CircleDash } from '@carbon/icons-react';
import WidgetCard from './WidgetCard';

function ChecklistItem({ item }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      {item.complete ? (
        <CheckmarkFilled size={20} style={{ color: '#24a148', flexShrink: 0, marginTop: '2px' }} />
      ) : (
        <CircleDash size={20} style={{ color: '#a8a8a8', flexShrink: 0, marginTop: '2px' }} />
      )}
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: item.complete ? '#525252' : '#161616' }}>
          {item.label}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>
          {item.detail}
        </div>
      </div>
    </div>
  );
}

export default function SetupChecklist({ data }) {
  const { completionRate, items } = data;

  const statusTag = completionRate === 100
    ? { label: 'Complete', type: 'green' }
    : { label: 'In Progress', type: 'yellow' };

  return (
    <WidgetCard
      title="Setup Checklist"
      actionLabel="Complete Setup"
      status={statusTag}
    >
      <div style={{ marginBottom: '1rem' }}>
        <ProgressBar
          label={`${completionRate}% Complete`}
          value={completionRate}
          max={100}
          size="small"
        />
      </div>

      <div className="setup-checklist__items">
        {items.map((item) => (
          <ChecklistItem key={item.id} item={item} />
        ))}
      </div>
    </WidgetCard>
  );
}
