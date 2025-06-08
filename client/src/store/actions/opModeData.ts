import {
  OpModeData,
  UpdateOpModeNameAction,
  UpdateOpModeStatusAction,
  UpdateOpModeAction,
  UPDATE_OPMODE_NAME,
  UPDATE_OPMODE_STATUS,
  UPDATE_OPMODE
} from '../types/opModeData';

// Update OpMode name
export const updateOpModeName = (name: string): UpdateOpModeNameAction => ({
  type: UPDATE_OPMODE_NAME,
  payload: name
});

// Update OpMode status
export const updateOpModeStatus = (status: string): UpdateOpModeStatusAction => ({
  type: UPDATE_OPMODE_STATUS,
  payload: status
});

// Update both name and status
export const updateOpMode = (name: string, status: string): UpdateOpModeAction => ({
  type: UPDATE_OPMODE,
  payload: { name, status }
});