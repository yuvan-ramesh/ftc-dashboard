// Slides Types

export interface Slide {
  position: number; // double equivalent
}

export interface SlidesState {
  intake: Slide;
  deposit: Slide;
}

// Action Types
export const UPDATE_INTAKE_SLIDE = 'UPDATE_INTAKE_SLIDE';
export const UPDATE_DEPOSIT_SLIDE = 'UPDATE_DEPOSIT_SLIDE';
export const UPDATE_BOTH_SLIDES = 'UPDATE_BOTH_SLIDES';
export const RESET_SLIDES = 'RESET_SLIDES';

// Action Interfaces
export interface UpdateIntakeSlideAction {
  type: typeof UPDATE_INTAKE_SLIDE;
  payload: number;
}

export interface UpdateDepositSlideAction {
  type: typeof UPDATE_DEPOSIT_SLIDE;
  payload: number;
}

export interface UpdateBothSlidesAction {
  type: typeof UPDATE_BOTH_SLIDES;
  payload: {
    intake: number;
    deposit: number;
  };
}

export interface ResetSlidesAction {
  type: typeof RESET_SLIDES;
}

export type SlidesAction =
  | UpdateIntakeSlideAction
  | UpdateDepositSlideAction
  | UpdateBothSlidesAction
  | ResetSlidesAction;