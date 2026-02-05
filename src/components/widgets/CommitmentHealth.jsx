import { GaugeChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';
import { formatCurrency } from '../../utils/formatCurrency';

function CommitmentRow({ commitment }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e0e0e0',
        fontSize: '0.875rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 500 }}>{commitment.provider}</span>
        <span style={{ color: '#6f6f6f' }}>{commitment.type}</span>
      </div>
      <span style={{ fontWeight: 600 }}>{commitment.utilization}%</span>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        flex: '1 1 45%',
        padding: '0.75rem',
        backgroundColor: '#f4f4f4',
        borderRadius: '4px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: '#6f6f6f', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

export default function CommitmentHealth({ data, variant = 'default' }) {
  const isPortfolio = variant === 'portfolio';

  const {
    overallUtilization,
    overallCoverage,
    totalValue,
    savingsRate,
    commitments,
    recommendation,
    renewingIn90Days,
  } = data;

  const title = isPortfolio ? 'Commitment Portfolio' : 'Commitment Health';

  const statusTag = overallUtilization >= 75
    ? { label: 'Healthy', type: 'green' }
    : { label: 'Below Target', type: 'yellow' };

  const gaugeData = [{ group: 'Utilization', value: overallUtilization }];
  const gaugeOptions = {
    resizable: true,
    height: '180px',
    gauge: { type: 'semi' },
    toolbar: { enabled: false },
  };

  return (
    <WidgetCard
      title={title}
      actionLabel="Open Commitment Manager"
      status={statusTag}
    >
      {isPortfolio ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <SummaryCard label="Total Value" value={formatCurrency(totalValue, false)} />
          <SummaryCard label="Savings Rate" value={`${savingsRate}%`} />
          <SummaryCard label="Coverage" value={`${overallCoverage}%`} />
          <SummaryCard label="Renewing" value={formatCurrency(renewingIn90Days)} />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <GaugeChart data={gaugeData} options={gaugeOptions} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            {commitments.map((commitment, idx) => (
              <CommitmentRow key={idx} commitment={commitment} />
            ))}
          </div>

          {recommendation && (
            <div
              style={{
                fontSize: '0.875rem',
                color: '#525252',
                padding: '0.75rem',
                backgroundColor: '#f4f4f4',
                borderRadius: '4px',
              }}
            >
              {recommendation}
            </div>
          )}
        </>
      )}
    </WidgetCard>
  );
}
