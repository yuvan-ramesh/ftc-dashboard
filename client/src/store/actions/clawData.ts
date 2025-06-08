import {
  UpdateClawStatusAction,
  SetHasSampleAction,
  SetNoSampleAction,
  UPDATE_CLAW_STATUS,
  SET_HAS_SAMPLE,
  SET_NO_SAMPLE
} from '../types/clawData';

// Update claw status
export const updateClawStatus = (hasSample: boolean): UpdateClawStatusAction => ({
  type: UPDATE_CLAW_STATUS,
  payload: hasSample
});

// Set has sample
export const setHasSample = (): SetHasSampleAction => ({
  type: SET_HAS_SAMPLE
});

// Set no sample
export const setNoSample = (): SetNoSampleAction => ({
  type: SET_NO_SAMPLE
});