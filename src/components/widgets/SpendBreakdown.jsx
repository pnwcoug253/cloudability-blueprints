import { useMemo } from 'react';
import { SimpleBarChart } from '@carbon/charts-react';
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  ProgressBar,
} from '@carbon/react';
import WidgetCard from './WidgetCard';
import { formatCurrency, formatPercent } from '../../utils/formatCurrency';

function ServiceBreakdown({ data }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({ group: d.category, value: d.value }));
  }, [data]);

  const options = {
    axes: {
      left: { mapsTo: 'group', scaleType: 'labels' },
      bottom: { mapsTo: 'value' },
    },
    height: '300px',
    toolbar: { enabled: false },
    legend: { enabled: false },
    theme: 'white',
  };

  return (
    <>
      <div style={{ height: '300px' }}>
        <SimpleBarChart data={chartData} options={options} />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        {Array.isArray(data) &&
          data.map((d) => (
            <div
              key={d.category}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.25rem 0',
                fontSize: '0.875rem',
              }}
            >
              <span>{d.category}</span>
              <span>
                {formatCurrency(d.value)} ({formatPercent(d.change)})
              </span>
            </div>
          ))}
      </div>
    </>
  );
}

function CostAllocation({ data }) {
  if (!data) return null;
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
          {data.categorized}% of spend is categorized
        </p>
        <p style={{ fontSize: '0.875rem', color: '#525252', margin: 0 }}>
          {data.uncategorized}% untagged &mdash; {formatCurrency(data.uncategorizedSpend)}/month
        </p>
      </div>
      <ProgressBar
        label="Categorization coverage"
        value={data.categorized}
        size="big"
      />
      {data.byMapping && (
        <div style={{ marginTop: '1rem' }}>
          {data.byMapping.map((m) => (
            <div
              key={m.category}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.375rem 0',
                fontSize: '0.875rem',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <span>{m.category}</span>
              <span>{m.coverage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CredentialHealth({ data }) {
  if (!Array.isArray(data)) return null;

  const statusColor = {
    connected: 'green',
    partial: 'teal',
    disconnected: 'red',
  };

  return (
    <StructuredListWrapper>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Provider</StructuredListCell>
          <StructuredListCell head>Status</StructuredListCell>
          <StructuredListCell head>Accounts</StructuredListCell>
          <StructuredListCell head>Last Sync</StructuredListCell>
          <StructuredListCell head>Features</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {data.map((row) => (
          <StructuredListRow key={row.category}>
            <StructuredListCell>{row.category}</StructuredListCell>
            <StructuredListCell>
              <Tag type={statusColor[row.status] || 'blue'} size="sm">
                {row.status}
              </Tag>
            </StructuredListCell>
            <StructuredListCell>{row.accounts}</StructuredListCell>
            <StructuredListCell>{row.lastSync}</StructuredListCell>
            <StructuredListCell>
              {row.advancedFeatures ? 'Full' : 'Basic'}
            </StructuredListCell>
          </StructuredListRow>
        ))}
      </StructuredListBody>
    </StructuredListWrapper>
  );
}

function BlueprintAssignments({ data }) {
  if (!Array.isArray(data)) return null;
  return (
    <StructuredListWrapper>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Persona</StructuredListCell>
          <StructuredListCell head>Blueprint</StructuredListCell>
          <StructuredListCell head>Users</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {data.map((row) => (
          <StructuredListRow key={row.category}>
            <StructuredListCell>{row.category}</StructuredListCell>
            <StructuredListCell>
              {row.blueprint || (
                <Tag type="red" size="sm">
                  None
                </Tag>
              )}
            </StructuredListCell>
            <StructuredListCell>{row.users}</StructuredListCell>
          </StructuredListRow>
        ))}
      </StructuredListBody>
    </StructuredListWrapper>
  );
}

function MonthOverMonth({ data }) {
  if (!Array.isArray(data)) return null;

  const headers = [
    { key: 'category', header: 'Business Unit' },
    { key: 'lastMonth', header: 'Last Month' },
    { key: 'thisMonth', header: 'This Month' },
    { key: 'change', header: 'Change ($)' },
    { key: 'changePercent', header: 'Change (%)' },
    { key: 'status', header: 'Status' },
  ];

  const rows = data.map((row, i) => ({
    id: String(i),
    ...row,
  }));

  const statusTagType = {
    normal: 'green',
    expected: 'blue',
    investigate: 'red',
  };

  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableHeader key={header.key} {...getHeaderProps({ header })}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => {
              const original = data[Number(row.id)];
              return (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  <TableCell>{original.category}</TableCell>
                  <TableCell>{formatCurrency(original.lastMonth)}</TableCell>
                  <TableCell>{formatCurrency(original.thisMonth)}</TableCell>
                  <TableCell>{formatCurrency(original.change)}</TableCell>
                  <TableCell>{formatPercent(original.changePercent)}</TableCell>
                  <TableCell>
                    <Tag
                      type={statusTagType[original.status] || 'blue'}
                      size="sm"
                    >
                      {original.status}
                    </Tag>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
}

const variantConfig = {
  byService: {
    title: 'Spend by Service',
    actionLabel: 'View Full Breakdown',
    status: { label: 'Active', type: 'green' },
  },
  teamServices: {
    title: 'Spend by Service',
    actionLabel: 'View Full Breakdown',
    status: { label: 'Active', type: 'green' },
  },
  costAllocation: {
    title: 'Cost Allocation Health',
    actionLabel: 'Improve Tagging',
    status: { label: 'Active', type: 'green' },
  },
  credentialHealth: {
    title: 'Credential Health',
    actionLabel: 'Manage Credentials',
    status: { label: 'Active', type: 'green' },
  },
  blueprintAssignments: {
    title: 'Blueprint Assignments',
    actionLabel: 'Manage Assignments',
    status: { label: 'Active', type: 'green' },
  },
  monthOverMonth: {
    title: 'Month-Over-Month Spend',
    actionLabel: 'Download Report',
    status: { label: 'Active', type: 'green' },
  },
};

export default function SpendBreakdown({ data, variant = 'byService' }) {
  const config = variantConfig[variant] || variantConfig.byService;

  // Extract the variant-specific data from the full dataset
  const variantData = data && typeof data === 'object' && !Array.isArray(data) && data[variant]
    ? data[variant]
    : data;

  const renderContent = () => {
    switch (variant) {
      case 'byService':
      case 'teamServices':
        return <ServiceBreakdown data={variantData} />;
      case 'costAllocation':
        return <CostAllocation data={variantData} />;
      case 'credentialHealth':
        return <CredentialHealth data={variantData} />;
      case 'blueprintAssignments':
        return <BlueprintAssignments data={variantData} />;
      case 'monthOverMonth':
        return <MonthOverMonth data={variantData} />;
      default:
        return <ServiceBreakdown data={variantData} />;
    }
  };

  return (
    <WidgetCard
      title={config.title}
      actionLabel={config.actionLabel}
      status={config.status}
    >
      {renderContent()}
    </WidgetCard>
  );
}
