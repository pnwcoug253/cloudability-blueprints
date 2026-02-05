import React, { useState } from 'react';
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  Select,
  SelectItem,
  InlineNotification,
  Tile,
} from '@carbon/react';
import { Add, TrashCan } from '@carbon/icons-react';
import { useBlueprint } from '../../context/BlueprintContext';
import usersData from '../../data/users.json';

const personaLabels = { admin: 'Admin', finops: 'FinOps Practitioner', devops: 'DevOps / Engineer', finance: 'Finance' };
const personaColors = { admin: 'blue', finops: 'teal', devops: 'purple', finance: 'green' };

// Views use IDs that match user.view values in users.json
const viewData = [
  { id: 'all-accounts', name: 'All Accounts', scope: 'Global — all linked provider accounts', users: 47 },
  { id: 'aws-production', name: 'AWS Production', scope: 'AWS prod accounts only', users: 12 },
  { id: 'azure-dev', name: 'Azure Dev', scope: 'Azure dev subscriptions', users: 8 },
  { id: 'finance-reporting', name: 'Finance Reporting', scope: 'All accounts (read-only)', users: 5 },
];

// ─── Tab 1: By Persona ──────────────────────────────────────────────────────

function ByPersonaTab({ assignments, blueprints, dispatch }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editPersona, setEditPersona] = useState(null);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState('');

  const personaAssignments = ['admin', 'finops', 'devops', 'finance'].map((persona) => {
    const assignment = assignments.find((a) => a.targetType === 'persona' && a.targetId === persona);
    const blueprint = assignment ? blueprints.find((bp) => bp.id === assignment.blueprintId) : null;
    const userCount = usersData.filter((u) => u.persona === persona).length;
    return { persona, assignment, blueprint, userCount };
  });

  const handleChangeBlueprint = () => {
    if (editPersona && selectedBlueprintId) {
      const existing = assignments.find((a) => a.targetType === 'persona' && a.targetId === editPersona);
      if (existing) {
        dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { ...existing, blueprintId: selectedBlueprintId } });
      } else {
        dispatch({
          type: 'ADD_ASSIGNMENT',
          payload: {
            id: `asgn-persona-${editPersona}-${Date.now()}`,
            blueprintId: selectedBlueprintId,
            targetType: 'persona',
            targetId: editPersona,
            priority: 1,
          },
        });
      }
    }
    setModalOpen(false);
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Persona</TableHeader>
            <TableHeader>Blueprint</TableHeader>
            <TableHeader>Users Affected</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {personaAssignments.map(({ persona, blueprint, userCount }) => (
            <TableRow key={persona}>
              <TableCell>
                <Tag type={personaColors[persona]} size="sm">{personaLabels[persona]}</Tag>
              </TableCell>
              <TableCell>{blueprint?.name || '—'}</TableCell>
              <TableCell>{userCount} users</TableCell>
              <TableCell>
                <Tag type={blueprint ? 'green' : 'red'} size="sm">
                  {blueprint ? 'Active' : 'No blueprint'}
                </Tag>
              </TableCell>
              <TableCell>
                <Button
                  kind="ghost"
                  size="sm"
                  onClick={() => {
                    setEditPersona(persona);
                    setSelectedBlueprintId('');
                    setModalOpen(true);
                  }}
                >
                  Change Blueprint
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onRequestSubmit={handleChangeBlueprint}
        modalHeading={`Change Blueprint — ${personaLabels[editPersona] || editPersona}`}
        primaryButtonText="Apply"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!selectedBlueprintId}
      >
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1rem' }}>
          All users with the <strong>{personaLabels[editPersona]}</strong> persona will see this blueprint
          as their default dashboard — unless they have a view-level or user-level override.
        </p>
        <Select
          id="change-bp-persona"
          labelText="Select a blueprint"
          value={selectedBlueprintId}
          onChange={(e) => setSelectedBlueprintId(e.target.value)}
        >
          <SelectItem value="" text="Choose a blueprint..." />
          {blueprints.map((bp) => (
            <SelectItem key={bp.id} value={bp.id} text={`${bp.name} (${bp.persona})`} />
          ))}
        </Select>
      </Modal>
    </div>
  );
}

// ─── Tab 2: By View ──────────────────────────────────────────────────────────

