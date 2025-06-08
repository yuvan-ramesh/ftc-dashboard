import {
  UPDATE_DRIVETRAIN,
  UPDATE_INTAKE,
  UPDATE_DEPOSIT,
  UPDATE_CAMERA_ENHANCED,
  UPDATE_GENERAL,
  UPDATE_TELEMETRY_SECTION,
  TOGGLE_TELEMETRY_PAUSE,
  ADD_GRAPH,
  REMOVE_GRAPH,
  UPDATE_GRAPH_DATA,
  UpdateDrivetrainAction,
  UpdateIntakeAction,
  UpdateDepositAction,
  UpdateCameraEnhancedAction,
  UpdateGeneralAction,
  UpdateTelemetrySectionAction,
  ToggleTelemetryPauseAction,
  AddGraphAction,
  RemoveGraphAction,
  UpdateGraphDataAction,
  DrivetrainState,
  IntakeState,
  DepositState,
  CameraEnhancedState,
  GeneralState,
  TelemetryValue,
  GraphConfig,
  GraphDataPoint,
} from '../types/subsystems';

// Drivetrain Actions
export const updateDrivetrain = (
  data: Partial<DrivetrainState>
): UpdateDrivetrainAction => ({
  type: UPDATE_DRIVETRAIN,
  payload: data,
});

// Intake Actions
export const updateIntake = (
  data: Partial<IntakeState>
): UpdateIntakeAction => ({
  type: UPDATE_INTAKE,
  payload: data,
});

export const setIntakeSlideTarget = (target: number): UpdateIntakeAction => ({
  type: UPDATE_INTAKE,
  payload: { slideTarget: target },
});

// Deposit Actions
export const updateDeposit = (
  data: Partial<DepositState>
): UpdateDepositAction => ({
  type: UPDATE_DEPOSIT,
  payload: data,
});

export const setDepositSlideTarget = (target: number): UpdateDepositAction => ({
  type: UPDATE_DEPOSIT,
  payload: { slideTarget: target },
});

// Camera Actions
export const updateCameraEnhanced = (
  data: Partial<CameraEnhancedState>
): UpdateCameraEnhancedAction => ({
  type: UPDATE_CAMERA_ENHANCED,
  payload: data,
});

// General Actions
export const updateGeneral = (
  data: Partial<GeneralState>
): UpdateGeneralAction => ({
  type: UPDATE_GENERAL,
  payload: data,
});

// Enhanced Telemetry Actions
export const updateTelemetrySection = (
  sectionId: string,
  values: TelemetryValue[]
): UpdateTelemetrySectionAction => ({
  type: UPDATE_TELEMETRY_SECTION,
  sectionId,
  values,
});

export const toggleTelemetryPause = (): ToggleTelemetryPauseAction => ({
  type: TOGGLE_TELEMETRY_PAUSE,
});

// Graph Actions
export const addGraph = (config: GraphConfig): AddGraphAction => ({
  type: ADD_GRAPH,
  config,
});

export const removeGraph = (graphId: string): RemoveGraphAction => ({
  type: REMOVE_GRAPH,
  graphId,
});

export const updateGraphData = (
  graphId: string,
  dataPoint: GraphDataPoint
): UpdateGraphDataAction => ({
  type: UPDATE_GRAPH_DATA,
  graphId,
  dataPoint,
});

// Helper function to create a graph config
export const createGraphConfig = (
  title: string,
  dataKey: string,
  subsystem: string,
  options: Partial<GraphConfig> = {}
): GraphConfig => ({
  id: `${subsystem}-${dataKey}-${Date.now()}`,
  title,
  dataKey,
  subsystem,
  timeWindow: 30, // 30 seconds default
  color: '#3B82F6', // Blue default
  isVisible: true,
  ...options,
});

// Batch update actions for performance
export const batchUpdateDrivetrain = (updates: {
  position?: DrivetrainState['position'];
  velocity?: DrivetrainState['velocity'];
  acceleration?: DrivetrainState['acceleration'];
  heading?: number;
  encoders?: Partial<DrivetrainState['encoders']>;
}): UpdateDrivetrainAction => ({
  type: UPDATE_DRIVETRAIN,
  payload: updates,
});

// Servo control actions
export const updateIntakeServos = (servos: Partial<IntakeState['servos']>): UpdateIntakeAction => ({
  type: UPDATE_INTAKE,
  payload: { servos: { ...servos } },
});

export const updateDepositServos = (servos: Partial<DepositState['servos']>): UpdateDepositAction => ({
  type: UPDATE_DEPOSIT,
  payload: { servos: { ...servos } },
});

// State machine actions
export const setIntakeState = (state: IntakeState['state']): UpdateIntakeAction => ({
  type: UPDATE_INTAKE,
  payload: { state },
});

export const setDepositState = (state: DepositState['state']): UpdateDepositAction => ({
  type: UPDATE_DEPOSIT,
  payload: { state },
});

// Match timer actions
export const updateMatchTimer = (timer: Partial<GeneralState['matchTimer']>): UpdateGeneralAction => ({
  type: UPDATE_GENERAL,
  payload: { matchTimer: timer as GeneralState['matchTimer'] },
});

export const startMatch = (mode: 'AUTO' | 'TELEOP'): UpdateGeneralAction => ({
  type: UPDATE_GENERAL,
  payload: {
    matchTimer: {
      mode,
      isRunning: true,
      timeRemaining: mode === 'AUTO' ? 30 : 120,
      totalTime: mode === 'AUTO' ? 30 : 120,
    },
  },
});

export const stopMatch = (): UpdateGeneralAction => ({
  type: UPDATE_GENERAL,
  payload: {
    matchTimer: {
      mode: 'STOPPED',
      isRunning: false,
      timeRemaining: 0,
      totalTime: 150,
    },
  },
});

// Power monitoring actions
export const updatePower = (voltage: number, current: number): UpdateGeneralAction => {
  const batteryPercentage = Math.max(0, Math.min(100, ((voltage - 11.0) / 2.0) * 100));
  return {
    type: UPDATE_GENERAL,
    payload: { voltage, current, batteryPercentage },
  };
};

// Camera detection actions
export const updateDetectedObjects = (objects: CameraEnhancedState['detectedObjects']): UpdateCameraEnhancedAction => ({
  type: UPDATE_CAMERA_ENHANCED,
  payload: { detectedObjects: objects },
});

// Telemetry helper actions
export const addTelemetryValue = (section: string, key: string, value: string | number | boolean, unit?: string): UpdateTelemetrySectionAction => ({
  type: UPDATE_TELEMETRY_SECTION,
  sectionId: section,
  values: [{
    key,
    value,
    timestamp: Date.now(),
    unit,
  }],
});

// Reset actions
export const resetDrivetrain = (): UpdateDrivetrainAction => ({
  type: UPDATE_DRIVETRAIN,
  payload: {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
    heading: 0,
    positionHistory: [],
  },
});

export const resetAllSubsystems = () => (dispatch: any) => {
  dispatch(resetDrivetrain());
  dispatch(updateIntake({ 
    slidePosition: 0, 
    slideTarget: 0, 
    hasSample: false,
    state: 'IDLE',
    servos: { claw: 0, wrist: 90, arm: 45, rotation: 180 }
  }));
  dispatch(updateDeposit({ 
    slidePosition: 0, 
    slideTarget: 0, 
    isDeposited: false,
    state: 'IDLE',
    servos: { bucket: 0, arm: 90, wrist: 45, rotation: 180 }
  }));
};