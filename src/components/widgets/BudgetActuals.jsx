import { useMemo } from 'react';
import { GroupedBarChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';

const statusMap = {
  'on-track': { label: 'On Track', type: 'green' },
  'at-risk': { label: 'At Risk', type: 'yellow' },
  'over-budget': { label: 'Over Budget', type: 'red' },
};

export default function BudgetActuals({ data, variant = 'default' }) {
  const chartData = useMemo(() => {
    if (!data?.periods) return [];
    const periods = variant === 'quarterly' ? data.periods : data.periods;

    return periods.flatMap((p) => [
      { group: 'Budget', key: p.period, value: p.budget },
      { group: 'Actual', key: p.period, value: p.actual },
    ]);
  }, [data, variant]);

  const options = {
    axes: {
      bottom: { mapsTo: 'key', scaleType: 'labels' },
      left: { mapsTo: 'value', scaleType: 'linear' },
    },
    height: '300px',
    toolbar: { enabled: false },
    theme: 'white',
  };

  const status = statusMap[data?.status] || statusMap['on-track'];

  return (
    <WidgetCard
      title="Budget vs. Actuals"
      actionLabel="Adjust Budget"
      status={status}
    >
      <div style={{ height: '300px' }}>
        <GroupedBarChart data={chartData} options={options} />
      </div>
      {data?.insight && (
        <p
          style={{
            marginTop: '0.75rem',
            fontSize: '0.875rem',
            color: '#525252',
          }}
        >
          {data.insight}
        </p>
      )}
    </WidgetCard>
  );
}
