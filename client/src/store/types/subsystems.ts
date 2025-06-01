// Subsystem Types for Enhanced FTC Dashboard

// Common types
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PIDData {
  setpoint: number;
  actual: number;
  error: number;
  output: number;
  kP: number;
  kI: number;
  kD: number;
  integral: number;
  derivative: number;
  timestamp: number;
}

export interface SensorData {
  name: string;
  value: number;
  unit?: string;
  timestamp: number;
}

// Drivetrain Types
export interface DrivetrainState {
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
  heading: number; // theta/z rotation in radians
  centerOfGravity: {
    x: number;
    y: number;
  };
  encoders: {
    leftFront: number;
    rightFront: number;
    leftBack: number;
    rightBack: number;
  };
  sensors: SensorData[];
  pidData?: PIDData;
  positionHistory: Array<{
    position: Vector3;
    timestamp: number;
  }>;
}

// Intake Types
export interface IntakeState {
  slidePosition: number;
  slideTarget: number;
  slideMin: number;
  slideMax: number;
  hasSample: boolean;
  servoPosition: number;
  state: 'IDLE' | 'EXTENDING' | 'RETRACTING' | 'GRABBING' | 'RELEASING';
  sensors: SensorData[];
  pidData?: PIDData;
}

// Deposit Types
export interface DepositState {
  slidePosition: number;
  slideTarget: number;
  slideMin: number;
  slideMax: number;
  isDeposited: boolean;
  state: 'IDLE' | 'EXTENDING' | 'RETRACTING' | 'DEPOSITING' | 'RESETTING';
  sensors: SensorData[];
  pidData?: PIDData;
}

// Camera Types
export interface DetectedObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  confidence: number;
}

export interface CameraEnhancedState {
  detectedObjects: DetectedObject[];
  frameRate: number;
  processingTime: number;
  resolution: {
    width: number;
    height: number;
  };
}

// General Dashboard Types
export interface GeneralState {
  voltage: number;
  current: number;
  batteryPercentage: number;
  matchTimer: {
    mode: 'AUTO' | 'TELEOP' | 'STOPPED';
    timeRemaining: number; // in seconds
    totalTime: number; // in seconds
    isRunning: boolean;
  };
}

// Enhanced Telemetry Types
export interface TelemetrySection {
  id: string;
  name: 'Drivetrain' | 'Intake' | 'Deposit' | 'Claw' | 'General';
  values: Map<string, TelemetryValue>;
  isCollapsed: boolean;
  isVisible: boolean;
}

export interface TelemetryValue {
  key: string;
  value: string | number | boolean;
  timestamp: number;
  unit?: string;
}

export interface EnhancedTelemetryState {
  sections: TelemetrySection[];
  isPaused: boolean;
  pausedAt?: number;
  buffer: TelemetryPacket[];
  bufferSize: number;
  graphableValues: string[]; // List of keys that can be graphed
}

export interface TelemetryPacket {
  sectionId: string;
  values: TelemetryValue[];
  timestamp: number;
}

// Graph Configuration
export interface GraphConfig {
  id: string;
  title: string;
  dataKey: string;
  subsystem: string;
  timeWindow: number; // seconds
  yAxisMin?: number;
  yAxisMax?: number;
  color: string;
  isVisible: boolean;
}

export interface GraphsState {
  configs: { [key: string]: GraphConfig };
  data: { [graphId: string]: GraphDataPoint[] };
}

export interface GraphDataPoint {
  timestamp: number;
  value: number;
}

// Combined Subsystems State
export interface SubsystemsState {
  drivetrain: DrivetrainState;
  intake: IntakeState;
  deposit: DepositState;
  camera: CameraEnhancedState;
}

// Action Types
export const UPDATE_DRIVETRAIN = 'UPDATE_DRIVETRAIN';
export const UPDATE_INTAKE = 'UPDATE_INTAKE';
export const UPDATE_DEPOSIT = 'UPDATE_DEPOSIT';
export const UPDATE_CAMERA_ENHANCED = 'UPDATE_CAMERA_ENHANCED';
export const UPDATE_GENERAL = 'UPDATE_GENERAL';
export const UPDATE_TELEMETRY_SECTION = 'UPDATE_TELEMETRY_SECTION';
export const TOGGLE_TELEMETRY_PAUSE = 'TOGGLE_TELEMETRY_PAUSE';
export const ADD_GRAPH = 'ADD_GRAPH';
export const REMOVE_GRAPH = 'REMOVE_GRAPH';
export const UPDATE_GRAPH_DATA = 'UPDATE_GRAPH_DATA';

// Action Interfaces
export interface UpdateDrivetrainAction {
  type: typeof UPDATE_DRIVETRAIN;
  payload: Partial<DrivetrainState>;
}

export interface UpdateIntakeAction {
  type: typeof UPDATE_INTAKE;
  payload: Partial<IntakeState>;
}

export interface UpdateDepositAction {
  type: typeof UPDATE_DEPOSIT;
  payload: Partial<DepositState>;
}

export interface UpdateCameraEnhancedAction {
  type: typeof UPDATE_CAMERA_ENHANCED;
  payload: Partial<CameraEnhancedState>;
}

export interface UpdateGeneralAction {
  type: typeof UPDATE_GENERAL;
  payload: Partial<GeneralState>;
}

export interface UpdateTelemetrySectionAction {
  type: typeof UPDATE_TELEMETRY_SECTION;
  sectionId: string;
  values: TelemetryValue[];
}

export interface ToggleTelemetryPauseAction {
  type: typeof TOGGLE_TELEMETRY_PAUSE;
}

export interface AddGraphAction {
  type: typeof ADD_GRAPH;
  config: GraphConfig;
}

export interface RemoveGraphAction {
  type: typeof REMOVE_GRAPH;
  graphId: string;
}

export interface UpdateGraphDataAction {
  type: typeof UPDATE_GRAPH_DATA;
  graphId: string;
  dataPoint: GraphDataPoint;
}

export type SubsystemAction =
  | UpdateDrivetrainAction
  | UpdateIntakeAction
  | UpdateDepositAction
  | UpdateCameraEnhancedAction
  | UpdateGeneralAction
  | UpdateTelemetrySectionAction
  | ToggleTelemetryPauseAction
  | AddGraphAction
  | RemoveGraphAction
  | UpdateGraphDataAction;