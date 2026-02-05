import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Tile,
  ProgressIndicator,
  ProgressStep,
  Checkbox,
  RadioButtonGroup,
  RadioButton,
  Dropdown,
  FilterableMultiSelect,
  Tag,
  InlineLoading,
} from '@carbon/react';
import {
  UserAdmin,
  Finance,
  ChartLineData,
  Code,
  ArrowRight,
  ArrowLeft,
  Checkmark,
} from '@carbon/icons-react';
import { useUser } from '../../context/UserContext';
import profilerDefaults from '../../data/profilerDefaults.json';

const roleOptions = [
  { id: 'admin', title: 'Platform Admin', description: 'I manage Cloudability for my organization', icon: UserAdmin },
  { id: 'finance', title: 'Finance / Leadership', description: 'I track cloud spend, budgets, and forecasts', icon: Finance },
  { id: 'finops', title: 'FinOps Practitioner', description: 'I optimize cloud cost and usage across the org', icon: ChartLineData },
  { id: 'devops', title: 'DevOps / Engineer', description: 'I manage infrastructure and service costs', icon: Code },
];

// Step 1: Role Selection
function StepRoleSelect({ selectedRole, onSelect }) {
  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>What best describes your role?</h2>
      <p style={{ marginBottom: '1.5rem', color: '#525252' }}>
        This helps us tailor your dashboard experience.
      </p>
      <div className="profiler-tile-grid">
        {roleOptions.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <Tile
              key={role.id}
              className={`profiler-tile ${isSelected ? 'profiler-tile--selected' : ''}`}
              onClick={() => onSelect(role.id)}
            >
              <div className="profiler-tile__icon">
                <Icon size={32} />
              </div>
              <div className="profiler-tile__title">{role.title}</div>
              <div className="profiler-tile__description">{role.description}</div>
              {isSelected && (
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                  <Checkmark size={20} style={{ fill: '#0f62fe' }} />
                </div>
              )}
            </Tile>
          );
        })}
      </div>
    </div>
  );
}

// Step 2: Primary Objectives (persona-specific, max 3)
function StepObjectives({ role, objectives, onChange }) {
  const options = profilerDefaults.objectives[role] || [];
  const selectedCount = objectives.length;

  const toggle = (id) => {
    if (objectives.includes(id)) {
      onChange(objectives.filter((o) => o !== id));
    } else if (selectedCount < 3) {
      onChange([...objectives, id]);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>What are your top priorities?</h2>
      <p style={{ marginBottom: '0.5rem', color: '#525252' }}>
        Select up to 3. These will shape your start page widgets.
      </p>
      <Tag type="blue" size="sm" style={{ marginBottom: '1.5rem' }}>
        {selectedCount} of 3 selected
      </Tag>
      <div className="profiler-tile-grid">
        {options.map((opt) => {
          const isSelected = objectives.includes(opt.id);
          return (
            <Tile
              key={opt.id}
              className={`profiler-tile ${isSelected ? 'profiler-tile--selected' : ''}`}
              onClick={() => toggle(opt.id)}
              style={{ opacity: !isSelected && selectedCount >= 3 ? 0.5 : 1, cursor: !isSelected && selectedCount >= 3 ? 'not-allowed' : 'pointer' }}
            >
              <Checkbox
                id={`obj-${opt.id}`}
                labelText={opt.label}
                checked={isSelected}
                readOnly
                style={{ pointerEvents: 'none' }}
              />
              <div className="profiler-tile__description" style={{ marginTop: '0.25rem' }}>
                {opt.description}
              </div>
            </Tile>
          );
        })}
      </div>
    </div>
  );
}

// Step 3: Business Context
function StepBusinessContext({ context, onChange }) {
  const update = (field, value) => onChange({ ...context, [field]: value });

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>How is your organization structured in the cloud?</h2>
      <p style={{ marginBottom: '1.5rem', color: '#525252' }}>
        This helps us populate your widgets with relevant dimensions.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <FilterableMultiSelect
          id="cloud-providers"
          titleText="Cloud Providers"
          items={profilerDefaults.cloudProviders.map((p) => ({ id: p, text: p }))}
          itemToString={(item) => item?.text || ''}
          initialSelectedItems={context.providers.map((p) => ({ id: p, text: p }))}
          onChange={({ selectedItems }) => update('providers', selectedItems.map((i) => i.text))}
        />

        <Dropdown
          id="cost-grouping"
          titleText="Primary cost grouping"
          items={profilerDefaults.costGroupings}
          selectedItem={context.costGrouping}
          onChange={({ selectedItem }) => update('costGrouping', selectedItem)}
        />

        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Organization size (cloud spend)</p>
          <RadioButtonGroup
            name="org-size"
            valueSelected={context.orgSize}
            onChange={(value) => update('orgSize', value)}
            orientation="vertical"
          >
            {profilerDefaults.orgSizes.map((size) => (
              <RadioButton key={size} labelText={size} value={size} id={`size-${size}`} />
            ))}
          </RadioButtonGroup>
        </div>

        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>FinOps maturity</p>
          <RadioButtonGroup
            name="maturity"
            valueSelected={context.maturity}
            onChange={(value) => update('maturity', value)}
            orientation="vertical"
          >
            {profilerDefaults.maturityLevels.map((level) => (
              <RadioButton key={level.id} labelText={`${level.label} — ${level.description}`} value={level.id} id={`mat-${level.id}`} />
            ))}
          </RadioButtonGroup>
        </div>
      </div>
    </div>
  );
}

