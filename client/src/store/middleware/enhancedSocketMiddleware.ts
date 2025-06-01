import { Middleware } from 'redux';
import { RootState } from '@/store/reducers';
import {
  updateDrivetrain,
  updateIntake,
  updateDeposit,
  updateCameraEnhanced,
  updateGeneral,
  updateTelemetrySection,
  updateGraphData,
} from '@/store/actions/subsystems';
import {
  DrivetrainState,
  IntakeState,
  DepositState,
  CameraEnhancedState,
  GeneralState,
  TelemetryValue,
} from '@/store/types/subsystems';

// Message types from the robot
interface SubsystemUpdateMessage {
  type: 'SUBSYSTEM_UPDATE';
  subsystem: 'drivetrain' | 'intake' | 'deposit' | 'camera' | 'general';
  data: any;
  timestamp: number;
}

interface TelemetryUpdateMessage {
  type: 'TELEMETRY_UPDATE';
  section: string;
  values: Array<{
    key: string;
    value: string | number | boolean;
    unit?: string;
  }>;
  timestamp: number;
}

const enhancedSocketMiddleware: Middleware<Record<string, unknown>, RootState> =
  (store) => (next) => (action) => {
    // Handle incoming WebSocket messages
    if (action.type === 'WEBSOCKET_MESSAGE') {
      const message = action.payload;
      
      switch (message.type) {
        case 'SUBSYSTEM_UPDATE':
          handleSubsystemUpdate(store, message);
          break;
          
        case 'TELEMETRY_UPDATE':
          handleTelemetryUpdate(store, message);
          break;
          
        default:
          // Pass through other message types
          break;
      }
    }
    
    // Handle outgoing messages
    switch (action.type) {
      case 'SET_INTAKE_SLIDE_TARGET':
      case 'SET_DEPOSIT_SLIDE_TARGET':
        // Send these commands to the robot
        if (window.socket && window.socket.readyState === WebSocket.OPEN) {
          window.socket.send(JSON.stringify(action));
        }
        break;
    }
    
    return next(action);
  };

function handleSubsystemUpdate(store: any, message: SubsystemUpdateMessage) {
  const { subsystem, data, timestamp } = message;
  
  switch (subsystem) {
    case 'drivetrain':
      store.dispatch(updateDrivetrain(data as Partial<DrivetrainState>));
      
      // Update graphs for drivetrain data
      if (data.position) {
        updateDrivetrainGraphs(store, data, timestamp);
      }
      break;
      
    case 'intake':
      store.dispatch(updateIntake(data as Partial<IntakeState>));
      
      // Update graphs for intake data
      if (data.pidData) {
        updatePIDGraph(store, 'intake', data.pidData, timestamp);
      }
      break;
      
    case 'deposit':
      store.dispatch(updateDeposit(data as Partial<DepositState>));
      
      // Update graphs for deposit data
      if (data.pidData) {
        updatePIDGraph(store, 'deposit', data.pidData, timestamp);
      }
      break;
      
    case 'camera':
      store.dispatch(updateCameraEnhanced(data as Partial<CameraEnhancedState>));
      break;
      
    case 'general':
      store.dispatch(updateGeneral(data as Partial<GeneralState>));
      
      // Update voltage/current graphs
      if (data.voltage !== undefined) {
        store.dispatch(updateGraphData('general-voltage', {
          timestamp,
          value: data.voltage,
        }));
      }
      if (data.current !== undefined) {
        store.dispatch(updateGraphData('general-current', {
          timestamp,
          value: data.current,
        }));
      }
      break;
  }
}

function handleTelemetryUpdate(store: any, message: TelemetryUpdateMessage) {
  const telemetryValues: TelemetryValue[] = message.values.map(v => ({
    key: v.key,
    value: v.value,
    unit: v.unit,
    timestamp: message.timestamp,
  }));
  
  store.dispatch(updateTelemetrySection(message.section, telemetryValues));
  
  // Update graphs for numeric telemetry values
  const state = store.getState();
  const graphConfigs = state.graphs.configs;
  
  message.values.forEach(value => {
    if (typeof value.value === 'number') {
      const graphKey = `${message.section}.${value.key}`;
      
      // Check if there's a graph configured for this value
      Object.values(graphConfigs).forEach((config: any) => {
        if (config.dataKey === graphKey && config.isVisible) {
          store.dispatch(updateGraphData(config.id, {
            timestamp: message.timestamp,
            value: value.value as number,
          }));
        }
      });
    }
  });
}

function updateDrivetrainGraphs(store: any, data: any, timestamp: number) {
  // Update position graphs
  if (data.position) {
    store.dispatch(updateGraphData('drivetrain-x', {
      timestamp,
      value: data.position.x,
    }));
    store.dispatch(updateGraphData('drivetrain-y', {
      timestamp,
      value: data.position.y,
    }));
  }
  
  // Update velocity graphs
  if (data.velocity) {
    store.dispatch(updateGraphData('drivetrain-velocity', {
      timestamp,
      value: Math.sqrt(
        data.velocity.x ** 2 + 
        data.velocity.y ** 2 + 
        data.velocity.z ** 2
      ),
    }));
  }
  
  // Update acceleration graphs
  if (data.acceleration) {
    store.dispatch(updateGraphData('drivetrain-acceleration', {
      timestamp,
      value: Math.sqrt(
        data.acceleration.x ** 2 + 
        data.acceleration.y ** 2 + 
        data.acceleration.z ** 2
      ),
    }));
  }
}

function updatePIDGraph(store: any, subsystem: string, pidData: any, timestamp: number) {
  // Update PID error graph
  store.dispatch(updateGraphData(`${subsystem}-pid-error`, {
    timestamp,
    value: pidData.error,
  }));
  
  // Update PID output graph
  store.dispatch(updateGraphData(`${subsystem}-pid-output`, {
    timestamp,
    value: pidData.output,
  }));
  
  // Update setpoint vs actual graph
  store.dispatch(updateGraphData(`${subsystem}-pid-setpoint`, {
    timestamp,
    value: pidData.setpoint,
  }));
  store.dispatch(updateGraphData(`${subsystem}-pid-actual`, {
    timestamp,
    value: pidData.actual,
  }));
}

// Extend window object to store socket reference
declare global {
  interface Window {
    socket: WebSocket;
  }
}

export default enhancedSocketMiddleware;