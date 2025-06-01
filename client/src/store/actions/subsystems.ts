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