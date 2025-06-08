import {
  ClawDataState,
  ClawAction,
  UPDATE_CLAW_STATUS,
  SET_HAS_SAMPLE,
  SET_NO_SAMPLE
} from '../types/clawData';

const initialState: ClawDataState = {
  hasSample: false
};

export default function clawDataReducer(
  state: ClawDataState = initialState,
  action: ClawAction
): ClawDataState {
  switch (action.type) {
    case UPDATE_CLAW_STATUS:
      return {
        ...state,
        hasSample: action.payload
      };

    case SET_HAS_SAMPLE:
      return {
        ...state,
        hasSample: true
      };

    case SET_NO_SAMPLE:
      return {
        ...state,
        hasSample: false
      };

    default:
      return state;
  }
}