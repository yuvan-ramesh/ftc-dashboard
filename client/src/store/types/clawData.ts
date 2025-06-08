// Claw Data Types

export interface ClawData {
  hasSample: boolean;
}

export interface ClawDataState extends ClawData {}

// Action Types
export const UPDATE_CLAW_STATUS = 'UPDATE_CLAW_STATUS';
export const SET_HAS_SAMPLE = 'SET_HAS_SAMPLE';
export const SET_NO_SAMPLE = 'SET_NO_SAMPLE';

// Action Interfaces
export interface UpdateClawStatusAction {
  type: typeof UPDATE_CLAW_STATUS;
  payload: boolean;
}

export interface SetHasSampleAction {
  type: typeof SET_HAS_SAMPLE;
}

export interface SetNoSampleAction {
  type: typeof SET_NO_SAMPLE;
}

export type ClawAction =
  | UpdateClawStatusAction
  | SetHasSampleAction
  | SetNoSampleAction;