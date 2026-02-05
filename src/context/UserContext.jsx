import React, { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const initialState = {
  currentUser: {
    name: 'Keenan Dolan',
    email: 'keenan@acmecorp.com',
    persona: null,
    view: 'All Accounts',
    profilerComplete: false,
    profilerAnswers: null,
  },
  isNewUser: true,
};

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_PERSONA':
      return {
        ...state,
        currentUser: { ...state.currentUser, persona: action.payload },
      };
    case 'COMPLETE_PROFILER':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          profilerComplete: true,
          profilerAnswers: action.payload,
          persona: action.payload.role,
        },
        isNewUser: false,
      };
    case 'SET_NEW_USER':
      return { ...state, isNewUser: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
