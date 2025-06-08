import {
  StatesState,
  StatesAction,
  UPDATE_STATES,
  ADD_STATE,
  REMOVE_STATE,
  SET_CURRENT_STATE,
  CLEAR_CURRENT_STATE
} from '../types/states';

const initialState: StatesState = {
  states: [
    { name: 'IDLE', active: true },
    { name: 'INIT', active: false },
    { name: 'RUNNING', active: false },
    { name: 'STOPPED', active: false }
  ],
  currentState: 'IDLE'
};

export default function statesReducer(
  state: StatesState = initialState,
  action: StatesAction
): StatesState {
  switch (action.type) {
    case UPDATE_STATES:
      return {
        ...state,
        states: action.payload
      };

    case ADD_STATE:
      return {
        ...state,
        states: [...state.states, action.payload]
      };

    case REMOVE_STATE:
      return {
        ...state,
        states: state.states.filter(s => s.name !== action.payload),
        currentState: state.currentState === action.payload ? null : state.currentState
      };

    case SET_CURRENT_STATE:
      return {
        ...state,
        currentState: action.payload,
        states: state.states.map(s => ({
          ...s,
          active: s.name === action.payload
        }))
      };

    case CLEAR_CURRENT_STATE:
      return {
        ...state,
        currentState: null,
        states: state.states.map(s => ({
          ...s,
          active: false
        }))
      };

    default:
      return state;
  }
}