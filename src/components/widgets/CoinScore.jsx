import { Tag } from '@carbon/react';
import WidgetCard from './WidgetCard';

function getStatus(score) {
  if (score >= 75) return { label: 'Strong', type: 'green' };
  if (score >= 50) return { label: 'Improving', type: 'yellow' };
  return { label: 'Needs Work', type: 'red' };
}

function BreakdownRow({ item }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.375rem 0',
        fontSize: '0.875rem',
      }}
    >
      <span style={{ flex: '0 0 120px', fontWeight: 500 }}>{item.category}</span>
      <div style={{ flex: '1 1 auto', backgroundColor: '#e0e0e0', borderRadius: '2px', height: '8px' }}>
        <div
          style={{
            width: `${item.score}%`,
            height: '100%',
            backgroundColor: item.score >= 75 ? '#24a148' : item.score >= 50 ? '#f1c21b' : '#da1e28',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <span style={{ flex: '0 0 50px', textAlign: 'right', color: '#525252' }}>
        {item.score}/100
      </span>
      <span style={{ flex: '0 0 40px', textAlign: 'right', color: '#6f6f6f' }}>
        {item.weight}%
      </span>
    </div>
  );
}

export default function CoinScore({ data }) {
  const { score, maxScore, trend, period, breakdown } = data;

  const statusTag = getStatus(score);

  return (
    <WidgetCard
      title="COIN Score"
      actionLabel="View COIN Details"
      status={statusTag}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Tag type="blue" size="sm">Premium</Tag>
      </div>

      <div className="coin-score__value" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.25rem' }}>
        {score}
        <span className="coin-score__max" style={{ fontSize: '1.5rem', fontWeight: 400, color: '#6f6f6f' }}>
          /{maxScore}
        </span>
      </div>

      <div style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1.25rem' }}>
        &uarr; {trend} pts {period}
      </div>

      <div>
        <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Breakdown</h5>
        {breakdown.map((item) => (
          <BreakdownRow key={item.category} item={item} />
        ))}
      </div>
    </WidgetCard>
  );
}
