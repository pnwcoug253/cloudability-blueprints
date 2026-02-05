import { useMemo } from 'react';
import { LineChart } from '@carbon/charts-react';
import WidgetCard from './WidgetCard';

export default function UserAdoption({ data }) {
  const chartData = useMemo(() => {
    if (!data?.dailyActiveUsers) return [];
    const active = data.dailyActiveUsers.map((d) => ({
      group: 'Daily Active Users',
      date: d.date,
      value: d.count,
    }));
    const licensed = data.dailyActiveUsers.map((d) => ({
      group: 'Licensed Users',
      date: d.date,
      value: data.licensedUsers,
    }));
    return [...active, ...licensed];
  }, [data]);

  const options = {
    axes: {
      bottom: { mapsTo: 'date', scaleType: 'time' },
      left: { mapsTo: 'value', scaleType: 'linear' },
    },
    height: '300px',
    toolbar: { enabled: false },
    legend: { enabled: true },
    color: {
      scale: {
        'Daily Active Users': '#0f62fe',
        'Licensed Users': '#e0e0e0',
      },
    },
    theme: 'white',
  };

  const adoptionRate = data?.adoptionRate || 0;
  const status =
    adoptionRate >= 60
      ? { label: 'Healthy', type: 'green' }
      : { label: 'Low Adoption', type: 'yellow' };

  return (
    <WidgetCard
      title="User Adoption"
      actionLabel="View User Details"
      status={status}
    >
      <div style={{ height: '300px' }}>
        <LineChart data={chartData} options={options} />
      </div>
      <p
        style={{
          marginTop: '0.75rem',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#161616',
        }}
      >
        {adoptionRate}% adoption rate
      </p>
    </WidgetCard>
  );
}
