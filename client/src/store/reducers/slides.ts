import {
  SlidesState,
  SlidesAction,
  UPDATE_INTAKE_SLIDE,
  UPDATE_DEPOSIT_SLIDE,
  UPDATE_BOTH_SLIDES,
  RESET_SLIDES
} from '../types/slides';

const initialState: SlidesState = {
  intake: {
    position: 0
  },
  deposit: {
    position: 0
  }
};

export default function slidesReducer(
  state: SlidesState = initialState,
  action: SlidesAction
): SlidesState {
  switch (action.type) {
    case UPDATE_INTAKE_SLIDE:
      return {
        ...state,
        intake: {
          position: action.payload
        }
      };

    case UPDATE_DEPOSIT_SLIDE:
      return {
        ...state,
        deposit: {
          position: action.payload
        }
      };

    case UPDATE_BOTH_SLIDES:
      return {
        ...state,
        intake: {
          position: action.payload.intake
        },
        deposit: {
          position: action.payload.deposit
        }
      };

    case RESET_SLIDES:
      return initialState;

    default:
      return state;
  }
}