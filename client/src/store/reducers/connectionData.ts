import {
  ConnectionDataState,
  ConnectionAction,
  UPDATE_CONNECTION_STATUS,
  SET_CONNECTED,
  SET_DISCONNECTED
} from '../types/connectionData';

const initialState: ConnectionDataState = {
  isConnected: false,
  status: 'Disconnected'
};

export default function connectionDataReducer(
  state: ConnectionDataState = initialState,
  action: ConnectionAction
): ConnectionDataState {
  switch (action.type) {
    case UPDATE_CONNECTION_STATUS:
      return {
        ...state,
        ...action.payload
      };

    case SET_CONNECTED:
      return {
        ...state,
        isConnected: true,
        status: action.payload || 'Connected'
      };

    case SET_DISCONNECTED:
      return {
        ...state,
        isConnected: false,
        status: action.payload || 'Disconnected'
      };

    default:
      return state;
  }
}