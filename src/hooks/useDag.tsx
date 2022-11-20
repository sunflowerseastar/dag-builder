import { createContext, useContext, useReducer } from "react";

import dag1 from "../data/dag.json";
import diamond from "../data/diamond.json";
import ex from "../data/ex.json";
import grafo from "../data/grafo.json";

import { DagType, DataChoice } from "../types";
import { isAcyclic, removeNodeFromDag, toggleParentId } from "../utilities";

// static data
export const dataChoices: DataChoice[] = [
  { name: "Diamond", data: diamond },
  { name: "Multi", data: dag1 },
  { name: "Cross", data: ex },
  { name: "Extended", data: grafo },
];

export const layeringChoices = [
  {
    name: "Simplex",
    layering: window.d3.layeringSimplex(),
  },
  {
    name: "LongestPath",
    layering: window.d3.layeringLongestPath(),
  },
  {
    name: "Coffman-Graham",
    layering: window.d3.layeringCoffmanGraham(),
  },
];
export const spacingChoices = [{ name: "Default" }, { name: "Compact" }];
export const splineChoices = [
  { name: "Linear", spline: window.d3.curveLinear, areArrowsShown: true },
  {
    name: "Catmull-Rom",
    spline: window.d3.curveCatmullRom,
    areArrowsShown: false,
  },
  {
    name: "Step Before",
    spline: window.d3.curveStepBefore,
    areArrowsShown: false,
  },
];

// types for the state and actions
type DagActions = {
  addNode(): void;
  removeNode(id: string): void;
  setActiveDataIndex(index: number): void;
  setActiveLayeringIndex(index: number): void;
  setActiveSpacingIndex(index: number): void;
  setActiveSplineIndex(index: number): void;
  toggleConnection(id: string, pid: string): void;
};
type DagState = {
  actions: DagActions;
  activeDataIndex: number;
  activeLayeringIndex: number;
  activeSpacingIndex: number;
  activeSplineIndex: number;
  dagData: DagType;
};
const initialState = {
  actions: {
    addNode: () => {},
    removeNode: () => {},
    setActiveDataIndex: () => {},
    setActiveLayeringIndex: () => {},
    setActiveSpacingIndex: () => {},
    setActiveSplineIndex: () => {},
    toggleConnection: () => {},
  },
  activeDataIndex: 0,
  activeLayeringIndex: 0,
  activeSpacingIndex: 0,
  activeSplineIndex: 0,
  dagData: dataChoices[0].data,
};

const DagContext = createContext<DagState>(initialState);
export const useDagContext = () => {
  let context = useContext(DagContext);
  if (context === undefined) {
    throw Error("Context must be used within provider");
  }
  return context;
};

// types for the reducer, action dispatchers, & provider
enum ReducerActionType {
  ADD_NODE,
  REMOVE_NODE,
  SET_ACTIVE_DATA_INDEX,
  SET_ACTIVE_LAYERING_INDEX,
  SET_ACTIVE_SPACING_INDEX,
  SET_ACTIVE_SPLINE_INDEX,
  TOGGLE_CONNECTION,
}
type addNodeAction = {
  type: ReducerActionType.ADD_NODE;
};
type removeNodeAction = {
  type: ReducerActionType.REMOVE_NODE;
  payload: string;
};
type SetActiveDataIndexAction = {
  type: ReducerActionType.SET_ACTIVE_DATA_INDEX;
  payload: number;
};
type SetActiveLayeringIndexAction = {
  type: ReducerActionType.SET_ACTIVE_LAYERING_INDEX;
  payload: number;
};
type SetActiveSpacingIndexAction = {
  type: ReducerActionType.SET_ACTIVE_SPACING_INDEX;
  payload: number;
};
type SetActiveSplineIndexAction = {
  type: ReducerActionType.SET_ACTIVE_SPLINE_INDEX;
  payload: number;
};
type toggleConnectionAction = {
  type: ReducerActionType.TOGGLE_CONNECTION;
  payload: {
    id: string;
    pid: string;
  };
};
type Action =
  | addNodeAction
  | removeNodeAction
  | SetActiveDataIndexAction
  | SetActiveLayeringIndexAction
  | SetActiveSpacingIndexAction
  | SetActiveSplineIndexAction
  | toggleConnectionAction;
interface IDagProvider {
  children: React.ReactNode;
}

export const DagProvider: React.FC<IDagProvider> = ({ children }) => {
  function reducer(state: DagState, action: Action) {
    switch (action.type) {
      case ReducerActionType.ADD_NODE:
        const nextId =
          Math.max(...state.dagData.map(({ id }) => parseInt(id))) + 1;
        return {
          ...state,
          dagData: [...state.dagData, { id: nextId.toString() }],
        };
      case ReducerActionType.REMOVE_NODE:
        return {
          ...state,
          dagData: removeNodeFromDag(state.dagData, action.payload),
        };
      case ReducerActionType.SET_ACTIVE_DATA_INDEX:
        return {
          ...state,
          activeDataIndex: action.payload,
          dagData: dataChoices[action.payload].data,
        };
      case ReducerActionType.SET_ACTIVE_LAYERING_INDEX:
        return { ...state, activeLayeringIndex: action.payload };
      case ReducerActionType.SET_ACTIVE_SPACING_INDEX:
        return { ...state, activeSpacingIndex: action.payload };
      case ReducerActionType.SET_ACTIVE_SPLINE_INDEX:
        return { ...state, activeSplineIndex: action.payload };
      case ReducerActionType.TOGGLE_CONNECTION:
        const potentialNewGraph = toggleParentId(
          state.dagData,
          action.payload.id,
          action.payload.pid
        );
        const newDagData = isAcyclic(potentialNewGraph)
          ? potentialNewGraph
          : state.dagData;

        return { ...state, dagData: newDagData };
      default:
        console.error("Unhandled action type", action);
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  // action dispatchers
  const addNode = () =>
    dispatch({
      type: ReducerActionType.ADD_NODE,
    });
  const removeNode = (id: string) =>
    dispatch({
      type: ReducerActionType.REMOVE_NODE,
      payload: id,
    });
  const setActiveDataIndex = (i: number) =>
    dispatch({
      type: ReducerActionType.SET_ACTIVE_DATA_INDEX,
      payload: i,
    });
  const setActiveLayeringIndex = (i: number) =>
    dispatch({
      type: ReducerActionType.SET_ACTIVE_LAYERING_INDEX,
      payload: i,
    });
  const setActiveSpacingIndex = (i: number) =>
    dispatch({
      type: ReducerActionType.SET_ACTIVE_SPACING_INDEX,
      payload: i,
    });
  const setActiveSplineIndex = (i: number) =>
    dispatch({
      type: ReducerActionType.SET_ACTIVE_SPLINE_INDEX,
      payload: i,
    });
  const toggleConnection = (id: string, pid: string) =>
    dispatch({
      type: ReducerActionType.TOGGLE_CONNECTION,
      payload: { id, pid },
    });

  const actions = {
    addNode,
    removeNode,
    setActiveDataIndex,
    setActiveLayeringIndex,
    setActiveSpacingIndex,
    setActiveSplineIndex,
    toggleConnection,
  };

  return (
    <DagContext.Provider value={{ ...state, actions }}>
      {children}
    </DagContext.Provider>
  );
};
