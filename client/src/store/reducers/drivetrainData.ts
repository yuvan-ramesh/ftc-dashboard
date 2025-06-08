import {
  DrivetrainDataState,
  DrivetrainAction,
  UPDATE_DRIVETRAIN_POSITION,
  UPDATE_VELOCITY_ACCEL,
  UPDATE_CENTER_OF_GRAVITY,
  UPDATE_ENCODERS,
  UPDATE_ALL_DRIVETRAIN,
  RESET_DRIVETRAIN
} from '../types/drivetrainData';

const initialState: DrivetrainDataState = {
  position: {
    x: 0,
    y: 0,
    z: 0,
    heading: 0
  },
  velocityAccel: {
    velocity: 0,
    acceleration: 0
  },
  centerOfGravity: {
    xOffset: 0,
    yOffset: 0
  },
  encoders: {
    leftFront: 0,
    rightFront: 0,
    leftBack: 0,
    rightBack: 0
  }
};

export default function drivetrainDataReducer(
  state: DrivetrainDataState = initialState,
  action: DrivetrainAction
): DrivetrainDataState {
  switch (action.type) {
    case UPDATE_DRIVETRAIN_POSITION:
      return {
        ...state,
        position: action.payload
      };

    case UPDATE_VELOCITY_ACCEL:
      return {
        ...state,
        velocityAccel: action.payload
      };

    case UPDATE_CENTER_OF_GRAVITY:
      return {
        ...state,
        centerOfGravity: action.payload
      };

    case UPDATE_ENCODERS:
      return {
        ...state,
        encoders: action.payload
      };

    case UPDATE_ALL_DRIVETRAIN:
      return {
        ...state,
        ...action.payload
      };

    case RESET_DRIVETRAIN:
      return initialState;

    default:
      return state;
  }
}