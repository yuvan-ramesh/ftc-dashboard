import {
  CameraFeed,
  CameraDetection,
  UpdateCameraFeedAction,
  UpdateCameraDetectionAction,
  UpdateColorDetectionAction,
  UpdateCameraStatsAction,
  ResetCameraDataAction,
  UPDATE_CAMERA_FEED,
  UPDATE_CAMERA_DETECTION,
  UPDATE_COLOR_DETECTION,
  UPDATE_CAMERA_STATS,
  RESET_CAMERA_DATA
} from '../types/cameraData';

// Update camera feed
export const updateCameraFeed = (
  feedUrl?: string,
  isActive: boolean = false
): UpdateCameraFeedAction => ({
  type: UPDATE_CAMERA_FEED,
  payload: { feedUrl, isActive }
});

// Update camera detection
export const updateCameraDetection = (
  colorName: string,
  objectCount: number,
  fps: number,
  width: number,
  height: number,
  processingTime: number
): UpdateCameraDetectionAction => ({
  type: UPDATE_CAMERA_DETECTION,
  payload: {
    colorName,
    objectCount,
    fps,
    resolution: { width, height },
    processingTime
  }
});

// Update color detection only
export const updateColorDetection = (
  colorName: string,
  objectCount: number
): UpdateColorDetectionAction => ({
  type: UPDATE_COLOR_DETECTION,
  payload: { colorName, objectCount }
});

// Update camera stats only
export const updateCameraStats = (
  fps: number,
  processingTime: number
): UpdateCameraStatsAction => ({
  type: UPDATE_CAMERA_STATS,
  payload: { fps, processingTime }
});

// Reset camera data
export const resetCameraData = (): ResetCameraDataAction => ({
  type: RESET_CAMERA_DATA
});