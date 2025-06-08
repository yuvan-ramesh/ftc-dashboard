import {
  CameraDataState,
  CameraDataAction,
  UPDATE_CAMERA_FEED,
  UPDATE_CAMERA_DETECTION,
  UPDATE_COLOR_DETECTION,
  UPDATE_CAMERA_STATS,
  RESET_CAMERA_DATA
} from '../types/cameraData';

const initialState: CameraDataState = {
  feed: {
    feedUrl: undefined,
    isActive: false
  },
  detection: {
    colorName: 'none',
    objectCount: 0,
    fps: 0,
    resolution: {
      width: 640,
      height: 480
    },
    processingTime: 0
  }
};

export default function cameraDataReducer(
  state: CameraDataState = initialState,
  action: CameraDataAction
): CameraDataState {
  switch (action.type) {
    case UPDATE_CAMERA_FEED:
      return {
        ...state,
        feed: action.payload
      };

    case UPDATE_CAMERA_DETECTION:
      return {
        ...state,
        detection: action.payload
      };

    case UPDATE_COLOR_DETECTION:
      return {
        ...state,
        detection: {
          ...state.detection,
          colorName: action.payload.colorName,
          objectCount: action.payload.objectCount
        }
      };

    case UPDATE_CAMERA_STATS:
      return {
        ...state,
        detection: {
          ...state.detection,
          fps: action.payload.fps,
          processingTime: action.payload.processingTime
        }
      };

    case RESET_CAMERA_DATA:
      return initialState;

    default:
      return state;
  }
}