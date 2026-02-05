import { DonutChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';
import { formatCurrency } from '../../utils/formatCurrency';

function OpportunityRow({ opportunity }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e0e0e0',
        flexWrap: 'wrap',
        gap: '0.25rem',
      }}
    >
      <div style={{ flex: '1 1 auto' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {opportunity.resource}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6f6f6f' }}>
          {opportunity.currentSize} &rarr; {opportunity.recommendedSize}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '0 0 auto' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          {formatCurrency(opportunity.monthlySavings)}
        </span>
        <button className="action-link" style={{ marginTop: 0 }}>
          Right-size &rarr;
        </button>
      </div>
    </div>
  );
}

export default function RightSizing({ data, variant = 'default' }) {
  const isTeam = variant === 'team';
  const source = isTeam ? data.teamData : data;
  const { totalSavings, opportunityCount, topOpportunities } = source;
  const categories = data.categories;

  const title = isTeam ? 'Right-Sizing \u2014 My Team' : 'Right-Sizing Opportunities';

  const chartData = !isTeam && categories
    ? categories.map((c) => ({ group: c.type, value: c.savings }))
    : [];

  const chartOptions = {
    resizable: true,
    height: '200px',
    donut: {
      center: {
        label: 'Savings',
        number: formatCurrency(totalSavings),
      },
    },
    toolbar: { enabled: false },
  };

  const statusTag = {
    label: `${opportunityCount} opportunities`,
    type: 'red',
  };

  const displayedOpportunities = topOpportunities.slice(0, 3);

  return (
    <WidgetCard
      title={title}
      actionLabel="View in Right Sizing"
      status={statusTag}
    >
      {!isTeam && categories && (
        <div style={{ marginBottom: '1rem' }}>
          <DonutChart data={chartData} options={chartOptions} />
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        {displayedOpportunities.map((opp, idx) => (
          <OpportunityRow key={idx} opportunity={opp} />
        ))}
      </div>

      <div style={{ fontSize: '0.875rem', color: '#525252' }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {formatCurrency(totalSavings)}
        </span>{' '}
        potential monthly savings
      </div>
    </WidgetCard>
  );
}
