// Graph Data Types

export interface GraphPoint {
  timestamp: number;
  value: number; // double
}

export interface Graph {
  id: string;
  values: GraphPoint[];
}

export interface GraphDataState {
  graphs: Graph[];
}

// Action Types
export const ADD_GRAPH = 'ADD_GRAPH';
export const REMOVE_GRAPH = 'REMOVE_GRAPH';
export const UPDATE_GRAPH_DATA = 'UPDATE_GRAPH_DATA';
export const CLEAR_GRAPH_DATA = 'CLEAR_GRAPH_DATA';
export const RESET_ALL_GRAPHS = 'RESET_ALL_GRAPHS';

// Action Interfaces
export interface AddGraphAction {
  type: typeof ADD_GRAPH;
  payload: Graph;
}

export interface RemoveGraphAction {
  type: typeof REMOVE_GRAPH;
  payload: string; // graph id
}

export interface UpdateGraphDataAction {
  type: typeof UPDATE_GRAPH_DATA;
  payload: {
    id: string;
    value: number;
    timestamp?: number;
  };
}

export interface ClearGraphDataAction {
  type: typeof CLEAR_GRAPH_DATA;
  payload: string; // graph id
}

export interface ResetAllGraphsAction {
  type: typeof RESET_ALL_GRAPHS;
}

export type GraphDataAction =
  | AddGraphAction
  | RemoveGraphAction
  | UpdateGraphDataAction
  | ClearGraphDataAction
  | ResetAllGraphsAction;