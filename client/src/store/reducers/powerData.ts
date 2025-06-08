import {
  PowerDataState,
  PowerAction,
  UPDATE_VOLTAGE,
  UPDATE_CURRENT,
  UPDATE_POWER
} from '../types/powerData';

const initialState: PowerDataState = {
  voltage: 12.0,
  current: 0
};

export default function powerDataReducer(
  state: PowerDataState = initialState,
  action: PowerAction
): PowerDataState {
  switch (action.type) {
    case UPDATE_VOLTAGE:
      return {
        ...state,
        voltage: action.payload
      };

    case UPDATE_CURRENT:
      return {
        ...state,
        current: action.payload
      };

    case UPDATE_POWER:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}