import { useMemo } from 'react';
import { LineChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';

export default function Forecast({ data, variant = 'default' }) {
  const source = variant === 'team' && data?.teamForecast ? data.teamForecast : data;

  const chartData = useMemo(() => {
    if (!source) return [];
    const historical = (source.historical || []).map((d) => ({
      group: 'Actual',
      date: d.date,
      value: d.value,
    }));
    const forecast = (source.forecast || []).map((d) => ({
      group: 'Forecast',
      date: d.date,
      value: d.value,
    }));
    return [...historical, ...forecast];
  }, [source]);

  const options = {
    axes: {
      bottom: { mapsTo: 'date', scaleType: 'time' },
      left: { mapsTo: 'value', scaleType: 'linear' },
    },
    curve: 'curveMonotoneX',
    height: '300px',
    toolbar: { enabled: false },
    theme: 'white',
  };

  const insight = source?.insight || '';
  const status = insight.toLowerCase().includes('exceed')
    ? { label: 'Budget Risk', type: 'red' }
    : { label: 'On Track', type: 'green' };

  return (
    <WidgetCard
      title="Forecast"
      actionLabel="View Full Forecast"
      status={status}
    >
      <div style={{ height: '300px' }}>
        <LineChart data={chartData} options={options} />
      </div>
      {insight && (
        <p
          style={{
            marginTop: '0.75rem',
            fontSize: '0.875rem',
            color: '#525252',
          }}
        >
          {insight}
        </p>
      )}
    </WidgetCard>
  );
}
