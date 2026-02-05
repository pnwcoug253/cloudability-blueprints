import { Tag, ProgressBar } from '@carbon/react';
import WidgetCard from './WidgetCard';

function SeverityTag({ severity }) {
  const kindMap = {
    critical: 'red',
    warning: 'teal',
    info: 'blue',
  };
  return (
    <Tag type={kindMap[severity] || 'blue'} size="sm">
      {severity}
    </Tag>
  );
}

export default function GovernanceCompliance({ data }) {
  const { complianceRate, totalResources, compliantResources, violations, missingTags } = data;

  const statusTag = complianceRate >= 90
    ? { label: 'On Track', type: 'green' }
    : { label: 'Needs Attention', type: 'yellow' };

  return (
    <WidgetCard
      title="Governance & Compliance"
      actionLabel="Fix Compliance Issues"
      status={statusTag}
    >
      {/* Compliance rate display */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 600 }}>{complianceRate}%</span>
          <span style={{ fontSize: '0.875rem', color: '#6f6f6f', marginLeft: '0.5rem' }}>
            compliant ({compliantResources} of {totalResources} resources)
          </span>
        </div>
        <ProgressBar
          label="Compliance rate"
          value={complianceRate}
          max={100}
          size="small"
          hideLabel
        />
      </div>

      {/* Missing Tags section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Missing Tags</h5>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {missingTags.map((tag) => (
            <Tag type="gray" size="sm" key={tag.tag}>
              {tag.tag}: {tag.resourceCount}
            </Tag>
          ))}
        </div>
      </div>

      {/* Violations section */}
      <div>
        <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Violations</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {violations.map((violation, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SeverityTag severity={violation.severity} />
                <span style={{ fontSize: '0.875rem' }}>{violation.policy}</span>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                {violation.resourceCount} resources
              </span>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}
