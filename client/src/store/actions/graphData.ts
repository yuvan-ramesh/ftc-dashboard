import {
  Graph,
  AddGraphAction,
  RemoveGraphAction,
  UpdateGraphDataAction,
  ClearGraphDataAction,
  ResetAllGraphsAction,
  ADD_GRAPH,
  REMOVE_GRAPH,
  UPDATE_GRAPH_DATA,
  CLEAR_GRAPH_DATA,
  RESET_ALL_GRAPHS
} from '../types/graphData';

// Add new graph
export const addGraph = (id: string): AddGraphAction => ({
  type: ADD_GRAPH,
  payload: { id, values: [] }
});

// Remove graph
export const removeGraph = (id: string): RemoveGraphAction => ({
  type: REMOVE_GRAPH,
  payload: id
});

// Update graph data
export const updateGraphData = (
  id: string,
  value: number,
  timestamp?: number
): UpdateGraphDataAction => ({
  type: UPDATE_GRAPH_DATA,
  payload: { id, value, timestamp }
});

// Clear graph data
export const clearGraphData = (id: string): ClearGraphDataAction => ({
  type: CLEAR_GRAPH_DATA,
  payload: id
});

// Reset all graphs
export const resetAllGraphs = (): ResetAllGraphsAction => ({
  type: RESET_ALL_GRAPHS
});