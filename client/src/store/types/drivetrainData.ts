// Drivetrain Types

export interface DrivetrainPosition {
  x: number; // double
  y: number; // double
  z: number; // double
  heading: number; // double (radians)
}

export interface VelocityAcceleration {
  velocity: number; // in/s - double
  acceleration: number; // in/s² - double
}

export interface CenterOfGravity {
  xOffset: number; // double
  yOffset: number; // double
}

export interface EncoderValues {
  leftFront: number; // double
  rightFront: number; // double
  leftBack: number; // double
  rightBack: number; // double
}

export interface DrivetrainDataState {
  position: DrivetrainPosition;
  velocityAccel: VelocityAcceleration;
  centerOfGravity: CenterOfGravity;
  encoders: EncoderValues;
}

// Action Types
export const UPDATE_DRIVETRAIN_POSITION = 'UPDATE_DRIVETRAIN_POSITION';
export const UPDATE_VELOCITY_ACCEL = 'UPDATE_VELOCITY_ACCEL';
export const UPDATE_CENTER_OF_GRAVITY = 'UPDATE_CENTER_OF_GRAVITY';
export const UPDATE_ENCODERS = 'UPDATE_ENCODERS';
export const UPDATE_ALL_DRIVETRAIN = 'UPDATE_ALL_DRIVETRAIN';
export const RESET_DRIVETRAIN = 'RESET_DRIVETRAIN';

// Action Interfaces
export interface UpdateDrivetrainPositionAction {
  type: typeof UPDATE_DRIVETRAIN_POSITION;
  payload: DrivetrainPosition;
}

export interface UpdateVelocityAccelAction {
  type: typeof UPDATE_VELOCITY_ACCEL;
  payload: VelocityAcceleration;
}

export interface UpdateCenterOfGravityAction {
  type: typeof UPDATE_CENTER_OF_GRAVITY;
  payload: CenterOfGravity;
}

export interface UpdateEncodersAction {
  type: typeof UPDATE_ENCODERS;
  payload: EncoderValues;
}

export interface UpdateAllDrivetrainAction {
  type: typeof UPDATE_ALL_DRIVETRAIN;
  payload: Partial<DrivetrainDataState>;
}

export interface ResetDrivetrainAction {
  type: typeof RESET_DRIVETRAIN;
}

export type DrivetrainAction =
  | UpdateDrivetrainPositionAction
  | UpdateVelocityAccelAction
  | UpdateCenterOfGravityAction
  | UpdateEncodersAction
  | UpdateAllDrivetrainAction
  | ResetDrivetrainAction;