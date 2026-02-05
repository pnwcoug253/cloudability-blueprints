import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Column, Tag, Button } from '@carbon/react';
import { ArrowLeft } from '@carbon/icons-react';
import { useUser } from '../../context/UserContext';
import { useBlueprint } from '../../context/BlueprintContext';
import personaDefaults from '../../utils/personaDefaults';
import { getWidgetComponent } from '../../utils/widgetRegistry';

// Import all widget mock data
import kpiData from '../../data/widgets/kpi.json';
import spendTrendData from '../../data/widgets/spendTrend.json';
import spendBreakdownData from '../../data/widgets/spendBreakdown.json';
import budgetActualsData from '../../data/widgets/budgetActuals.json';
import rightSizingData from '../../data/widgets/rightSizing.json';
import commitmentsData from '../../data/widgets/commitments.json';
import anomaliesData from '../../data/widgets/anomalies.json';
import forecastData from '../../data/widgets/forecast.json';
import businessUnitsData from '../../data/widgets/businessUnits.json';
import idleResourcesData from '../../data/widgets/idleResources.json';
import governanceData from '../../data/widgets/governance.json';
import coinData from '../../data/widgets/coin.json';
import providerMixData from '../../data/widgets/providerMix.json';
import setupChecklistData from '../../data/widgets/setupChecklist.json';
import userAdoptionData from '../../data/widgets/userAdoption.json';

// Map widget types to their data sources
const dataMap = {
  'spend-trend': spendTrendData,
  'spend-breakdown': spendBreakdownData,
  'budget-actuals': budgetActualsData,
  'right-sizing': rightSizingData,
  'commitment-health': commitmentsData,
  'anomaly-feed': anomaliesData,
  'forecast': forecastData,
  'cost-by-business-unit': businessUnitsData,
  'idle-resources': idleResourcesData,
  'governance-compliance': governanceData,
  'coin-score': coinData,
  'provider-mix': providerMixData,
  'setup-checklist': setupChecklistData,
  'user-adoption': userAdoptionData,
};

// Persona display config
const personaConfig = {
  admin: { title: 'Platform Overview', subtitle: 'Manage your Cloudability instance', tagKind: 'blue', tagLabel: 'Admin', actions: ['Manage Users', 'Create Blueprint'] },
  finops: { title: 'FinOps Command Center', subtitle: 'Your optimization at a glance', tagKind: 'teal', tagLabel: 'FinOps Practitioner', actions: ['Run Report', 'View All Recommendations'] },
  devops: { title: 'Engineering Cost View', subtitle: 'Team: Platform Engineering', tagKind: 'purple', tagLabel: 'DevOps / Engineer', actions: ['View My Resources', 'Run Right-Sizing'] },
  finance: { title: 'Executive Summary', subtitle: 'Cloud financial overview', tagKind: 'green', tagLabel: 'Finance', actions: ['Export Report', 'Schedule Report'] },
};

function DashboardPage({ preview }) {
  const { persona: paramPersona } = useParams();
  const navigate = useNavigate();
  const { state: userState } = useUser();
  const { state: bpState } = useBlueprint();

  // In preview mode, use canvas widgets from the builder
  const isPreview = Boolean(preview);
  const activePersona = isPreview
    ? (bpState.builderState.blueprintPersona || 'finops')
    : (paramPersona || userState.currentUser.persona || 'finops');

  const widgets = isPreview
    ? bpState.builderState.canvasWidgets
    : (personaDefaults[activePersona]?.widgets || []);

  const config = personaConfig[activePersona] || personaConfig.finops;
  const previewName = bpState.builderState.blueprintName || 'Untitled Blueprint';

  if (!isPreview && !personaDefaults[activePersona]) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>No blueprint found for persona: {activePersona}</h2>
        <p>Please complete the profiler to set up your dashboard.</p>
      </div>
    );
  }

  const kpiWidgets = widgets.filter((w) => w.type === 'kpi-tile');
  const contentWidgets = widgets.filter((w) => w.type !== 'kpi-tile');

  return (
    <div>
      {/* Preview Banner */}
      {isPreview && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          background: '#d0e2ff',
          borderRadius: '4px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Tag type="blue" size="sm">Preview</Tag>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              {previewName}
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#525252' }}>
              — Showing how end-users will see this blueprint
            </span>
          </div>
          <Button
            kind="tertiary"
            size="sm"
            renderIcon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Back to Builder
          </Button>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 style={{ margin: 0 }}>{isPreview ? previewName : config.title}</h2>
            <Tag type={config.tagKind} size="sm">{config.tagLabel}</Tag>
          </div>
          <p style={{ color: '#525252', fontSize: '0.875rem', margin: 0 }}>
            {isPreview
              ? `Preview for ${config.tagLabel} persona`
              : `Welcome back, ${userState.currentUser.name} \u00b7 ${config.subtitle}`
            }
          </p>
        </div>
        {!isPreview && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button kind="ghost" size="sm">{config.actions[0]}</Button>
            <Button kind="primary" size="sm">{config.actions[1]}</Button>
          </div>
        )}
      </div>

      {/* KPI Row */}
      {kpiWidgets.length > 0 && (
        <div className="dashboard-kpi-row">
          <Grid narrow>
            {kpiWidgets.map((widget) => {
              const KpiTile = getWidgetComponent('kpi-tile');
              const data = kpiData[widget.config?.variant];
              if (!KpiTile || !data) return null;
              return (
                <Column key={widget.id} sm={4} md={4} lg={widget.colSpan}>
                  <KpiTile data={data} />
                </Column>
              );
            })}
          </Grid>
        </div>
      )}

      {/* Content Widgets */}
      {contentWidgets.length > 0 && (
        <div className="dashboard-grid">
          <Grid narrow>
            {contentWidgets.map((widget) => {
              const Component = getWidgetComponent(widget.type);
              if (!Component) return null;
              const data = dataMap[widget.type];
              if (!data) return null;
              return (
                <Column key={widget.id} sm={4} md={8} lg={widget.colSpan} style={{ marginBottom: '1rem' }}>
                  <Component data={data} variant={widget.config?.variant} />
                </Column>
              );
            })}
          </Grid>
        </div>
      )}

      {/* Empty state for preview with no widgets */}
      {isPreview && widgets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#8d8d8d' }}>
          <h3>No widgets in this blueprint</h3>
          <p>Go back to the builder and add widgets to see them rendered here.</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
