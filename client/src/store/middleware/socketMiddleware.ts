import { Middleware } from 'redux';

import { RootState, AppThunkDispatch } from '@/store/reducers';
import {
  receiveConnectionStatus,
  receivePingTime,
} from '@/store/actions/socket';
import {
  GET_ROBOT_STATUS,
  INIT_OP_MODE,
  RECEIVE_GAMEPAD_STATE,
  RECEIVE_ROBOT_STATUS,
  START_OP_MODE,
  STOP_OP_MODE,
} from '@/store/types';
import {
  updateDrivetrain,
  updateIntake,
  updateDeposit,
  updateCameraEnhanced,
  updateGeneral,
  updateTelemetrySection,
  updateGraphData,
} from '@/store/actions/subsystems';

let socket: WebSocket;
let statusSentTime: number;

export function startSocketWatcher(dispatch: AppThunkDispatch) {
  setInterval(() => {
    if (socket === undefined || socket.readyState === WebSocket.CLOSED) {
      socket = new WebSocket(
        `ws://${
          import.meta.env['VITE_REACT_APP_HOST'] || window.location.hostname
        }:${import.meta.env['VITE_REACT_APP_PORT']}`,
      );

      socket.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        
        // Handle enhanced message types
        if (msg.type === 'SUBSYSTEM_UPDATE') {
          handleSubsystemUpdate(dispatch, msg);
        } else if (msg.type === 'TELEMETRY_UPDATE') {
          handleTelemetryUpdate(dispatch, msg);
        } else {
          // Handle standard messages
          dispatch(msg);
        }
      };

      socket.onopen = () => {
        dispatch(receiveConnectionStatus(true));
      };

      socket.onclose = () => {
        dispatch(receiveConnectionStatus(false));
      };
    } else if (socket.readyState === WebSocket.OPEN) {
      statusSentTime = Date.now();
      socket.send(JSON.stringify({ type: 'GET_ROBOT_STATUS' }));
    }

    dispatch(receiveConnectionStatus(socket.readyState === WebSocket.OPEN));
  }, 1000);
}

const socketMiddleware: Middleware<Record<string, unknown>, RootState> =
  (store) => (next) => (action) => {
    switch (action.type) {
      case RECEIVE_ROBOT_STATUS: {
        const pingTime = Date.now() - statusSentTime;
        store.dispatch(receivePingTime(pingTime));

        next(action);

        break;
      }
      // messages forwarded to the server
      case RECEIVE_GAMEPAD_STATE:
      case GET_ROBOT_STATUS:
      case 'SAVE_CONFIG':
      case 'GET_CONFIG':
      case INIT_OP_MODE:
      case START_OP_MODE:
      case STOP_OP_MODE:
      case 'SET_INTAKE_SLIDE_TARGET':
      case 'SET_DEPOSIT_SLIDE_TARGET': {
        if (socket !== undefined && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(action));
        }

        next(action);

        break;
      }
      default:
        next(action);

        break;
    }
  };

// Handler functions for enhanced message types
function handleSubsystemUpdate(dispatch: AppThunkDispatch, message: any) {
  const { subsystem, data, timestamp } = message;
  
  switch (subsystem) {
    case 'drivetrain':
      dispatch(updateDrivetrain(data));
      // Update graphs for drivetrain data
      if (data.position) {
        updateDrivetrainGraphs(dispatch, data, timestamp);
      }
      break;
      
    case 'intake':
      dispatch(updateIntake(data));
      if (data.pidData) {
        updatePIDGraph(dispatch, 'intake', data.pidData, timestamp);
      }
      break;
      
    case 'deposit':
      dispatch(updateDeposit(data));
      if (data.pidData) {
        updatePIDGraph(dispatch, 'deposit', data.pidData, timestamp);
      }
      break;
      
    case 'camera':
      dispatch(updateCameraEnhanced(data));
      break;
      
    case 'general':
      dispatch(updateGeneral(data));
      if (data.voltage !== undefined) {
        dispatch(updateGraphData('general-voltage', {
          timestamp,
          value: data.voltage,
        }));
      }
      if (data.current !== undefined) {
        dispatch(updateGraphData('general-current', {
          timestamp,
          value: data.current,
        }));
      }
      break;
  }
}

function handleTelemetryUpdate(dispatch: AppThunkDispatch, message: any) {
  const telemetryValues = message.values.map((v: any) => ({
    key: v.key,
    value: v.value,
    unit: v.unit,
    timestamp: message.timestamp,
  }));
  
  dispatch(updateTelemetrySection(message.section, telemetryValues));
}

function updateDrivetrainGraphs(dispatch: AppThunkDispatch, data: any, timestamp: number) {
  if (data.position) {
    dispatch(updateGraphData('drivetrain-x', {
      timestamp,
      value: data.position.x,
    }));
    dispatch(updateGraphData('drivetrain-y', {
      timestamp,
      value: data.position.y,
    }));
  }
  
  if (data.velocity) {
    const velocityMag = Math.sqrt(
      data.velocity.x ** 2 + 
      data.velocity.y ** 2 + 
      data.velocity.z ** 2
    );
    dispatch(updateGraphData('drivetrain-velocity', {
      timestamp,
      value: velocityMag,
    }));
  }
}

function updatePIDGraph(dispatch: AppThunkDispatch, subsystem: string, pidData: any, timestamp: number) {
  dispatch(updateGraphData(`${subsystem}-pid-error`, {
    timestamp,
    value: pidData.error,
  }));
  
  dispatch(updateGraphData(`${subsystem}-pid-output`, {
    timestamp,
    value: pidData.output,
  }));
  
  dispatch(updateGraphData(`${subsystem}-pid-setpoint`, {
    timestamp,
    value: pidData.setpoint,
  }));
  
  dispatch(updateGraphData(`${subsystem}-pid-actual`, {
    timestamp,
    value: pidData.actual,
  }));
}

// Make socket globally accessible
if (typeof window !== 'undefined') {
  (window as any).dashboardSocket = socket;
}

export default socketMiddleware;
