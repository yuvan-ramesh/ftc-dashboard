// Servo Types

export interface Servo {
  name: string;
  position: number; // double equivalent
}

export interface ServosState {
  servos: Servo[];
}

// Action Types
export const UPDATE_SERVOS = 'UPDATE_SERVOS';
export const UPDATE_SERVO_POSITION = 'UPDATE_SERVO_POSITION';
export const ADD_SERVO = 'ADD_SERVO';
export const REMOVE_SERVO = 'REMOVE_SERVO';

// Action Interfaces
export interface UpdateServosAction {
  type: typeof UPDATE_SERVOS;
  payload: Servo[];
}

export interface UpdateServoPositionAction {
  type: typeof UPDATE_SERVO_POSITION;
  payload: { name: string; position: number };
}

export interface AddServoAction {
  type: typeof ADD_SERVO;
  payload: Servo;
}

export interface RemoveServoAction {
  type: typeof REMOVE_SERVO;
  payload: string; // servo name
}

export type ServosAction =
  | UpdateServosAction
  | UpdateServoPositionAction
  | AddServoAction
  | RemoveServoAction;