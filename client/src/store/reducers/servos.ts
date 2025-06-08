import {
  ServosState,
  ServosAction,
  UPDATE_SERVOS,
  UPDATE_SERVO_POSITION,
  ADD_SERVO,
  REMOVE_SERVO
} from '../types/servos';

const initialState: ServosState = {
  servos: [
    { name: 'claw', position: 0 },
    { name: 'wrist', position: 90 },
    { name: 'arm', position: 45 },
    { name: 'rotation', position: 180 },
    { name: 'bucket', position: 0 }
  ]
};

export default function servosReducer(
  state: ServosState = initialState,
  action: ServosAction
): ServosState {
  switch (action.type) {
    case UPDATE_SERVOS:
      return {
        ...state,
        servos: action.payload
      };

    case UPDATE_SERVO_POSITION:
      return {
        ...state,
        servos: state.servos.map(servo =>
          servo.name === action.payload.name
            ? { ...servo, position: action.payload.position }
            : servo
        )
      };

    case ADD_SERVO:
      return {
        ...state,
        servos: [...state.servos, action.payload]
      };

    case REMOVE_SERVO:
      return {
        ...state,
        servos: state.servos.filter(servo => servo.name !== action.payload)
      };

    default:
      return state;
  }
}