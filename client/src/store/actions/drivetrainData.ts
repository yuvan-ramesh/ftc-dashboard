import {
  DrivetrainPosition,
  VelocityAcceleration,
  CenterOfGravity,
  EncoderValues,
  DrivetrainDataState,
  UpdateDrivetrainPositionAction,
  UpdateVelocityAccelAction,
  UpdateCenterOfGravityAction,
  UpdateEncodersAction,
  UpdateAllDrivetrainAction,
  ResetDrivetrainAction,
  UPDATE_DRIVETRAIN_POSITION,
  UPDATE_VELOCITY_ACCEL,
  UPDATE_CENTER_OF_GRAVITY,
  UPDATE_ENCODERS,
  UPDATE_ALL_DRIVETRAIN,
  RESET_DRIVETRAIN
} from '../types/drivetrainData';

// Update position
export const updateDrivetrainPosition = (
  x: number,
  y: number,
  z: number,
  heading: number
): UpdateDrivetrainPositionAction => ({
  type: UPDATE_DRIVETRAIN_POSITION,
  payload: { x, y, z, heading }
});

// Update velocity and acceleration
export const updateVelocityAccel = (
  velocity: number,
  acceleration: number
): UpdateVelocityAccelAction => ({
  type: UPDATE_VELOCITY_ACCEL,
  payload: { velocity, acceleration }
});

// Update center of gravity
export const updateCenterOfGravity = (
  xOffset: number,
  yOffset: number
): UpdateCenterOfGravityAction => ({
  type: UPDATE_CENTER_OF_GRAVITY,
  payload: { xOffset, yOffset }
});

// Update encoders
export const updateEncoders = (
  leftFront: number,
  rightFront: number,
  leftBack: number,
  rightBack: number
): UpdateEncodersAction => ({
  type: UPDATE_ENCODERS,
  payload: { leftFront, rightFront, leftBack, rightBack }
});

// Update all drivetrain data at once
export const updateAllDrivetrain = (
  data: Partial<DrivetrainDataState>
): UpdateAllDrivetrainAction => ({
  type: UPDATE_ALL_DRIVETRAIN,
  payload: data
});

// Reset drivetrain
export const resetDrivetrain = (): ResetDrivetrainAction => ({
  type: RESET_DRIVETRAIN
});