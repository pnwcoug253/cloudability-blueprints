import { DonutChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProviderMix({ data }) {
  const { providers } = data;

  const totalSpend = providers.reduce((sum, p) => sum + p.spend, 0);

  const chartData = providers.map((p) => ({
    group: p.name,
    value: p.spend,
  }));

  const chartOptions = {
    resizable: true,
    height: '250px',
    donut: {
      center: {
        label: 'Total',
        number: formatCurrency(totalSpend),
      },
    },
    toolbar: { enabled: false },
    legend: { enabled: true },
  };

  const statusTag = {
    label: `${providers.length} Providers`,
    type: 'blue',
  };

  return (
    <WidgetCard
      title="Provider Mix"
      actionLabel="View Provider Breakdown"
      status={statusTag}
    >
      <div style={{ marginBottom: '1rem' }}>
        <DonutChart data={chartData} options={chartOptions} />
      </div>

      <div>
        {providers.map((provider) => (
          <div
            key={provider.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.375rem 0',
              fontSize: '0.875rem',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <span style={{ fontWeight: 500 }}>{provider.name}</span>
            <span style={{ color: '#525252' }}>
              {provider.percentage}%{' '}
              <span style={{ color: provider.change >= 0 ? '#24a148' : '#da1e28' }}>
                {provider.change >= 0 ? '\u2191' : '\u2193'}
                {Math.abs(provider.change)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
