// Camera Data Types

export interface CameraFeed {
  feedUrl?: string;
  isActive: boolean;
}

export interface CameraDetection {
  colorName: string;
  objectCount: number; // int
  fps: number; // int
  resolution: {
    width: number; // int
    height: number; // int
  };
  processingTime: number; // int (ms)
}

export interface CameraDataState {
  feed: CameraFeed;
  detection: CameraDetection;
}

// Action Types
export const UPDATE_CAMERA_FEED = 'UPDATE_CAMERA_FEED';
export const UPDATE_CAMERA_DETECTION = 'UPDATE_CAMERA_DETECTION';
export const UPDATE_COLOR_DETECTION = 'UPDATE_COLOR_DETECTION';
export const UPDATE_CAMERA_STATS = 'UPDATE_CAMERA_STATS';
export const RESET_CAMERA_DATA = 'RESET_CAMERA_DATA';

// Action Interfaces
export interface UpdateCameraFeedAction {
  type: typeof UPDATE_CAMERA_FEED;
  payload: CameraFeed;
}

export interface UpdateCameraDetectionAction {
  type: typeof UPDATE_CAMERA_DETECTION;
  payload: CameraDetection;
}

export interface UpdateColorDetectionAction {
  type: typeof UPDATE_COLOR_DETECTION;
  payload: {
    colorName: string;
    objectCount: number;
  };
}

export interface UpdateCameraStatsAction {
  type: typeof UPDATE_CAMERA_STATS;
  payload: {
    fps: number;
    processingTime: number;
  };
}

export interface ResetCameraDataAction {
  type: typeof RESET_CAMERA_DATA;
}

export type CameraDataAction =
  | UpdateCameraFeedAction
  | UpdateCameraDetectionAction
  | UpdateColorDetectionAction
  | UpdateCameraStatsAction
  | ResetCameraDataAction;