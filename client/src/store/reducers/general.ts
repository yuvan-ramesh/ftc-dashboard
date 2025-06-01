import {
  GeneralState,
  SubsystemAction,
  UPDATE_GENERAL,
} from '../types/subsystems';

const initialState: GeneralState = {
  voltage: 12.0,
  current: 0,
  batteryPercentage: 100,
  matchTimer: {
    mode: 'STOPPED',
    timeRemaining: 0,
    totalTime: 150, // 2:30 for a match
    isRunning: false,
  },
};

export default function generalReducer(
  state: GeneralState = initialState,
  action: SubsystemAction
): GeneralState {
  switch (action.type) {
    case UPDATE_GENERAL:
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
}