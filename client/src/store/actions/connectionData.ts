import {
  ConnectionData,
  UpdateConnectionStatusAction,
  SetConnectedAction,
  SetDisconnectedAction,
  UPDATE_CONNECTION_STATUS,
  SET_CONNECTED,
  SET_DISCONNECTED
} from '../types/connectionData';

// Update connection status
export const updateConnectionStatus = (
  isConnected: boolean,
  status?: string
): UpdateConnectionStatusAction => ({
  type: UPDATE_CONNECTION_STATUS,
  payload: {
    isConnected,
    status: status || (isConnected ? 'Connected' : 'Disconnected')
  }
});

// Set connected
export const setConnected = (status?: string): SetConnectedAction => ({
  type: SET_CONNECTED,
  payload: status
});

// Set disconnected
export const setDisconnected = (status?: string): SetDisconnectedAction => ({
  type: SET_DISCONNECTED,
  payload: status
});