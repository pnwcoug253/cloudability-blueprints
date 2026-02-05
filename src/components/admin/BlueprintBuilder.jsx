import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Tile,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Tag,
  Grid,
  Column,
} from '@carbon/react';
import { Save, Close, Add, TrashCan, Draggable, View } from '@carbon/icons-react';
import { useBlueprint } from '../../context/BlueprintContext';
import widgetRegistry from '../../utils/widgetRegistry';

const categories = [...new Set(Object.values(widgetRegistry).map((w) => w.category))];

function BlueprintBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useBlueprint();
  const { builderState } = state;
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const blueprint = state.blueprints.find((bp) => bp.id === id);
      if (blueprint) {
        dispatch({ type: 'LOAD_BLUEPRINT_TO_BUILDER', payload: blueprint });
      }
    } else {
      dispatch({ type: 'RESET_BUILDER' });
    }
  }, [id]);

  const handleAddWidget = (widgetType) => {
    const registry = widgetRegistry[widgetType];
    const newWidget = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: widgetType,
      colSpan: registry.defaultColSpan,
      position: builderState.canvasWidgets.length,
      config: {},
    };
    dispatch({ type: 'ADD_CANVAS_WIDGET', payload: newWidget });
  };

  const handleRemoveWidget = (widgetId) => {
    dispatch({ type: 'REMOVE_CANVAS_WIDGET', payload: widgetId });
  };

  const handleSave = () => {
    const blueprint = {
      id: isEditing ? id : `bp-custom-${Date.now()}`,
      name: builderState.blueprintName,
      persona: builderState.blueprintPersona,
      description: builderState.blueprintDescription,
      licenseTier: builderState.blueprintTier,
      isSystemDefault: false,
      widgetCount: builderState.canvasWidgets.length,
      assignedUsers: 0,
      createdAt: new Date().toISOString().split('T')[0],
      modifiedAt: new Date().toISOString().split('T')[0],
      widgets: builderState.canvasWidgets,
    };

    if (isEditing) {
      dispatch({ type: 'UPDATE_BLUEPRINT', payload: blueprint });
    } else {
      dispatch({ type: 'ADD_BLUEPRINT', payload: blueprint });
    }

    navigate('/admin/blueprints');
  };

  return (
    <div>
      {/* Design context for the UX team */}
      <Tile style={{ padding: '1rem 1.25rem', marginBottom: '1rem', background: '#f4f4f4' }}>
        <h5 style={{ marginBottom: '0.5rem' }}>Building a blueprint</h5>
        <p style={{ fontSize: '0.8125rem', color: '#525252', lineHeight: 1.5, margin: 0 }}>
          Use this builder to compose a dashboard layout. Set the blueprint's metadata on the left (name,
          target persona, license tier), then add widgets from the library. The <strong>canvas</strong> on
          the right shows the widget arrangement — each widget displays its Carbon grid column span.
          The <strong>Preview</strong> button renders the full dashboard exactly as end-users would see it,
          with real mock data. Widgets are tiered by license level (Essentials, Standard, Premium) to
          demonstrate how the experience can scale with a customer's plan.
        </p>
      </Tile>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>{isEditing ? 'Edit Blueprint' : 'New Blueprint'}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button kind="secondary" renderIcon={Close} onClick={() => navigate('/admin/blueprints')}>
            Cancel
          </Button>
          <Button
            kind="tertiary"
            renderIcon={View}
            onClick={() => navigate('/admin/blueprints/preview')}
            disabled={builderState.canvasWidgets.length === 0}
          >
            Preview
          </Button>
          <Button
            renderIcon={Save}
            onClick={handleSave}
            disabled={!builderState.blueprintName || !builderState.blueprintPersona}
          >
            Save Blueprint
          </Button>
        </div>
      </div>

      <Grid narrow>
        <Column sm={4} md={4} lg={5}>
          <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Blueprint Details</h4>
            <TextInput
              id="blueprint-name"
              labelText="Name"
              placeholder="e.g. FinOps Command Center"
              value={builderState.blueprintName}
              onChange={(e) => dispatch({ type: 'SET_BUILDER_META', payload: { blueprintName: e.target.value } })}
              style={{ marginBottom: '1rem' }}
            />
            <TextArea
              id="blueprint-description"
              labelText="Description"
              placeholder="Describe what this blueprint provides..."
              value={builderState.blueprintDescription}
              onChange={(e) => dispatch({ type: 'SET_BUILDER_META', payload: { blueprintDescription: e.target.value } })}
              style={{ marginBottom: '1rem' }}
            />
            <Select
              id="blueprint-persona"
              labelText="Target Persona"
              value={builderState.blueprintPersona}
              onChange={(e) => dispatch({ type: 'SET_BUILDER_META', payload: { blueprintPersona: e.target.value } })}
              style={{ marginBottom: '1rem' }}
            >
              <SelectItem value="" text="Select a persona" />
              <SelectItem value="admin" text="Admin" />
              <SelectItem value="finops" text="FinOps" />
              <SelectItem value="devops" text="DevOps" />
              <SelectItem value="finance" text="Finance" />
            </Select>
            <Select
              id="blueprint-tier"
              labelText="License Tier"
              value={builderState.blueprintTier}
              onChange={(e) => dispatch({ type: 'SET_BUILDER_META', payload: { blueprintTier: e.target.value } })}
            >
              <SelectItem value="essentials" text="Essentials" />
              <SelectItem value="standard" text="Standard" />
              <SelectItem value="premium" text="Premium" />
            </Select>
          </Tile>

          <Tile style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Widget Library</h4>
            {categories.map((category) => (
              <div key={category} style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#8d8d8d', marginBottom: '0.5rem' }}>
                  {category}
                </p>
                {Object.entries(widgetRegistry)
                  .filter(([, w]) => w.category === category)
                  .map(([type, widget]) => (
                    <div
                      key={type}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{widget.name}</p>
                        <Tag type={widget.tier === 'essentials' ? 'green' : widget.tier === 'standard' ? 'blue' : 'purple'} size="sm">
                          {widget.tier}
                        </Tag>
                      </div>
                      <Button
                        kind="ghost"
                        size="sm"
                        hasIconOnly
                        renderIcon={Add}
                        iconDescription={`Add ${widget.name}`}
                        onClick={() => handleAddWidget(type)}
                      />
                    </div>
                  ))}
              </div>
            ))}
          </Tile>
        </Column>

        <Column sm={4} md={4} lg={11}>
          <div className="builder-canvas">
            <h4 style={{ marginBottom: '1rem' }}>
              Canvas ({builderState.canvasWidgets.length} widgets)
            </h4>
            {builderState.canvasWidgets.length === 0 ? (
              <div className="canvas-drop-zone" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#8d8d8d' }}>
                  Add widgets from the library on the left to start building your blueprint.
                </p>
              </div>
            ) : (
              <Grid narrow>
                {builderState.canvasWidgets.map((widget) => {
                  const registry = widgetRegistry[widget.type];
                  return (
                    <Column key={widget.id} sm={4} md={8} lg={widget.colSpan}>
                      <Tile
                        style={{
                          padding: '1rem',
                          marginBottom: '0.5rem',
                          border: builderState.selectedWidget === widget.id ? '2px solid #0f62fe' : '1px solid #e0e0e0',
                          cursor: 'pointer',
                        }}
                        onClick={() => dispatch({ type: 'SELECT_CANVAS_WIDGET', payload: widget.id })}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Draggable size={16} style={{ color: '#8d8d8d' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                              {registry?.name || widget.type}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag type="cool-gray" size="sm">col:{widget.colSpan}</Tag>
                            <Button
                              kind="danger--ghost"
                              size="sm"
                              hasIconOnly
                              renderIcon={TrashCan}
                              iconDescription="Remove widget"
                              onClick={(e) => { e.stopPropagation(); handleRemoveWidget(widget.id); }}
                            />
                          </div>
                        </div>
                      </Tile>
                    </Column>
                  );
                })}
              </Grid>
            )}
          </div>
        </Column>
      </Grid>
    </div>
  );
}

export default BlueprintBuilder;
