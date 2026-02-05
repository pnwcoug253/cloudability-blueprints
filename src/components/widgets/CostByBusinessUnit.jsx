import { useMemo } from 'react';
import { DonutChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CostByBusinessUnit({ data }) {
  const chartData = useMemo(() => {
    if (!data?.units) return [];
    return data.units.map((u) => ({ group: u.name, value: u.spend }));
  }, [data]);

  const totalSpend = useMemo(() => {
    if (!data?.units) return 0;
    return data.units.reduce((sum, u) => sum + u.spend, 0);
  }, [data]);

  const options = {
    resizable: true,
    height: '300px',
    donut: {
      center: {
        label: 'Total',
        number: formatCurrency(totalSpend),
      },
    },
    toolbar: { enabled: false },
    legend: { enabled: true },
    theme: 'white',
  };

  const unitCount = data?.units?.length || 0;

  return (
    <WidgetCard
      title="Cost by Business Unit"
      actionLabel="View Business Unit Details"
      status={{ label: `${unitCount} Units`, type: 'blue' }}
    >
      <div style={{ height: '300px' }}>
        <DonutChart data={chartData} options={options} />
      </div>
    </WidgetCard>
  );
}
