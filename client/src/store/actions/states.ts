import {
  State,
  UpdateStatesAction,
  AddStateAction,
  RemoveStateAction,
  SetCurrentStateAction,
  ClearCurrentStateAction,
  UPDATE_STATES,
  ADD_STATE,
  REMOVE_STATE,
  SET_CURRENT_STATE,
  CLEAR_CURRENT_STATE
} from '../types/states';

// Update all states
export const updateStates = (states: State[]): UpdateStatesAction => ({
  type: UPDATE_STATES,
  payload: states
});

// Add new state
export const addState = (name: string, active: boolean = false): AddStateAction => ({
  type: ADD_STATE,
  payload: { name, active }
});

// Remove state
export const removeState = (name: string): RemoveStateAction => ({
  type: REMOVE_STATE,
  payload: name
});

// Set current state
export const setCurrentState = (name: string): SetCurrentStateAction => ({
  type: SET_CURRENT_STATE,
  payload: name
});

// Clear current state
export const clearCurrentState = (): ClearCurrentStateAction => ({
  type: CLEAR_CURRENT_STATE
});