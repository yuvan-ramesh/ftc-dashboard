import {
  OpModeDataState,
  OpModeAction,
  UPDATE_OPMODE_NAME,
  UPDATE_OPMODE_STATUS,
  UPDATE_OPMODE
} from '../types/opModeData';

const initialState: OpModeDataState = {
  name: 'TeleOp',
  status: 'STOPPED'
};

export default function opModeDataReducer(
  state: OpModeDataState = initialState,
  action: OpModeAction
): OpModeDataState {
  switch (action.type) {
    case UPDATE_OPMODE_NAME:
      return {
        ...state,
        name: action.payload
      };

    case UPDATE_OPMODE_STATUS:
      return {
        ...state,
        status: action.payload
      };

    case UPDATE_OPMODE:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}