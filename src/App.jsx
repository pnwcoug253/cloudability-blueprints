import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Button, Tile, Tag } from '@carbon/react';
import { UserAdmin, ChartLineData, Code, Finance, ArrowRight } from '@carbon/icons-react';
import { UserProvider, useUser } from './context/UserContext';
import { BlueprintProvider } from './context/BlueprintContext';
import AppShell from './components/shell/AppShell';
import Profiler from './components/profiler/Profiler';
import DashboardPage from './components/dashboard/DashboardPage';
import BlueprintLibrary from './components/admin/BlueprintLibrary';
import BlueprintBuilder from './components/admin/BlueprintBuilder';
import BlueprintAssignment from './components/admin/BlueprintAssignment';
import UserInsights from './components/admin/UserInsights';
import './App.scss';

function LandingPage() {
  const navigate = useNavigate();
  const { dispatch } = useUser();

  const startAsAdmin = () => {
    dispatch({ type: 'SET_PERSONA', payload: 'admin' });
    dispatch({ type: 'SET_NEW_USER', payload: false });
    navigate('/admin/blueprints');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          IBM Cloudability Blueprints
        </h1>
        <p style={{ color: '#525252', fontSize: '1rem' }}>
          Persona-based dashboard personalization for cloud cost management
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <Tile
          style={{ padding: '2rem', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.15s' }}
          onClick={() => navigate('/profiler')}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0f62fe'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <ChartLineData size={32} style={{ color: '#0f62fe' }} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Start Onboarding Profiler</h3>
          <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1.5rem' }}>
            Walk through the 5-step profiler to select your role, priorities, and business context.
            Get a personalized dashboard tailored to your needs.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Tag type="teal" size="sm">FinOps</Tag>
            <Tag type="purple" size="sm">DevOps</Tag>
            <Tag type="green" size="sm">Finance</Tag>
            <Tag type="blue" size="sm">Admin</Tag>
          </div>
          <Button kind="primary" size="sm" renderIcon={ArrowRight}>
            Start Profiler
          </Button>
        </Tile>

        <Tile
          style={{ padding: '2rem', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.15s' }}
          onClick={startAsAdmin}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0f62fe'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <UserAdmin size={32} style={{ color: '#0f62fe' }} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Go to Admin Portal</h3>
          <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1.5rem' }}>
            Jump straight into the blueprint builder. Create, customize, and assign dashboard
            blueprints for your organization. View usage analytics.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Tag type="cool-gray" size="sm">Blueprints</Tag>
            <Tag type="cool-gray" size="sm">Assignments</Tag>
            <Tag type="cool-gray" size="sm">Analytics</Tag>
          </div>
          <Button kind="tertiary" size="sm" renderIcon={ArrowRight}>
            Open Admin
          </Button>
        </Tile>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#8d8d8d' }}>
          Or jump directly to a persona dashboard:
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
          {[
            { persona: 'finops', label: 'FinOps', icon: ChartLineData },
            { persona: 'devops', label: 'DevOps', icon: Code },
            { persona: 'finance', label: 'Finance', icon: Finance },
          ].map(({ persona, label, icon: Icon }) => (
            <Button
              key={persona}
              kind="ghost"
              size="sm"
              onClick={() => {
                dispatch({ type: 'SET_PERSONA', payload: persona });
                dispatch({ type: 'SET_NEW_USER', payload: false });
                navigate(`/dashboard/${persona}`);
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/profiler/*" element={<Profiler />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/admin" element={<Navigate to="/admin/blueprints" replace />} />
      <Route path="/dashboard/:persona" element={<DashboardPage />} />
      <Route path="/admin/blueprints" element={<BlueprintLibrary />} />
      <Route path="/admin/blueprints/new" element={<BlueprintBuilder />} />
      <Route path="/admin/blueprints/preview" element={<DashboardPage preview />} />
      <Route path="/admin/blueprints/:id/edit" element={<BlueprintBuilder />} />
      <Route path="/admin/blueprints/:id/preview" element={<DashboardPage preview />} />
      <Route path="/admin/assignments" element={<BlueprintAssignment />} />
      <Route path="/admin/insights" element={<UserInsights />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <BlueprintProvider>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </BlueprintProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
