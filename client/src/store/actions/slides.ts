import {
  UpdateIntakeSlideAction,
  UpdateDepositSlideAction,
  UpdateBothSlidesAction,
  ResetSlidesAction,
  UPDATE_INTAKE_SLIDE,
  UPDATE_DEPOSIT_SLIDE,
  UPDATE_BOTH_SLIDES,
  RESET_SLIDES
} from '../types/slides';

// Update intake slide position
export const updateIntakeSlide = (position: number): UpdateIntakeSlideAction => ({
  type: UPDATE_INTAKE_SLIDE,
  payload: position
});

// Update deposit slide position
export const updateDepositSlide = (position: number): UpdateDepositSlideAction => ({
  type: UPDATE_DEPOSIT_SLIDE,
  payload: position
});

// Update both slides at once
export const updateBothSlides = (intake: number, deposit: number): UpdateBothSlidesAction => ({
  type: UPDATE_BOTH_SLIDES,
  payload: { intake, deposit }
});

// Reset slides to initial positions
export const resetSlides = (): ResetSlidesAction => ({
  type: RESET_SLIDES
});