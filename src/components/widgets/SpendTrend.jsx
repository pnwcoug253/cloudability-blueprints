import { useMemo } from 'react';
import { AreaChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';

export default function SpendTrend({ data, variant = 'default' }) {
  const chartData = useMemo(() => {
    if (!data?.series) return [];
    let series = data.series;

    if (variant === 'annual') {
      // Show last 12 months of data
      const groups = [...new Set(series.map((d) => d.group))];
      const dates = [...new Set(series.map((d) => d.date))].sort();
      const last12 = dates.slice(-12);
      series = series.filter((d) => last12.includes(d.date));
    }

    return series;
  }, [data, variant]);

  const options = {
    axes: {
      bottom: { mapsTo: 'date', scaleType: 'time' },
      left: { mapsTo: 'value', scaleType: 'linear' },
    },
    curve: 'curveMonotoneX',
    height: '300px',
    toolbar: { enabled: false },
    legend: { enabled: true },
    theme: 'white',
  };

  return (
    <WidgetCard
      title="Spend Trend"
      actionLabel="Open in Reports"
      status={{ label: 'Trending Up', type: 'yellow' }}
    >
      <div style={{ height: '300px' }}>
        <AreaChart data={chartData} options={options} />
      </div>
    </WidgetCard>
  );
}
