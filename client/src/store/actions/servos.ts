import {
  Servo,
  UpdateServosAction,
  UpdateServoPositionAction,
  AddServoAction,
  RemoveServoAction,
  UPDATE_SERVOS,
  UPDATE_SERVO_POSITION,
  ADD_SERVO,
  REMOVE_SERVO
} from '../types/servos';

// Update all servos
export const updateServos = (servos: Servo[]): UpdateServosAction => ({
  type: UPDATE_SERVOS,
  payload: servos
});

// Update single servo position
export const updateServoPosition = (name: string, position: number): UpdateServoPositionAction => ({
  type: UPDATE_SERVO_POSITION,
  payload: { name, position }
});

// Add new servo
export const addServo = (name: string, position: number = 0): AddServoAction => ({
  type: ADD_SERVO,
  payload: { name, position }
});

// Remove servo
export const removeServo = (name: string): RemoveServoAction => ({
  type: REMOVE_SERVO,
  payload: name
});

// Helper action to update multiple servo positions
export const updateMultipleServoPositions = (positions: { [name: string]: number }) => 
  (dispatch: any) => {
    Object.entries(positions).forEach(([name, position]) => {
      dispatch(updateServoPosition(name, position));
    });
  };