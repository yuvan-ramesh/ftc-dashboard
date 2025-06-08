import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action, combineReducers } from 'redux';

import replayReducer from './replay';
import telemetryReducer from './telemetry';
import socketReducer from './socket';
import configReducer from './config';
import statusReducer from './status';
import cameraReducer from './camera';
import settingsReducer from './settings';
import gamepadReducer from './gamepad';
import subsystemsReducer from './subsystems';
import enhancedTelemetryReducer from './enhancedTelemetry';
import generalReducer from './general';
import graphsReducer from './graphs';

// New individual reducers
import servosReducer from './servos';
import slidesReducer from './slides';
import statesReducer from './states';
import drivetrainDataReducer from './drivetrainData';
import graphDataReducer from './graphData';
import opModeDataReducer from './opModeData';
import powerDataReducer from './powerData';
import connectionDataReducer from './connectionData';
import cameraDataReducer from './cameraData';
import clawDataReducer from './clawData';

import { createDispatchHook } from 'react-redux';

const rootReducer = combineReducers({
  replay: replayReducer,
  telemetry: telemetryReducer,
  socket: socketReducer,
  config: configReducer,
  status: statusReducer,
  camera: cameraReducer,
  settings: settingsReducer,
  gamepad: gamepadReducer,
  subsystems: subsystemsReducer,
  enhancedTelemetry: enhancedTelemetryReducer,
  general: generalReducer,
  graphs: graphsReducer,
  
  // New individual dashboard data stores
  servos: servosReducer,
  slides: slidesReducer,
  states: statesReducer,
  drivetrainData: drivetrainDataReducer,
  graphData: graphDataReducer,
  opModeData: opModeDataReducer,
  powerData: powerDataReducer,
  connectionData: connectionDataReducer,
  cameraData: cameraDataReducer,
  clawData: clawDataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type RootActions = Parameters<typeof rootReducer>[1];

export const useAppDispatch = createDispatchHook<RootState, RootActions>();

// TODO: these types seem to only be used in the middlewares
// but there we have the freedom to dispatch how we like?
// not sure why we need thunks there tbh
export type AppThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppThunkDispatch<ReturnType = void> = ThunkDispatch<
  RootState,
  ReturnType,
  Action
>;

export default rootReducer;
