// Connection Data Types

export interface ConnectionData {
  isConnected: boolean;
  status: string;
}

export interface ConnectionDataState extends ConnectionData {}

// Action Types
export const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';
export const SET_CONNECTED = 'SET_CONNECTED';
export const SET_DISCONNECTED = 'SET_DISCONNECTED';

// Action Interfaces
export interface UpdateConnectionStatusAction {
  type: typeof UPDATE_CONNECTION_STATUS;
  payload: ConnectionData;
}

export interface SetConnectedAction {
  type: typeof SET_CONNECTED;
  payload?: string; // optional status message
}

export interface SetDisconnectedAction {
  type: typeof SET_DISCONNECTED;
  payload?: string; // optional status message
}

export type ConnectionAction =
  | UpdateConnectionStatusAction
  | SetConnectedAction
  | SetDisconnectedAction;