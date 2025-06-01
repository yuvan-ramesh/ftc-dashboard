import {
  SubsystemsState,
  SubsystemAction,
  UPDATE_DRIVETRAIN,
  UPDATE_INTAKE,
  UPDATE_DEPOSIT,
  UPDATE_CAMERA_ENHANCED,
  DrivetrainState,
  IntakeState,
  DepositState,
  CameraEnhancedState,
} from '../types/subsystems';

// Initial States
const initialDrivetrainState: DrivetrainState = {
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  acceleration: { x: 0, y: 0, z: 0 },
  heading: 0,
  centerOfGravity: { x: 0, y: 0 },
  encoders: {
    leftFront: 0,
    rightFront: 0,
    leftBack: 0,
    rightBack: 0,
  },
  sensors: [],
  positionHistory: [],
};

const initialIntakeState: IntakeState = {
  slidePosition: 0,
  slideTarget: 0,
  slideMin: 0,
  slideMax: 100,
  hasSample: false,
  servoPosition: 0,
  state: 'IDLE',
  sensors: [],
};

const initialDepositState: DepositState = {
  slidePosition: 0,
  slideTarget: 0,
  slideMin: 0,
  slideMax: 100,
  isDeposited: false,
  state: 'IDLE',
  sensors: [],
};

const initialCameraState: CameraEnhancedState = {
  detectedObjects: [],
  frameRate: 0,
  processingTime: 0,
  resolution: {
    width: 640,
    height: 480,
  },
};

const initialState: SubsystemsState = {
  drivetrain: initialDrivetrainState,
  intake: initialIntakeState,
  deposit: initialDepositState,
  camera: initialCameraState,
};

// Helper function to manage position history
const updatePositionHistory = (
  currentHistory: DrivetrainState['positionHistory'],
  newPosition: DrivetrainState['position'],
  maxHistoryLength: number = 100
): DrivetrainState['positionHistory'] => {
  const newEntry = {
    position: newPosition,
    timestamp: Date.now(),
  };
  
  const updatedHistory = [...currentHistory, newEntry];
  
  // Keep only the last maxHistoryLength entries
  if (updatedHistory.length > maxHistoryLength) {
    return updatedHistory.slice(-maxHistoryLength);
  }
  
  return updatedHistory;
};

export default function subsystemsReducer(
  state: SubsystemsState = initialState,
  action: SubsystemAction
): SubsystemsState {
  switch (action.type) {
    case UPDATE_DRIVETRAIN: {
      const { position, ...otherUpdates } = action.payload;
      const newDrivetrain = {
        ...state.drivetrain,
        ...otherUpdates,
      };
      
      // Update position and position history if position changed
      if (position) {
        newDrivetrain.position = position;
        newDrivetrain.positionHistory = updatePositionHistory(
          state.drivetrain.positionHistory,
          position
        );
      }
      
      return {
        ...state,
        drivetrain: newDrivetrain,
      };
    }
    
    case UPDATE_INTAKE:
      return {
        ...state,
        intake: {
          ...state.intake,
          ...action.payload,
        },
      };
    
    case UPDATE_DEPOSIT:
      return {
        ...state,
        deposit: {
          ...state.deposit,
          ...action.payload,
        },
      };
    
    case UPDATE_CAMERA_ENHANCED:
      return {
        ...state,
        camera: {
          ...state.camera,
          ...action.payload,
        },
      };
    
    default:
      return state;
  }
}