import {
  GraphDataState,
  GraphDataAction,
  ADD_GRAPH,
  REMOVE_GRAPH,
  UPDATE_GRAPH_DATA,
  CLEAR_GRAPH_DATA,
  RESET_ALL_GRAPHS
} from '../types/graphData';

const initialState: GraphDataState = {
  graphs: [
    { id: 'voltage-graph', values: [] },
    { id: 'current-graph', values: [] },
    { id: 'velocity-graph', values: [] },
    { id: 'position-graph', values: [] }
  ]
};

const MAX_GRAPH_POINTS = 200; // Keep last 200 points

export default function graphDataReducer(
  state: GraphDataState = initialState,
  action: GraphDataAction
): GraphDataState {
  switch (action.type) {
    case ADD_GRAPH:
      return {
        ...state,
        graphs: [...state.graphs, action.payload]
      };

    case REMOVE_GRAPH:
      return {
        ...state,
        graphs: state.graphs.filter(graph => graph.id !== action.payload)
      };

    case UPDATE_GRAPH_DATA: {
      const { id, value, timestamp = Date.now() } = action.payload;
      return {
        ...state,
        graphs: state.graphs.map(graph =>
          graph.id === id
            ? {
                ...graph,
                values: [...graph.values, { timestamp, value }].slice(-MAX_GRAPH_POINTS)
              }
            : graph
        )
      };
    }

    case CLEAR_GRAPH_DATA:
      return {
        ...state,
        graphs: state.graphs.map(graph =>
          graph.id === action.payload
            ? { ...graph, values: [] }
            : graph
        )
      };

    case RESET_ALL_GRAPHS:
      return {
        ...state,
        graphs: state.graphs.map(graph => ({ ...graph, values: [] }))
      };

    default:
      return state;
  }
}