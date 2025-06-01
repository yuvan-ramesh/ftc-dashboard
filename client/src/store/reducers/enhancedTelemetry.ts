import {
  EnhancedTelemetryState,
  TelemetrySection,
  SubsystemAction,
  UPDATE_TELEMETRY_SECTION,
  TOGGLE_TELEMETRY_PAUSE,
  TelemetryValue,
} from '../types/subsystems';

const createSection = (
  id: string,
  name: TelemetrySection['name']
): TelemetrySection => ({
  id,
  name,
  values: new Map(),
  isCollapsed: false,
  isVisible: true,
});

const initialState: EnhancedTelemetryState = {
  sections: [
    createSection('drivetrain', 'Drivetrain'),
    createSection('intake', 'Intake'),
    createSection('deposit', 'Deposit'),
    createSection('claw', 'Claw'),
    createSection('general', 'General'),
  ],
  isPaused: false,
  buffer: [],
  bufferSize: 1000, // Keep last 1000 telemetry packets
  graphableValues: [],
};

// Helper function to identify graphable values
const updateGraphableValues = (sections: TelemetrySection[]): string[] => {
  const graphable: string[] = [];
  
  sections.forEach(section => {
    section.values.forEach((value, key) => {
      if (typeof value.value === 'number') {
        graphable.push(`${section.id}.${key}`);
      }
    });
  });
  
  return graphable;
};

export default function enhancedTelemetryReducer(
  state: EnhancedTelemetryState = initialState,
  action: SubsystemAction
): EnhancedTelemetryState {
  switch (action.type) {
    case UPDATE_TELEMETRY_SECTION: {
      if (state.isPaused) {
        // If paused, add to buffer but don't update display
        return {
          ...state,
          buffer: [
            ...state.buffer.slice(-(state.bufferSize - 1)),
            {
              sectionId: action.sectionId,
              values: action.values,
              timestamp: Date.now(),
            },
          ],
        };
      }
      
      // Find and update the section
      const updatedSections = state.sections.map(section => {
        if (section.id === action.sectionId) {
          const newValues = new Map(section.values);
          
          // Update values
          action.values.forEach(telemetryValue => {
            newValues.set(telemetryValue.key, telemetryValue);
          });
          
          return {
            ...section,
            values: newValues,
          };
        }
        return section;
      });
      
      return {
        ...state,
        sections: updatedSections,
        graphableValues: updateGraphableValues(updatedSections),
      };
    }
    
    case TOGGLE_TELEMETRY_PAUSE: {
      if (state.isPaused) {
        // Resuming - apply buffered updates
        let sections = [...state.sections];
        
        state.buffer.forEach(packet => {
          sections = sections.map(section => {
            if (section.id === packet.sectionId) {
              const newValues = new Map(section.values);
              
              packet.values.forEach(telemetryValue => {
                newValues.set(telemetryValue.key, telemetryValue);
              });
              
              return {
                ...section,
                values: newValues,
              };
            }
            return section;
          });
        });
        
        return {
          ...state,
          sections,
          isPaused: false,
          pausedAt: undefined,
          buffer: [],
          graphableValues: updateGraphableValues(sections),
        };
      } else {
        // Pausing
        return {
          ...state,
          isPaused: true,
          pausedAt: Date.now(),
        };
      }
    }
    
    default:
      return state;
  }
}