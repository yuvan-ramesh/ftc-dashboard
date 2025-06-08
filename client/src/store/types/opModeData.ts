// OpMode Data Types

export interface OpModeData {
  name: string;
  status: string;
}

export interface OpModeDataState extends OpModeData {}

// Action Types
export const UPDATE_OPMODE_NAME = 'UPDATE_OPMODE_NAME';
export const UPDATE_OPMODE_STATUS = 'UPDATE_OPMODE_STATUS';
export const UPDATE_OPMODE = 'UPDATE_OPMODE';

// Action Interfaces
export interface UpdateOpModeNameAction {
  type: typeof UPDATE_OPMODE_NAME;
  payload: string;
}

export interface UpdateOpModeStatusAction {
  type: typeof UPDATE_OPMODE_STATUS;
  payload: string;
}

export interface UpdateOpModeAction {
  type: typeof UPDATE_OPMODE;
  payload: OpModeData;
}

export type OpModeAction =
  | UpdateOpModeNameAction
  | UpdateOpModeStatusAction
  | UpdateOpModeAction;