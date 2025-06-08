// States Types

export interface State {
  name: string;
  active?: boolean;
}

export interface StatesState {
  states: State[];
  currentState: string | null;
}

// Action Types
export const UPDATE_STATES = 'UPDATE_STATES';
export const ADD_STATE = 'ADD_STATE';
export const REMOVE_STATE = 'REMOVE_STATE';
export const SET_CURRENT_STATE = 'SET_CURRENT_STATE';
export const CLEAR_CURRENT_STATE = 'CLEAR_CURRENT_STATE';

// Action Interfaces
export interface UpdateStatesAction {
  type: typeof UPDATE_STATES;
  payload: State[];
}

export interface AddStateAction {
  type: typeof ADD_STATE;
  payload: State;
}

export interface RemoveStateAction {
  type: typeof REMOVE_STATE;
  payload: string; // state name
}

export interface SetCurrentStateAction {
  type: typeof SET_CURRENT_STATE;
  payload: string; // state name
}

export interface ClearCurrentStateAction {
  type: typeof CLEAR_CURRENT_STATE;
}

export type StatesAction =
  | UpdateStatesAction
  | AddStateAction
  | RemoveStateAction
  | SetCurrentStateAction
  | ClearCurrentStateAction;