// Step 4: Key Dimensions
function StepDimensions({ dimensions, onChange }) {
  const toggleStandard = (dim) => {
    const updated = dimensions.standard.includes(dim)
      ? dimensions.standard.filter((d) => d !== dim)
      : [...dimensions.standard, dim];
    onChange({ ...dimensions, standard: updated });
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>What dimensions matter most to you?</h2>
      <p style={{ marginBottom: '1.5rem', color: '#525252' }}>
        These will populate your dashboard widgets. Don't worry — you can change these later.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.75rem' }}>Standard Dimensions</h4>
        {profilerDefaults.standardDimensions.map((dim) => (
          <Checkbox
            key={dim}
            id={`dim-${dim}`}
            labelText={dim}
            checked={dimensions.standard.includes(dim)}
            onChange={() => toggleStandard(dim)}
            style={{ marginBottom: '0.5rem' }}
          />
        ))}
      </div>

      <div>
        <h4 style={{ marginBottom: '0.75rem' }}>Your Business Mappings</h4>
        <FilterableMultiSelect
          id="custom-dimensions"
          titleText=""
          items={profilerDefaults.customDimensions.map((d) => ({ id: d, text: d }))}
          itemToString={(item) => item?.text || ''}
          initialSelectedItems={dimensions.custom.map((d) => ({ id: d, text: d }))}
          onChange={({ selectedItems }) => onChange({ ...dimensions, custom: selectedItems.map((i) => i.text) })}
          placeholder="Select business mappings..."
        />
      </div>
    </div>
  );
}

// Step 5: Review & Complete
function StepReview({ role, objectives, context, dimensions, onEditStep }) {
  const roleLabel = roleOptions.find((r) => r.id === role)?.title || role;
  const roleObjectives = profilerDefaults.objectives[role] || [];

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>Review your selections</h2>
      <p style={{ marginBottom: '1.5rem', color: '#525252' }}>
        Your experience will be tailored based on these preferences. Admins can override this with a custom blueprint at any time.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Tile style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>Your role</p>
              <p style={{ fontWeight: 600 }}>{roleLabel}</p>
            </div>
            <Button kind="ghost" size="sm" onClick={() => onEditStep(0)}>Edit</Button>
          </div>
        </Tile>

        <Tile style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>Your priorities</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {objectives.map((id) => {
                  const label = roleObjectives.find((o) => o.id === id)?.label || id;
                  return <Tag key={id} type="blue" size="sm">{label}</Tag>;
                })}
                {objectives.length === 0 && <span style={{ color: '#8d8d8d' }}>None selected</span>}
              </div>
            </div>
            <Button kind="ghost" size="sm" onClick={() => onEditStep(1)}>Edit</Button>
          </div>
        </Tile>

        <Tile style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>Your cloud environment</p>
              <p>{context.providers.join(', ') || 'Not specified'} &middot; {context.costGrouping || 'Not specified'} &middot; {context.orgSize || 'Not specified'}</p>
            </div>
            <Button kind="ghost" size="sm" onClick={() => onEditStep(2)}>Edit</Button>
          </div>
        </Tile>

        <Tile style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>Your key dimensions</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[...dimensions.standard, ...dimensions.custom].map((d) => (
                  <Tag key={d} type="cool-gray" size="sm">{d}</Tag>
                ))}
              </div>
            </div>
            <Button kind="ghost" size="sm" onClick={() => onEditStep(3)}>Edit</Button>
          </div>
        </Tile>
      </div>
    </div>
  );
}

function Profiler() {
  const navigate = useNavigate();
  const { dispatch } = useUser();
  const [step, setStep] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [businessContext, setBusinessContext] = useState({
    providers: [],
    costGrouping: null,
    orgSize: null,
    maturity: null,
  });
  const [dimensions, setDimensions] = useState({
    standard: ['Service / Product', 'Account / Subscription', 'Region'],
    custom: ['Cost Center', 'Team'],
  });

  const steps = ['Role', 'Priorities', 'Business Context', 'Dimensions', 'Review'];

  // Reset objectives when role changes
  const handleRoleSelect = (role) => {
    if (role !== selectedRole) {
      setObjectives([]);
    }
    setSelectedRole(role);
  };

  const handleComplete = () => {
    setIsLaunching(true);
    setTimeout(() => {
      dispatch({
        type: 'COMPLETE_PROFILER',
        payload: {
          role: selectedRole,
          objectives,
          businessContext,
          dimensions,
        },
      });
      navigate(`/dashboard/${selectedRole}`);
    }, 1500);
  };

  const canAdvance = () => {
    if (step === 0) return selectedRole !== null;
    return true;
  };

  if (isLaunching) {
    return (
      <div className="profiler-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <InlineLoading description="Building your personalized dashboard..." />
      </div>
    );
  }

  return (
    <div className="profiler-container">
      <ProgressIndicator currentIndex={step} spaceEqually style={{ marginBottom: '2rem' }}>
        {steps.map((label) => (
          <ProgressStep key={label} label={label} />
        ))}
      </ProgressIndicator>

      {step === 0 && <StepRoleSelect selectedRole={selectedRole} onSelect={handleRoleSelect} />}
      {step === 1 && <StepObjectives role={selectedRole} objectives={objectives} onChange={setObjectives} />}
      {step === 2 && <StepBusinessContext context={businessContext} onChange={setBusinessContext} />}
      {step === 3 && <StepDimensions dimensions={dimensions} onChange={setDimensions} />}
      {step === 4 && (
        <StepReview
          role={selectedRole}
          objectives={objectives}
          context={businessContext}
          dimensions={dimensions}
          onEditStep={setStep}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <Button
          kind="secondary"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          renderIcon={ArrowLeft}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
            renderIcon={ArrowRight}
          >
            Next
          </Button>
        ) : (
          <Button kind="primary" onClick={handleComplete} renderIcon={ArrowRight}>
            Launch My Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}

export default Profiler;
