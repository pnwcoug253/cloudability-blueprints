import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Tile,
  Tag,
  Search,
  Dropdown,
} from '@carbon/react';
import { Add, Edit, TrashCan, View } from '@carbon/icons-react';
import { useBlueprint } from '../../context/BlueprintContext';
import personaDefaults from '../../utils/personaDefaults';

const personaLabels = {
  admin: 'Admin',
  finops: 'FinOps',
  devops: 'DevOps',
  finance: 'Finance',
};

const tierColors = {
  essentials: 'green',
  standard: 'blue',
  premium: 'purple',
};

function BlueprintLibrary() {
  const navigate = useNavigate();
  const { state, dispatch } = useBlueprint();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPersona, setFilterPersona] = useState('all');

  const filtered = state.blueprints.filter((bp) => {
    const matchesSearch = bp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPersona = filterPersona === 'all' || bp.persona === filterPersona;
    return matchesSearch && matchesPersona;
  });

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_BLUEPRINT', payload: id });
  };

  const handlePreview = (bp) => {
    // For system defaults, pull widgets from personaDefaults; for custom, use saved widgets
    const widgets = bp.isSystemDefault
      ? (personaDefaults[bp.persona]?.widgets || [])
      : (bp.widgets || []);
    dispatch({
      type: 'LOAD_BLUEPRINT_TO_BUILDER',
      payload: { ...bp, widgets },
    });
    navigate('/admin/blueprints/preview');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2>Blueprint Library</h2>
          <p style={{ color: '#525252', fontSize: '0.875rem' }}>
            Manage dashboard blueprints for each persona
          </p>
        </div>
        <Button renderIcon={Add} onClick={() => navigate('/admin/blueprints/new')}>
          New Blueprint
        </Button>
      </div>

      {/* Design context for the UX team */}
      <Tile style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: '#f4f4f4' }}>
        <h5 style={{ marginBottom: '0.5rem' }}>What are blueprints?</h5>
        <p style={{ fontSize: '0.8125rem', color: '#525252', lineHeight: 1.5, margin: 0 }}>
          A blueprint defines the widget layout for a dashboard. Each blueprint is designed for a specific
          persona and license tier. <strong>System blueprints</strong> ship out-of-the-box as sensible defaults
          for each persona (e.g. FinOps Command Center for FinOps practitioners). Admins can also create
          <strong> custom blueprints</strong> to tailor the experience — for example, a simplified view for
          finance executives or a team-specific layout for a particular engineering group.
          Once created, blueprints are assigned to personas, views, or individual users via the
          Assignments page.
        </p>
      </Tile>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <Search
            labelText="Search blueprints"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dropdown
          id="persona-filter"
          titleText=""
          label="All Personas"
          items={[
            { id: 'all', text: 'All Personas' },
            { id: 'admin', text: 'Admin' },
            { id: 'finops', text: 'FinOps' },
            { id: 'devops', text: 'DevOps' },
            { id: 'finance', text: 'Finance' },
          ]}
          itemToString={(item) => item?.text || ''}
          onChange={({ selectedItem }) => setFilterPersona(selectedItem.id)}
          style={{ minWidth: '200px' }}
        />
      </div>

      <div className="blueprint-card-grid">
        {filtered.map((bp) => (
          <Tile key={bp.id} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h4>{bp.name}</h4>
              {bp.isSystemDefault && <Tag type="cool-gray" size="sm">System</Tag>}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1rem' }}>
              {bp.description}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <Tag type="blue" size="sm" className={`persona-badge--${bp.persona}`}>
                {personaLabels[bp.persona] || bp.persona}
              </Tag>
              <Tag type={tierColors[bp.licenseTier] || 'gray'} size="sm">
                {bp.licenseTier}
              </Tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#8d8d8d' }}>
              <span>{bp.widgetCount || 0} widgets</span>
              <span>{bp.assignedUsers || 0} users assigned</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={View}
                onClick={() => handlePreview(bp)}
              >
                Preview
              </Button>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={Edit}
                onClick={() => navigate(`/admin/blueprints/${bp.id}/edit`)}
              >
                Edit
              </Button>
              {!bp.isSystemDefault && (
                <Button
                  kind="danger--ghost"
                  size="sm"
                  renderIcon={TrashCan}
                  onClick={() => handleDelete(bp.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </Tile>
        ))}
      </div>

      {filtered.length === 0 && (
        <Tile style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#8d8d8d' }}>No blueprints found matching your criteria.</p>
        </Tile>
      )}
    </div>
  );
}

export default BlueprintLibrary;
