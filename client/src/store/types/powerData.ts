// Power Data Types

export interface PowerData {
  voltage: number; // double
  current: number; // double
}

export interface PowerDataState extends PowerData {}

// Action Types
export const UPDATE_VOLTAGE = 'UPDATE_VOLTAGE';
export const UPDATE_CURRENT = 'UPDATE_CURRENT';
export const UPDATE_POWER = 'UPDATE_POWER';

// Action Interfaces
export interface UpdateVoltageAction {
  type: typeof UPDATE_VOLTAGE;
  payload: number;
}

export interface UpdateCurrentAction {
  type: typeof UPDATE_CURRENT;
  payload: number;
}

export interface UpdatePowerAction {
  type: typeof UPDATE_POWER;
  payload: PowerData;
}

export type PowerAction =
  | UpdateVoltageAction
  | UpdateCurrentAction
  | UpdatePowerAction;