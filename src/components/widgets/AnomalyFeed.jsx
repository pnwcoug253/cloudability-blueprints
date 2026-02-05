import { Tag } from '@carbon/react';
import { formatCurrency } from '../../utils/formatCurrency';
import WidgetCard from './WidgetCard';

function SeverityTag({ severity }) {
  const kindMap = {
    critical: 'red',
    warning: 'teal',
    info: 'blue',
  };
  return (
    <Tag type={kindMap[severity] || 'blue'} size="sm">
      {severity}
    </Tag>
  );
}

function AnomalyRow({ anomaly }) {
  const { severity, service, region, resource, impact, percentChange, timeframe } = anomaly;

  return (
    <div
      className="anomaly-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e0e0e0',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto' }}>
        <SeverityTag severity={severity} />
        <div>
          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
            {service}
            {region && <span style={{ color: '#6f6f6f', marginLeft: '0.5rem' }}>{region}</span>}
          </div>
          {resource && (
            <div style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>{resource}</div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
          {formatCurrency(impact)} (+{percentChange}%)
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>{timeframe}</div>
      </div>

      <button className="action-link" style={{ marginTop: 0, flex: '0 0 auto' }}>
        Investigate &rarr;
      </button>
    </div>
  );
}

export default function AnomalyFeed({ data, variant = 'full' }) {
  const isTeam = variant === 'team';
  const anomalies = isTeam ? (data.teamAnomalies || []) : (data.anomalies || []);
  const title = isTeam ? 'My Anomalies' : 'Anomaly Feed';
  const totalActive = isTeam ? anomalies.length : data.totalActive;

  const statusTag = {
    label: `${totalActive} Active`,
    type: totalActive > 3 ? 'red' : 'yellow',
  };

  return (
    <WidgetCard
      title={title}
      actionLabel="View All Anomalies"
      status={statusTag}
    >
      <div className="anomaly-feed__list">
        {anomalies.map((anomaly) => (
          <AnomalyRow key={anomaly.id} anomaly={anomaly} />
        ))}
        {anomalies.length === 0 && (
          <p style={{ color: '#6f6f6f', padding: '1rem 0' }}>No anomalies detected.</p>
        )}
      </div>
    </WidgetCard>
  );
}
