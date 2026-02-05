import React, { useState } from 'react';
import { Tile, Tabs, TabList, Tab, TabPanels, TabPanel, InlineNotification } from '@carbon/react';
import { SimpleBarChart, GroupedBarChart, DonutChart, LineChart } from '@carbon/charts-react';

import overviewData from '../../data/insights/overview.json';
import widgetEngagement from '../../data/insights/widgetEngagement.json';
import featureAdoption from '../../data/insights/featureAdoption.json';
import sessionPatterns from '../../data/insights/sessionPatterns.json';
import userAdoptionData from '../../data/widgets/userAdoption.json';

function KpiTile({ label, value, trend }) {
  return (
    <Tile className="kpi-tile">
      <p style={{ fontSize: '0.875rem', color: '#525252' }}>{label}</p>
      <p className="kpi-tile__value">{value}</p>
      <span className="kpi-tile__trend kpi-tile__trend--positive">
        ↑ {trend}%
      </span>
    </Tile>
  );
}

// Tab 1: Overview
function OverviewTab() {
  const dauData = [
    ...userAdoptionData.dailyActiveUsers.map((d) => ({ group: 'Daily Active Users', date: d.date, value: d.count })),
    ...userAdoptionData.dailyActiveUsers.map((d) => ({ group: 'Licensed Users', date: d.date, value: userAdoptionData.licensedUsers })),
  ];

  const engagementData = [
    { group: 'Power Users (>5/wk)', value: 20 },
    { group: 'Regular (2-5/wk)', value: 45 },
    { group: 'Occasional (1/wk)', value: 25 },
    { group: 'Dormant (<1/wk)', value: 10 },
  ];

  return (
    <div>
      <div className="insights-kpi-row">
        <KpiTile label="Monthly Active Users" value={overviewData.monthlyActiveUsers.value} trend={overviewData.monthlyActiveUsers.trend} />
        <KpiTile label="Avg. Session Duration" value={overviewData.avgSessionDuration.value} trend={overviewData.avgSessionDuration.trend} />
        <KpiTile label="Avg. Pages/Session" value={overviewData.avgPagesPerSession.value} trend={overviewData.avgPagesPerSession.trend} />
        <KpiTile label="Feature Discovery Rate" value={`${overviewData.featureDiscoveryRate.value}%`} trend={overviewData.featureDiscoveryRate.trend} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <Tile style={{ padding: '1.25rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Daily Active Users (30 days)</h4>
          <div style={{ height: '300px' }}>
            <LineChart
              data={dauData}
              options={{
                axes: { bottom: { mapsTo: 'date', scaleType: 'time' }, left: { mapsTo: 'value', scaleType: 'linear' } },
                height: '300px',
                toolbar: { enabled: false },
                legend: { enabled: true },
                color: { scale: { 'Daily Active Users': '#0f62fe', 'Licensed Users': '#e0e0e0' } },
              }}
            />
          </div>
        </Tile>

        <Tile style={{ padding: '1.25rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>User Engagement Distribution</h4>
          <div style={{ height: '300px' }}>
            <DonutChart
              data={engagementData}
              options={{
                resizable: true,
                height: '300px',
                donut: { center: { label: 'Users', number: '47' } },
                toolbar: { enabled: false },
                legend: { enabled: true },
              }}
            />
          </div>
        </Tile>
      </div>
    </div>
  );
}

// Tab 2: Widget Engagement
function WidgetEngagementTab() {
  const ctrData = widgetEngagement.clickThroughRates.map((d) => ({
    group: 'Click-Through Rate',
    key: d.widget,
    value: d.ctr,
  }));

  const timeData = [];
  widgetEngagement.timeOnWidget.labels.forEach((label, i) => {
    timeData.push({ group: 'FinOps', key: label, value: widgetEngagement.timeOnWidget.finops[i] });
    timeData.push({ group: 'DevOps', key: label, value: widgetEngagement.timeOnWidget.devops[i] });
    timeData.push({ group: 'Finance', key: label, value: widgetEngagement.timeOnWidget.finance[i] });
  });

  return (
    <div>
      <Tile style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Widget Click-Through Rates</h4>
        <div style={{ height: '300px' }}>
          <SimpleBarChart
            data={ctrData}
            options={{
              axes: {
                left: { mapsTo: 'key', scaleType: 'labels' },
                bottom: { mapsTo: 'value', scaleType: 'linear', title: 'CTR %' },
              },
              height: '300px',
              toolbar: { enabled: false },
              legend: { enabled: false },
            }}
          />
        </div>
      </Tile>

      <Tile style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Avg. Time on Widget by Persona (minutes)</h4>
        <div style={{ height: '300px' }}>
          <GroupedBarChart
            data={timeData}
            options={{
              axes: {
                bottom: { mapsTo: 'key', scaleType: 'labels' },
                left: { mapsTo: 'value', scaleType: 'linear', title: 'Minutes' },
              },
              height: '300px',
              toolbar: { enabled: false },
              legend: { enabled: true },
            }}
          />
        </div>
      </Tile>

      <InlineNotification
        kind="info"
        title="Insight"
        subtitle={widgetEngagement.insight}
        lowContrast
        hideCloseButton
      />
    </div>
  );
}

// Tab 3: Feature Adoption
function FeatureAdoptionTab() {
  const data = [];
  featureAdoption.features.forEach((feature, i) => {
    Object.entries(featureAdoption.byPersona).forEach(([persona, values]) => {
      data.push({ group: persona, key: feature, value: values[i] });
    });
  });

  return (
    <div>
      <Tile style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Feature Usage by Persona (%)</h4>
        <div style={{ height: '400px' }}>
          <GroupedBarChart
            data={data}
            options={{
              axes: {
                bottom: { mapsTo: 'key', scaleType: 'labels' },
                left: { mapsTo: 'value', scaleType: 'linear', title: 'Usage %' },
              },
              height: '400px',
              toolbar: { enabled: false },
              legend: { enabled: true },
            }}
          />
        </div>
      </Tile>

      <InlineNotification
        kind="info"
        title="Insight"
        subtitle={featureAdoption.insight}
        lowContrast
        hideCloseButton
      />
    </div>
  );
}

// Tab 4: Session Patterns
function SessionPatternsTab() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

  const maxSessions = Math.max(...sessionPatterns.heatmap.map((d) => d.sessions));

  const getColor = (sessions) => {
    const intensity = sessions / maxSessions;
    if (intensity > 0.7) return '#0f62fe';
    if (intensity > 0.4) return '#78a9ff';
    if (intensity > 0.15) return '#d0e2ff';
    return '#f4f4f4';
  };

  const getSession = (day, hour) => {
    const entry = sessionPatterns.heatmap.find((d) => d.day === day && d.hour === hour);
    return entry ? entry.sessions : 0;
  };

  return (
    <div>
      <Tile style={{ padding: '1.25rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Usage by Day and Hour</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', width: '100px' }}></th>
                {hours.map((h) => (
                  <th key={h} style={{ padding: '0.25rem', textAlign: 'center', fontWeight: 400, color: '#525252' }}>
                    {h > 12 ? `${h - 12}p` : h === 12 ? '12p' : `${h}a`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td style={{ padding: '0.25rem 0.5rem', fontWeight: 500, fontSize: '0.8125rem' }}>{day}</td>
                  {hours.map((hour) => {
                    const sessions = getSession(day, hour);
                    return (
                      <td key={hour} style={{ padding: '0.125rem' }}>
                        <div
                          style={{
                            width: '100%',
                            height: '28px',
                            backgroundColor: getColor(sessions),
                            borderRadius: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: sessions / maxSessions > 0.5 ? '#fff' : '#525252',
                            fontSize: '0.625rem',
                          }}
                          title={`${day} ${hour}:00 — ${sessions} sessions`}
                        >
                          {sessions > 0 ? sessions : ''}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.75rem', color: '#525252' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#f4f4f4', borderRadius: '2px' }} /> Low
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#d0e2ff', borderRadius: '2px' }} /> Medium
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#78a9ff', borderRadius: '2px' }} /> High
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#0f62fe', borderRadius: '2px' }} /> Peak
          </span>
        </div>
      </Tile>
    </div>
  );
}

function UserInsights() {
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h2>User Insights</h2>
        <p style={{ color: '#525252', fontSize: '0.875rem' }}>
          Monitor user adoption, engagement, and blueprint effectiveness
        </p>
      </div>

      {/* Design context for the UX team */}
      <Tile style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: '#f4f4f4' }}>
        <h5 style={{ marginBottom: '0.5rem' }}>Why this page exists</h5>
        <p style={{ fontSize: '0.8125rem', color: '#525252', lineHeight: 1.5, margin: 0 }}>
          This page gives admins a feedback loop on how blueprints are performing. <strong>Overview</strong> tracks
          overall platform adoption (DAU, session duration, engagement tiers). <strong>Widget Engagement</strong> shows
          which widgets users actually interact with — helping admins decide what to keep, promote, or remove from
          blueprints. <strong>Feature Adoption</strong> breaks down usage by persona to identify gaps
          (e.g. "Finance users rarely use Right-Sizing — should it be on their blueprint?").{' '}
          <strong>Session Patterns</strong> reveals when users are most active, which informs decisions about
          scheduled reports and notification timing.
        </p>
      </Tile>

      <Tabs>
        <TabList aria-label="Insights tabs">
          <Tab>Overview</Tab>
          <Tab>Widget Engagement</Tab>
          <Tab>Feature Adoption</Tab>
          <Tab>Session Patterns</Tab>
        </TabList>
        <TabPanels>
          <TabPanel><OverviewTab /></TabPanel>
          <TabPanel><WidgetEngagementTab /></TabPanel>
          <TabPanel><FeatureAdoptionTab /></TabPanel>
          <TabPanel><SessionPatternsTab /></TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default UserInsights;
