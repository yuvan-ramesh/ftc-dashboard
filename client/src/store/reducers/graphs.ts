import {
  GraphsState,
  SubsystemAction,
  ADD_GRAPH,
  REMOVE_GRAPH,
  UPDATE_GRAPH_DATA,
  GraphDataPoint,
} from '../types/subsystems';

const initialState: GraphsState = {
  configs: {},
  data: {},
};

// Helper function to maintain a sliding window of data points
const updateGraphData = (
  currentData: GraphDataPoint[],
  newPoint: GraphDataPoint,
  timeWindow: number // in seconds
): GraphDataPoint[] => {
  const cutoffTime = newPoint.timestamp - (timeWindow * 1000);
  
  // Add new point and filter out old ones
  const updatedData = [...currentData, newPoint].filter(
    point => point.timestamp >= cutoffTime
  );
  
  return updatedData;
};

export default function graphsReducer(
  state: GraphsState = initialState,
  action: SubsystemAction
): GraphsState {
  switch (action.type) {
    case ADD_GRAPH:
      return {
        ...state,
        configs: {
          ...state.configs,
          [action.config.id]: action.config,
        },
        data: {
          ...state.data,
          [action.config.id]: [],
        },
      };
    
    case REMOVE_GRAPH: {
      const { [action.graphId]: removedConfig, ...remainingConfigs } = state.configs;
      const { [action.graphId]: removedData, ...remainingData } = state.data;
      
      return {
        configs: remainingConfigs,
        data: remainingData,
      };
    }
    
    case UPDATE_GRAPH_DATA: {
      const config = state.configs[action.graphId];
      if (!config) {
        return state;
      }
      
      return {
        ...state,
        data: {
          ...state.data,
          [action.graphId]: updateGraphData(
            state.data[action.graphId] || [],
            action.dataPoint,
            config.timeWindow
          ),
        },
      };
    }
    
    default:
      return state;
  }
}