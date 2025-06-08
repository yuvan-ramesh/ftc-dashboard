import {
  PowerData,
  UpdateVoltageAction,
  UpdateCurrentAction,
  UpdatePowerAction,
  UPDATE_VOLTAGE,
  UPDATE_CURRENT,
  UPDATE_POWER
} from '../types/powerData';

// Update voltage
export const updateVoltage = (voltage: number): UpdateVoltageAction => ({
  type: UPDATE_VOLTAGE,
  payload: voltage
});

// Update current
export const updateCurrent = (current: number): UpdateCurrentAction => ({
  type: UPDATE_CURRENT,
  payload: current
});

// Update both voltage and current
export const updatePower = (voltage: number, current: number): UpdatePowerAction => ({
  type: UPDATE_POWER,
  payload: { voltage, current }
});