import React, { createContext, useContext, useReducer } from 'react';
import blueprintsData from '../data/blueprints.json';
import assignmentsData from '../data/assignments.json';

const BlueprintContext = createContext();

const initialState = {
  blueprints: blueprintsData,
  assignments: assignmentsData,
  activeBlueprint: null,
  builderState: {
    canvasWidgets: [],
    selectedWidget: null,
    isDirty: false,
    blueprintName: '',
    blueprintPersona: '',
    blueprintDescription: '',
    blueprintTier: 'standard',
  },
};

function blueprintReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_BLUEPRINT':
      return { ...state, activeBlueprint: action.payload };
    case 'ADD_BLUEPRINT':
      return { ...state, blueprints: [...state.blueprints, action.payload] };
    case 'UPDATE_BLUEPRINT':
      return {
        ...state,
        blueprints: state.blueprints.map(bp =>
          bp.id === action.payload.id ? action.payload : bp
        ),
      };
    case 'DELETE_BLUEPRINT':
      return {
        ...state,
        blueprints: state.blueprints.filter(bp => bp.id !== action.payload),
      };
    case 'ADD_CANVAS_WIDGET':
      return {
        ...state,
        builderState: {
          ...state.builderState,
          canvasWidgets: [...state.builderState.canvasWidgets, action.payload],
          isDirty: true,
        },
      };
    case 'REMOVE_CANVAS_WIDGET':
      return {
        ...state,
        builderState: {
          ...state.builderState,
          canvasWidgets: state.builderState.canvasWidgets.filter(
            w => w.id !== action.payload
          ),
          isDirty: true,
        },
      };
    case 'REORDER_CANVAS_WIDGETS':
      return {
        ...state,
        builderState: {
          ...state.builderState,
          canvasWidgets: action.payload,
          isDirty: true,
        },
      };
    case 'SELECT_CANVAS_WIDGET':
      return {
        ...state,
        builderState: {
          ...state.builderState,
          selectedWidget: action.payload,
        },
      };
    case 'UPDATE_WIDGET_CONFIG':
      return {
        ...state,
        builderState: {
          ...state.builderState,
          canvasWidgets: state.builderState.canvasWidgets.map(w =>
            w.id === action.payload.id ? { ...w, config: { ...w.config, ...action.payload.config } } : w
          ),
          isDirty: true,
        },
      };
    case 'SET_BUILDER_META':
      return {
        ...state,
        builderState: { ...state.builderState, ...action.payload },
      };
    case 'LOAD_BLUEPRINT_TO_BUILDER':
      return {
        ...state,
        builderState: {
          ...state.builderState,
          canvasWidgets: action.payload.widgets || [],
          blueprintName: action.payload.name,
          blueprintPersona: action.payload.persona,
          blueprintDescription: action.payload.description,
          blueprintTier: action.payload.licenseTier,
          isDirty: false,
        },
      };
    case 'RESET_BUILDER':
      return {
        ...state,
        builderState: initialState.builderState,
      };
    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [...state.assignments, action.payload],
      };
    case 'REMOVE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(a => a.id !== action.payload),
      };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    default:
      return state;
  }
}

export function BlueprintProvider({ children }) {
  const [state, dispatch] = useReducer(blueprintReducer, initialState);
  return (
    <BlueprintContext.Provider value={{ state, dispatch }}>
      {children}
    </BlueprintContext.Provider>
  );
}

export function useBlueprint() {
  const context = useContext(BlueprintContext);
  if (!context) throw new Error('useBlueprint must be used within BlueprintProvider');
  return context;
}
