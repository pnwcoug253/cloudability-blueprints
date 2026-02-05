import {
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import { formatCurrency } from '../../utils/formatCurrency';
import WidgetCard from './WidgetCard';

const headers = [
  { key: 'name', header: 'Resource' },
  { key: 'type', header: 'Type' },
  { key: 'region', header: 'Region' },
  { key: 'lastActive', header: 'Last Active' },
  { key: 'monthlyCost', header: 'Monthly Cost' },
  { key: 'actions', header: 'Action' },
];

export default function IdleResources({ data }) {
  const { totalWaste, resources } = data;

  const rows = resources.map((r, idx) => ({
    id: String(idx),
    ...r,
  }));

  const statusTag = {
    label: `${formatCurrency(totalWaste)} waste`,
    type: 'red',
  };

  return (
    <WidgetCard
      title="Idle Resources"
      actionLabel="View All Idle Resources"
      status={statusTag}
    >
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          {formatCurrency(totalWaste)}
        </span>
        <span style={{ fontSize: '0.875rem', color: '#6f6f6f', marginLeft: '0.25rem' }}>
          /mo wasted
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <DataTable rows={rows} headers={headers} size="sm">
          {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => {
                  const resource = resources[Number(row.id)];
                  return (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      <TableCell>{resource.name}</TableCell>
                      <TableCell>{resource.type}</TableCell>
                      <TableCell>{resource.region}</TableCell>
                      <TableCell>{resource.lastActive}</TableCell>
                      <TableCell>{formatCurrency(resource.monthlyCost)}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <Button kind="ghost" size="sm">
                            Terminate
                          </Button>
                          <Button kind="ghost" size="sm">
                            Investigate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </div>
    </WidgetCard>
  );
}