function ByViewTab({ assignments, blueprints, dispatch }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editViewId, setEditViewId] = useState(null);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState('');

  const getViewAssignment = (viewId) =>
    assignments.find((a) => a.targetType === 'view' && a.targetId === viewId);

  const handleApplyOverride = () => {
    if (editViewId && selectedBlueprintId) {
      const existing = getViewAssignment(editViewId);
      if (existing) {
        dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { ...existing, blueprintId: selectedBlueprintId } });
      } else {
        dispatch({
          type: 'ADD_ASSIGNMENT',
          payload: {
            id: `asgn-view-${editViewId}-${Date.now()}`,
            blueprintId: selectedBlueprintId,
            targetType: 'view',
            targetId: editViewId,
            priority: 2,
          },
        });
      }
    }
    setModalOpen(false);
  };

  const handleRemoveOverride = (viewId) => {
    const existing = getViewAssignment(viewId);
    if (existing) {
      dispatch({ type: 'REMOVE_ASSIGNMENT', payload: existing.id });
    }
  };

  const editView = viewData.find((v) => v.id === editViewId);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>View Name</TableHeader>
            <TableHeader>Scope</TableHeader>
            <TableHeader>Blueprint Override</TableHeader>
            <TableHeader>Users in View</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {viewData.map((view) => {
            const assignment = getViewAssignment(view.id);
            const bp = assignment ? blueprints.find((b) => b.id === assignment.blueprintId) : null;
            return (
              <TableRow key={view.id}>
                <TableCell style={{ fontWeight: 500 }}>{view.name}</TableCell>
                <TableCell>{view.scope}</TableCell>
                <TableCell>
                  {bp ? (
                    <span>{bp.name}</span>
                  ) : (
                    <span style={{ color: '#8d8d8d' }}>Uses persona default</span>
                  )}
                </TableCell>
                <TableCell>{view.users}</TableCell>
                <TableCell>
                  {bp ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        kind="ghost"
                        size="sm"
                        onClick={() => {
                          setEditViewId(view.id);
                          setSelectedBlueprintId(assignment.blueprintId);
                          setModalOpen(true);
                        }}
                      >
                        Change
                      </Button>
                      <Button
                        kind="danger--ghost"
                        size="sm"
                        onClick={() => handleRemoveOverride(view.id)}
                      >
                        Remove Override
                      </Button>
                    </div>
                  ) : (
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={Add}
                      onClick={() => {
                        setEditViewId(view.id);
                        setSelectedBlueprintId('');
                        setModalOpen(true);
                      }}
                    >
                      Set Override
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Modal
        open={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onRequestSubmit={handleApplyOverride}
        modalHeading={`Blueprint Override — ${editView?.name || ''}`}
        primaryButtonText="Apply Override"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!selectedBlueprintId}
      >
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1rem' }}>
          Users in the <strong>{editView?.name}</strong> view ({editView?.scope}) will see this blueprint
          instead of their persona default. Individual user overrides will still take priority.
        </p>
        <Select
          id="change-bp-view"
          labelText="Select a blueprint"
          value={selectedBlueprintId}
          onChange={(e) => setSelectedBlueprintId(e.target.value)}
        >
          <SelectItem value="" text="Choose a blueprint..." />
          {blueprints.map((bp) => (
            <SelectItem key={bp.id} value={bp.id} text={`${bp.name} (${bp.persona})`} />
          ))}
        </Select>
      </Modal>
    </div>
  );
}

// ─── Tab 3: By User ──────────────────────────────────────────────────────────

function ByUserTab({ assignments, blueprints, dispatch }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState('');

  const getUserAssignment = (userId) =>
    assignments.find((a) => a.targetType === 'user' && a.targetId === userId);

  const handleApplyOverride = () => {
    if (editUserId && selectedBlueprintId) {
      const existing = getUserAssignment(editUserId);
      if (existing) {
        dispatch({ type: 'UPDATE_ASSIGNMENT', payload: { ...existing, blueprintId: selectedBlueprintId } });
      } else {
        dispatch({
          type: 'ADD_ASSIGNMENT',
          payload: {
            id: `asgn-user-${editUserId}-${Date.now()}`,
            blueprintId: selectedBlueprintId,
            targetType: 'user',
            targetId: editUserId,
            priority: 3,
          },
        });
      }
    }
    setModalOpen(false);
  };

  const handleResetOverride = (userId) => {
    const existing = getUserAssignment(userId);
    if (existing) {
      dispatch({ type: 'REMOVE_ASSIGNMENT', payload: existing.id });
    }
  };

  const editUser = usersData.find((u) => u.id === editUserId);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>User</TableHeader>
            <TableHeader>Persona</TableHeader>
            <TableHeader>View</TableHeader>
            <TableHeader>Active Blueprint</TableHeader>
            <TableHeader>Source</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((user) => {
            const personaAssignment = assignments.find((a) => a.targetType === 'persona' && a.targetId === user.persona);
            const viewAssignment = assignments.find((a) => a.targetType === 'view' && a.targetId === user.view);
            const userAssignment = getUserAssignment(user.id);

            let activeBp = null;
            let source = 'Persona default';
            let sourceTagType = 'cool-gray';
            if (userAssignment) {
              activeBp = blueprints.find((bp) => bp.id === userAssignment.blueprintId);
              source = 'User override';
              sourceTagType = 'purple';
            } else if (viewAssignment) {
              activeBp = blueprints.find((bp) => bp.id === viewAssignment.blueprintId);
              source = 'View override';
              sourceTagType = 'teal';
            } else if (personaAssignment) {
              activeBp = blueprints.find((bp) => bp.id === personaAssignment.blueprintId);
            }

            const viewName = viewData.find((v) => v.id === user.view)?.name || user.view;

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p style={{ fontWeight: 500 }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#8d8d8d' }}>{user.role}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Tag type={personaColors[user.persona] || 'gray'} size="sm">
                    {personaLabels[user.persona] || user.persona}
                  </Tag>
                </TableCell>
                <TableCell>{viewName}</TableCell>
                <TableCell>{activeBp?.name || '—'}</TableCell>
                <TableCell>
                  <Tag type={sourceTagType} size="sm">{source}</Tag>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      kind="ghost"
                      size="sm"
                      onClick={() => {
                        setEditUserId(user.id);
                        setSelectedBlueprintId(userAssignment?.blueprintId || '');
                        setModalOpen(true);
                      }}
                    >
                      {userAssignment ? 'Change' : 'Override'}
                    </Button>
                    {userAssignment && (
                      <Button
                        kind="danger--ghost"
                        size="sm"
                        onClick={() => handleResetOverride(user.id)}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Modal
        open={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onRequestSubmit={handleApplyOverride}
        modalHeading={`Blueprint Override — ${editUser?.name || ''}`}
        primaryButtonText="Apply Override"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!selectedBlueprintId}
      >
        {editUser && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#525252' }}>
              This override will apply only to <strong>{editUser.name}</strong> ({editUser.role}).
              It takes the highest priority — overriding both their persona default and any view-level assignment.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Tag type={personaColors[editUser.persona]} size="sm">{personaLabels[editUser.persona]}</Tag>
              <Tag type="cool-gray" size="sm">{viewData.find((v) => v.id === editUser.view)?.name || editUser.view}</Tag>
            </div>
          </div>
        )}
        <Select
          id="change-bp-user"
          labelText="Select a blueprint"
          value={selectedBlueprintId}
          onChange={(e) => setSelectedBlueprintId(e.target.value)}
        >
          <SelectItem value="" text="Choose a blueprint..." />
          {blueprints.map((bp) => (
            <SelectItem key={bp.id} value={bp.id} text={`${bp.name} (${bp.persona})`} />
          ))}
        </Select>
      </Modal>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function BlueprintAssignment() {
  const { state, dispatch } = useBlueprint();

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Blueprint Assignments</h2>
        <p style={{ color: '#525252', fontSize: '0.875rem' }}>
          Control which blueprint each user sees by assigning at three levels of specificity
        </p>
      </div>

      {/* Design context for the UX team */}
      <Tile style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: '#f4f4f4' }}>
        <h5 style={{ marginBottom: '0.5rem' }}>How assignment hierarchy works</h5>
        <p style={{ fontSize: '0.8125rem', color: '#525252', lineHeight: 1.5, margin: 0 }}>
          Blueprints are assigned at three levels. <strong>Persona defaults</strong> act as the baseline —
          every user with a given persona sees that blueprint unless overridden.{' '}
          <strong>View overrides</strong> let you tailor the experience for users scoped to a specific
          Cloudability view (e.g. "AWS Production" or "Finance Reporting") — useful when the same persona
          needs different widgets depending on what data they're looking at.{' '}
          <strong>User overrides</strong> are the most specific — for power users, executives, or anyone
          who needs a one-off layout. The resolution order is: User override &gt; View override &gt; Persona default.
        </p>
      </Tile>

      <Tabs>
        <TabList aria-label="Assignment tabs">
          <Tab>By Persona</Tab>
          <Tab>By View</Tab>
          <Tab>By User</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <InlineNotification
              kind="info"
              title="Persona defaults"
              subtitle="These are the baseline assignments. Every user with a given persona sees this blueprint unless a view or user override takes priority."
              lowContrast
              hideCloseButton
              style={{ marginBottom: '1rem' }}
            />
            <ByPersonaTab assignments={state.assignments} blueprints={state.blueprints} dispatch={dispatch} />
          </TabPanel>
          <TabPanel>
            <InlineNotification
              kind="info"
              title="View overrides"
              subtitle="Assign a different blueprint to users scoped to a specific Cloudability view. This overrides persona defaults but is itself overridden by user-level assignments."
              lowContrast
              hideCloseButton
              style={{ marginBottom: '1rem' }}
            />
            <ByViewTab assignments={state.assignments} blueprints={state.blueprints} dispatch={dispatch} />
          </TabPanel>
          <TabPanel>
            <InlineNotification
              kind="info"
              title="User overrides"
              subtitle="Assign a specific blueprint to an individual user. This is the highest-priority assignment and overrides both persona and view assignments. The 'Source' column shows where each user's current blueprint comes from."
              lowContrast
              hideCloseButton
              style={{ marginBottom: '1rem' }}
            />
            <ByUserTab assignments={state.assignments} blueprints={state.blueprints} dispatch={dispatch} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default BlueprintAssignment;
